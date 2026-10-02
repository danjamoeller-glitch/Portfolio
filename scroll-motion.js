
(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window)) return;
  const root = document.documentElement;
  const reveal = [...document.querySelectorAll('.work-card, .category-intro, .project-heading, .creative-gallery figure, .book-mockup, .newsletter-pair figure, .deputy-layout, .project-media, .project-section-heading, .mobile-showcase, .portfolio-book-scene')];
  reveal.forEach((item, index) => {
    item.classList.add('scroll-reveal');
    item.style.setProperty('--reveal-delay', (index % 3) * 65 + 'ms');
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    });
  }, {threshold: 0, rootMargin: '0px 0px -35px 0px'});
  reveal.forEach(item => observer.observe(item));
  const photos = [...document.querySelectorAll('.hero-image img, .concept-image img')];
  const visiblePhotos = new Set();
  const imageObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting ? visiblePhotos.add(entry.target) : visiblePhotos.delete(entry.target));
  });
  photos.forEach(photo => imageObserver.observe(photo));
  let pending = false;
  function update() {
    pending = false;
    if (preference.matches) return;
    visiblePhotos.forEach(photo => {
      const box = photo.parentElement.getBoundingClientRect();
      const position = Math.max(-1, Math.min(1, (box.top + box.height / 2 - window.innerHeight / 2) / window.innerHeight));
      photo.style.setProperty('--photo-shift', position * -18 + 'px');
    });
  }
  function schedule() { if (!pending) {pending = true; requestAnimationFrame(update);} }
  function disable() {
    if (!preference.matches) return;
    root.classList.remove('has-scroll-motion');
    observer.disconnect(); imageObserver.disconnect();
    photos.forEach(photo => photo.style.removeProperty('--photo-shift'));
    window.removeEventListener('scroll',schedule);
    window.removeEventListener('resize',schedule);
  }
  window.addEventListener('scroll', schedule, {passive:true});
  window.addEventListener('resize', schedule, {passive:true});
  preference.addEventListener('change',disable);
  root.classList.add('has-scroll-motion');
  schedule();
})();
