(() => {
  const root = document.documentElement;
  const systemTheme = matchMedia('(prefers-color-scheme: dark)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let transition;
  const storageKey = 'saefken-lab-theme';
  let preference;

  try {
    const stored = localStorage.getItem(storageKey);
    if (stored === 'light' || stored === 'dark') preference = stored;
  } catch {
    // The theme still works for the current page if storage is unavailable.
  }

  function applyTheme() {
    const theme = preference ?? (systemTheme.matches ? 'dark' : 'light');
    root.dataset.theme = theme;
    const toggle = document.querySelector('#site-theme');
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(theme === 'dark'));
      toggle.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    }
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = theme === 'dark' ? '#041416' : '#f7fafb';
    const icon = document.querySelector('link[rel="icon"]');
    if (icon) icon.href = icon.href.replace(/favicon(?:-dark)?\.svg$/, theme === 'dark' ? 'favicon-dark.svg' : 'favicon.svg');
  }

  applyTheme();
  systemTheme.addEventListener('change', applyTheme);
  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('#site-theme');
    applyTheme();
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      preference = (preference ?? root.dataset.theme) === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(storageKey, preference);
      } catch {
        // Keep the choice in memory for the current page.
      }
      if (reducedMotion.matches) {
        transition?.skipTransition();
        applyTheme();
      } else if (document.startViewTransition) {
        transition = document.startViewTransition(applyTheme);
      } else {
        root.classList.add('theme-color-transition');
        applyTheme();
      }
    });
  });
})();
