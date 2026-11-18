document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.docs-nav a');
  const sections = [...links].map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 120;
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) current = '#' + sec.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === current);
    });
  }, { passive: true });
});
