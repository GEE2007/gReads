(function () {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const normalizedCurrentPath = currentPath === '' ? 'index.html' : currentPath;

  document.querySelectorAll('.navlinks a').forEach((link) => {
    const href = link.getAttribute('href') || '';
    const linkPath = href.split('/').pop() || 'index.html';
    const isHome = normalizedCurrentPath === 'index.html' || normalizedCurrentPath === '/';
    const isActive = (linkPath === 'index.html' && isHome) || normalizedCurrentPath === linkPath;

    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
})();
