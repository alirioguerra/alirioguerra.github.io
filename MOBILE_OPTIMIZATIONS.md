# Otimizações para Dispositivos Móveis

## Problema Identificado
O scroll estava muito lento/pesado em celulares devido ao Locomotive Scroll com configurações não otimizadas para dispositivos móveis.

## Soluções Implementadas

### 1. Detecção Inteligente de Dispositivos
- Detecção automática de dispositivos móveis
- Detecção de dispositivos com baixa performance (RAM < 2GB, cores < 2)
- Fallback automático para scroll nativo em dispositivos com baixa performance

### 2. Configurações Otimizadas do Locomotive Scroll
- **Lerp reduzido**: 0.03 (mobile) vs 0.1 (desktop) - scroll mais responsivo
- **Multiplier otimizado**: 0.8 (mobile) vs 0.5 (desktop) - scroll mais suave
- **Touch Multiplier**: 1.5 para melhor resposta ao toque
- **Funcionalidades desabilitadas**: getSpeed, getDirection, scrollFromAnywhere em mobile

### 3. Otimizações CSS
- Aceleração de hardware forçada com `translate3d(0, 0, 0)`
- `will-change` otimizado para transform e opacity
- Transições reduzidas em mobile (0.2s vs 0.3s)
- Hover effects desabilitados em mobile
- `-webkit-overflow-scrolling: touch` para scroll suave nativo

### 4. Otimizações JavaScript
- `requestAnimationFrame` para animações
- Throttle de eventos de resize
- Intersection Observer otimizado
- Lazy loading de imagens
- Eventos touch otimizados com `passive: true`

### 5. Fallback Inteligente
- Scroll nativo para dispositivos com baixa performance
- Intersection Observer para animações em fallback
- Detecção automática de capacidade do dispositivo

## Arquivos Modificados

### JavaScript
- `js/main.js` - Lógica principal otimizada
- `js/performance.js` - Otimizações específicas para mobile
- `js/scroll-config.js` - Configurações do Locomotive Scroll
- `js/mobile-fallback.js` - Fallback para dispositivos com baixa performance

### CSS
- `style.css` - Otimizações CSS para mobile

### Configuração
- `vite.config.js` - Configuração de build otimizada

## Resultados Esperados

1. **Scroll mais responsivo** em dispositivos móveis
2. **Melhor performance** em dispositivos com baixa capacidade
3. **Animações mais suaves** com aceleração de hardware
4. **Fallback automático** para dispositivos que não suportam Locomotive Scroll
5. **Redução de lag** e travamentos durante o scroll

## Como Testar

1. Abra o site em um dispositivo móvel
2. Teste o scroll em diferentes seções
3. Verifique se as animações estão suaves
4. Teste em dispositivos com diferentes capacidades
5. Compare a performance antes e depois das otimizações

## Configurações Personalizáveis

As configurações podem ser ajustadas nos arquivos:
- `js/scroll-config.js` - Configurações do Locomotive Scroll
- `js/performance.js` - Otimizações de performance
- `style.css` - Otimizações CSS para mobile 