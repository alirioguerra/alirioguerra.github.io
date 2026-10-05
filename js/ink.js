// Organic ink blob that trails the pointer. Rendered as white metaballs on a
// transparent canvas; the canvas uses mix-blend-mode: difference, so the blob
// inverts whatever sits under it (white ink on the dark theme, black on light).
(function () {
  const CHAIN = 8;
  const SATELLITES = 4;
  const POINTS = CHAIN + SATELLITES;
  const IDLE_AFTER_MS = 4000;

  const VERTEX = `
    attribute vec2 aPosition;
    void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
  `;

  const FRAGMENT = `
    #ifdef GL_OES_standard_derivatives
    #extension GL_OES_standard_derivatives : enable
    #endif
    precision highp float;

    uniform vec2 uResolution;
    uniform float uTime;
    uniform float uRadius;
    uniform vec3 uPoints[${POINTS}];

    vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
      m = m * m;
      m = m * m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
      vec3 g;
      g.x = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 p = gl_FragCoord.xy;
      vec2 q = p / max(uRadius, 1.0);

      // Warp the sample position so the edge wobbles like liquid.
      vec2 warp = vec2(
        snoise(q * 0.55 + vec2(uTime * 0.12, 0.0)),
        snoise(q * 0.55 + vec2(7.3, -uTime * 0.1))
      );
      p += warp * uRadius * 0.28;

      float field = 0.0;
      for (int i = 0; i < ${POINTS}; i++) {
        vec2 d = p - uPoints[i].xy;
        float r = uPoints[i].z;
        field += (r * r) / (dot(d, d) + 1.0);
      }

      // Clamp so the spikes at each ball's centre don't break the antialiasing.
      field = min(field, 3.0);
      float detail = snoise(q * 1.4 - uTime * 0.18) * 0.14 + snoise(q * 3.2 + uTime * 0.25) * 0.05;
      float v = field - 1.0 + detail;

      #ifdef GL_OES_standard_derivatives
      float aa = fwidth(v) * 0.75;
      #else
      float aa = 0.02;
      #endif
      float alpha = smoothstep(-aa, aa, v);
      gl_FragColor = vec4(alpha);
    }
  `;

  function compile(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function createInk(canvas) {
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl) return null;
    gl.getExtension("OES_standard_derivatives");

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    if (!vertex || !fragment) return null;

    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uRadius = gl.getUniformLocation(program, "uRadius");
    const uPoints = gl.getUniformLocation(program, "uPoints");
    const pointData = new Float32Array(POINTS * 3);

    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const maxDpr = coarsePointer ? 1 : 1.5;

    // Chain weights: head is heaviest; normalised so the resting blob has radius R.
    const weights = Array.from({ length: CHAIN }, (_, i) => 1 - (i / CHAIN) * 0.65);
    const weightNorm = Math.sqrt(weights.reduce((sum, w) => sum + w * w, 0));

    let width = 0;
    let height = 0;
    let dpr = 1;
    let baseRadius = 0;
    let grow = 0;
    let swell = 0;
    let started = false;
    let running = false;
    let active = true;
    let frame = 0;
    let lastTime = 0;
    let lastPointerAt = -Infinity;
    const target = { x: 0, y: 0 };
    const chain = Array.from({ length: CHAIN }, () => ({ x: 0, y: 0 }));

    function resize() {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      width = Math.max(1, Math.round(rect.width * dpr));
      height = Math.max(1, Math.round(rect.height * dpr));
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      baseRadius = Math.min(Math.max(Math.min(rect.width, rect.height) * 0.2, 80), 200) * dpr;
    }

    function wanderTarget(t) {
      const cx = width * (coarsePointer ? 0.5 : 0.68);
      const cy = height * 0.58;
      return {
        x: cx + Math.sin(t * 0.31) * width * 0.16 + Math.sin(t * 0.13) * width * 0.06,
        y: cy + Math.cos(t * 0.23) * height * 0.14,
      };
    }

    function onPointerMove(event) {
      const rect = canvas.getBoundingClientRect();
      target.x = (event.clientX - rect.left) * dpr;
      target.y = (rect.height - (event.clientY - rect.top)) * dpr;
      lastPointerAt = performance.now();
    }

    function render(now) {
      if (!running) return;
      frame = requestAnimationFrame(render);

      const dt = Math.min((now - (lastTime || now)) / 1000, 0.05);
      lastTime = now;
      const t = now / 1000;
      const ease = (k) => 1 - Math.pow(1 - k, dt * 60);

      if (now - lastPointerAt > IDLE_AFTER_MS) {
        const wander = wanderTarget(t);
        target.x = wander.x;
        target.y = wander.y;
      }

      const head = chain[0];
      const prevX = head.x;
      const prevY = head.y;
      head.x += (target.x - head.x) * ease(0.09);
      head.y += (target.y - head.y) * ease(0.09);
      for (let i = 1; i < CHAIN; i++) {
        chain[i].x += (chain[i - 1].x - chain[i].x) * ease(0.24);
        chain[i].y += (chain[i - 1].y - chain[i].y) * ease(0.24);
      }

      const speed = dt > 0 ? Math.hypot(head.x - prevX, head.y - prevY) / dt / dpr : 0;
      swell += (Math.min(speed / 2500, 0.35) - swell) * ease(0.04);
      grow += (1 - grow) * ease(0.025);

      const radius = baseRadius * grow * (1 + swell);
      for (let i = 0; i < CHAIN; i++) {
        pointData[i * 3] = chain[i].x;
        pointData[i * 3 + 1] = chain[i].y;
        pointData[i * 3 + 2] = (radius * weights[i]) / weightNorm;
      }
      // Satellites drift in and out of the main body, detaching as droplets.
      for (let k = 0; k < SATELLITES; k++) {
        const angle = t * (k % 2 ? 0.27 : -0.21) + k * 1.7;
        const distance = radius * (1.05 + 0.4 * Math.sin(t * (0.5 + k * 0.17) + k * 2.1));
        const index = (CHAIN + k) * 3;
        const anchor = chain[Math.min(k * 2, CHAIN - 1)];
        pointData[index] = anchor.x + Math.cos(angle) * distance;
        pointData[index + 1] = anchor.y + Math.sin(angle) * distance;
        pointData[index + 2] = radius * (0.16 + 0.05 * Math.sin(t * 0.9 + k));
      }

      gl.uniform2f(uResolution, width, height);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uRadius, radius);
      gl.uniform3fv(uPoints, pointData);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    function syncRunning() {
      const shouldRun = started && active && !document.hidden;
      if (shouldRun === running) return;
      running = shouldRun;
      if (running) {
        lastTime = 0;
        frame = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(frame);
      }
    }

    resize();
    const start = wanderTarget(performance.now() / 1000);
    target.x = start.x;
    target.y = start.y;
    chain.forEach((point) => {
      point.x = start.x;
      point.y = start.y;
    });

    new ResizeObserver(resize).observe(canvas);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", syncRunning);

    return {
      start() {
        started = true;
        syncRunning();
      },
      setActive(value) {
        active = value;
        syncRunning();
      },
    };
  }

  window.createInk = createInk;
})();
