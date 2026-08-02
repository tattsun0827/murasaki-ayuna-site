(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-list');

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const closeMenu = () => {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'メニューを開く');
    menu.classList.remove('open');
    document.body.classList.remove('menu-open');
  };

  toggle?.addEventListener('click', () => {
    const opening = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(opening));
    toggle.setAttribute('aria-label', opening ? 'メニューを閉じる' : 'メニューを開く');
    menu?.classList.toggle('open', opening);
    document.body.classList.toggle('menu-open', opening);
  });

  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 860) closeMenu(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
  } else {
    document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
  }
})();
