(() => {
  'use strict';
  const config = window.PARPAL_GALLERY;
  const root = document.querySelector('.carousel');
  if (!root || !config || !Array.isArray(config.photos) || !config.photos.length) return;
  const stage = document.querySelector('#carousel-stage');
  const controls = document.querySelector('#carousel-controls');
  const dots = document.querySelector('#photo-dots');
  const caption = document.querySelector('#photo-caption');
  const pause = document.querySelector('#photo-pause');
  const status = document.querySelector('#photo-status');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const interval = Number.isFinite(config.intervalMs) ? Math.max(3000, config.intervalMs) : 6000;
  let index = 0;
  let paused = motion.matches;
  let hovering = false;
  let focused = false;
  let timer = null;
  let inView = true;
  let touch = null;
  const slides = [];
  const buttons = [];
  const failed = new Set();
  stage.replaceChildren();
  dots.replaceChildren();

  const available = () => slides.map((_, i) => i).filter(i => !failed.has(i));
  function updateDots() {
    const choices = available();
    const current = choices.indexOf(index);
    const visible = choices.length <= 3 ? choices : [
      choices[(current - 1 + choices.length) % choices.length],
      index,
      choices[(current + 1) % choices.length]
    ];
    buttons.forEach((button, i) => {
      const target = visible[i];
      button.hidden = target === undefined;
      if (target === undefined) return;
      button.dataset.target = String(target);
      button.setAttribute('aria-label', `Mostrar foto ${target + 1} de ${slides.length}`);
      button.setAttribute('aria-current', String(target === index));
    });
    controls.hidden = choices.length < 2;
  }
  function schedule() {
    clearTimeout(timer);
    timer = null;
    if (available().length < 2 || paused || hovering || focused || document.hidden || !inView) return;
    timer = setTimeout(() => move(1), interval);
  }
  function show(next, manual = false) {
    if (failed.has(next) || !slides[next]) return;
    index = next;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === index);
      slide.setAttribute('aria-hidden', String(i !== index));
    });
    updateDots();
    caption.textContent = config.photos[index].caption || '';
    caption.hidden = !caption.textContent;
    // Solo anunciar cambios solicitados por el visitante.
    if (manual) status.textContent = `Foto ${index + 1} de ${slides.length}. ${config.photos[index].alt || ''}`;
    schedule();
  }
  function move(direction, manual = false) {
    const choices = available();
    if (!choices.length) return;
    const current = choices.indexOf(index);
    show(choices[(current + direction + choices.length) % choices.length], manual);
  }
  function updatePause() {
    pause.textContent = paused ? 'Reproducir' : 'Pausar';
    pause.setAttribute('aria-label', paused ? 'Reanudar cambio automático' : 'Pausar cambio automático');
    pause.setAttribute('aria-pressed', String(paused));
    schedule();
  }

  config.photos.forEach((photo, i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'diapositiva');
    slide.setAttribute('aria-label', `${i + 1} de ${config.photos.length}`);
    const img = document.createElement('img');
    img.alt = photo.alt || 'Foto del equipo PARPAL';
    img.decoding = 'async';
    img.fetchPriority = i === 0 ? 'high' : 'low';
    // En escritorio la foto llena el panel; en móvil conserva el ajuste elegido.
    img.style.setProperty('--mobile-fit', photo.fit === 'cover' ? 'cover' : 'contain');
    img.style.objectPosition = photo.position || 'center';
    // El fondo auxiliar se utiliza únicamente en móvil.
    slide.style.backgroundImage = `linear-gradient(#061a4cc7, #061a4cc7), url(${JSON.stringify(photo.src)})`;
    slides.push(slide);
    img.addEventListener('error', () => {
      failed.add(i);
      updateDots();
      if (index === i) {
        const next = available()[0];
        if (next !== undefined) show(next);
        else { caption.textContent = 'No se pudo cargar la foto.'; caption.hidden = false; }
      }
      schedule();
    });
    img.src = photo.src;
    slide.append(img);
    stage.append(slide);
  });

  for (let i = 0; i < Math.min(3, slides.length); i++) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.addEventListener('click', () => show(Number(dot.dataset.target), true));
    buttons.push(dot);
    dots.append(dot);
  }
  pause.addEventListener('click', () => { paused = !paused; updatePause(); });
  root.addEventListener('mouseenter', event => { if (event.sourceCapabilities?.firesTouchEvents) return; hovering = true; schedule(); });
  root.addEventListener('mouseleave', () => { hovering = false; schedule(); });
  root.addEventListener('focusin', () => { focused = true; schedule(); });
  root.addEventListener('focusout', () => { requestAnimationFrame(() => { focused = root.contains(document.activeElement); schedule(); }); });
  root.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1, true);
    }
  });
  stage.addEventListener('touchstart', event => { const point = event.changedTouches[0]; touch = { x: point.clientX, y: point.clientY }; }, { passive: true });
  stage.addEventListener('touchend', event => {
    if (!touch) return;
    const point = event.changedTouches[0];
    const dx = point.clientX - touch.x;
    const dy = point.clientY - touch.y;
    touch = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) move(dx < 0 ? 1 : -1, true);
  }, { passive: true });
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', () => { paused = motion.matches; updatePause(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { inView = entries[0].isIntersecting; schedule(); }).observe(root);
  }
  show(0);
  updatePause();
})();
