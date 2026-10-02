document.querySelectorAll('.portfolio-reader').forEach(reader => {
 const allPages = Array.from(reader.querySelectorAll('.portfolio-pages > figure'));
 if (allPages.length < 2) return;
 allPages[0].remove();
 const pages = allPages.slice(1);
 const prev = reader.querySelector('.portfolio-prev');
 const next = reader.querySelector('.portfolio-next');
 const counter = reader.querySelector('.portfolio-counter');
 const region = reader.querySelector('.portfolio-pages');
 const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
 let index = 0, busy = false;
 function update() {
  pages.forEach((page, i) => { page.hidden = i !== index; });
  counter.textContent = `${String(index + 1).padStart(2, '0')} / ${pages.length}`;
  prev.disabled = index === 0;
  next.disabled = index === pages.length - 1;
  [index - 1, index + 1].forEach(i => { if (pages[i]) pages[i].querySelector('img').loading = 'eager'; });
 }
 function half(className, image) {
  const element = document.createElement('div');
  element.className = className;
  element.style.backgroundImage = `url("${image.currentSrc || image.src}")`;
  return element;
 }
 async function turn(direction) {
  const target = index + direction;
  if (busy || target < 0 || target >= pages.length) return;
  busy = true;
  let leaf, stationary;
  try {
   const oldImage = pages[index].querySelector('img');
   const newImage = pages[target].querySelector('img');
   newImage.loading = 'eager';
   try { await newImage.decode(); } catch (_) {}
   const canAnimate = !reduced.matches && oldImage.naturalWidth >= oldImage.naturalHeight && newImage.naturalWidth >= newImage.naturalHeight;
   if (canAnimate) {
    stationary = half('book-turn-half book-turn-left', oldImage);
    stationary.style.left = direction > 0 ? '0' : '50%';
    stationary.style.backgroundPosition = direction > 0 ? 'left center' : 'right center';
    leaf = document.createElement('div');
    leaf.className = `book-leaf book-leaf-${direction > 0 ? 'forward' : 'backward'}`;
    leaf.append(half('book-leaf-face book-leaf-front', oldImage), half('book-leaf-face book-leaf-back', newImage));
    region.append(stationary, leaf);
   }
   index = target;
   update();
   if (leaf) {
    await leaf.animate([{transform:'rotateY(0deg)'},{transform:`rotateY(${direction > 0 ? -180 : 180}deg)`}],{duration:800,easing:'cubic-bezier(.35,.05,.25,1)',fill:'forwards'}).finished;
   }
  } finally {
   leaf?.remove(); stationary?.remove(); busy = false;
  }
 }
 reader.querySelectorAll('[data-portfolio-page]').forEach(button => {
  button.addEventListener('click', () => {
   if (busy) return;
   const sourcePage = Number(button.dataset.portfolioPage);
   if (!Number.isInteger(sourcePage) || sourcePage < 2 || sourcePage > allPages.length) return;
   index = sourcePage - 2;
   update();
   region.focus({preventScroll:true});
  });
 });
 prev.addEventListener('click', () => turn(-1));
 next.addEventListener('click', () => turn(1));
 reader.addEventListener('keydown', event => {
  if (!reader.open || event.target.closest('summary')) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
   event.preventDefault(); turn(event.key === 'ArrowRight' ? 1 : -1);
  }
 });
 reader.querySelector('.reader-close').addEventListener('click', () => { reader.open = false; reader.querySelector('summary').focus(); });
 reader.addEventListener('toggle', () => { if (reader.open) region.focus({preventScroll:true}); });
 update();
});
