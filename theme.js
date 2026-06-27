const THEME_KEY = 'gReads-theme';

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark-theme', isDark);
  document.documentElement.classList.toggle('dark-theme', isDark);
}

function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

function initTheme() {
  applyTheme(getStoredTheme());
}

function bindThemeToggle(toggleId) {
  const toggle = typeof toggleId === 'string' ? document.getElementById(toggleId) : toggleId;
  if (!toggle) return;

  const currentTheme = getStoredTheme();
  toggle.checked = currentTheme === 'dark';

  if (toggle._themeHandler) {
    toggle.removeEventListener('change', toggle._themeHandler);
  }

  toggle._themeHandler = () => {
    const theme = toggle.checked ? 'dark' : 'light';
    saveTheme(theme);
    applyTheme(theme);
  };

  toggle.addEventListener('change', toggle._themeHandler);
}

initTheme();
bindThemeToggle('themeToggle');
