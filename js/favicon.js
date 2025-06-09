const FAVICONS = {
  default: '🚀',
  hover: '👀'
};

/**
 * Update the favicon with the specified emoji
 * @param {string} emoji - The emoji to use as favicon
 */
function updateFavicon(emoji) {
  const favicon = document.querySelector('link[rel="icon"]');
  if (favicon) {
    favicon.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${emoji}</text></svg>`;
  }
}

/**
 * Initialize favicon change handlers
 */
export function initializeFavicon() {
  document.addEventListener('mouseleave', () => {
    updateFavicon(FAVICONS.hover);
  });

  document.addEventListener('mouseenter', () => {
    updateFavicon(FAVICONS.default);
  });
} 