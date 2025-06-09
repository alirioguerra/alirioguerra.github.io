/**
 * Initialize all animations for the main page
 */
export function initializeAnimations() {
  const gsap = window.gsap;
  if (!gsap) {
    console.warn('GSAP not loaded. Animations will not work.');
    return;
  }

  // Name animation
  gsap.from('#name', {
    duration: 1,
    y: -50,
    opacity: 0,
    ease: 'power3.out'
  });

  // Role animation
  gsap.from('#role', {
    duration: 1.2,
    y: 50,
    opacity: 0,
    ease: 'power3.out',
    delay: 0.3
  });

  // Experience animation
  gsap.from('#experience', {
    duration: 1,
    y: 30,
    opacity: 0,
    ease: 'power3.out',
    delay: 0.6
  });

  // Language toggle animation
  gsap.from('.lang-toggle', {
    duration: 0.8,
    scale: 0,
    opacity: 0,
    ease: 'back.out(1.7)',
    stagger: 0.2
  });
}

/**
 * Animate text content changes
 * @param {HTMLElement[]} elements - Array of elements to animate
 * @param {Function} updateContent - Function to update content
 */
export function animateContentChange(elements, updateContent) {
  const gsap = window.gsap;
  if (!gsap) {
    updateContent();
    return;
  }

  gsap.to(elements, {
    duration: 0.5,
    opacity: 0,
    y: 20,
    onComplete: () => {
      updateContent();
      gsap.to(elements, {
        duration: 0.5,
        opacity: 1,
        y: 0
      });
    }
  });
} 