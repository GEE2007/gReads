(function () {
  const setActiveNavLink = () => {
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
  };

  const closeProfileMenu = () => {
    const profileMenu = document.querySelector('.profile-menu');
    const profileToggle = document.getElementById('profileToggle');
    if (!profileMenu || !profileToggle) return;

    profileMenu.classList.remove('open');
    profileToggle.setAttribute('aria-expanded', 'false');
  };

  const toggleProfileMenu = () => {
    const profileMenu = document.querySelector('.profile-menu');
    const profileToggle = document.getElementById('profileToggle');
    if (!profileMenu || !profileToggle) return;

    const isOpen = profileMenu.classList.toggle('open');
    profileToggle.setAttribute('aria-expanded', String(isOpen));
  };

  document.addEventListener('DOMContentLoaded', () => {
    setActiveNavLink();

    document.addEventListener('click', (event) => {
      if (event.target.closest('#profileToggle')) {
        toggleProfileMenu();
        return;
      }

      if (!event.target.closest('.profile-menu')) {
        closeProfileMenu();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeProfileMenu();
      }
    });
  });
})();
