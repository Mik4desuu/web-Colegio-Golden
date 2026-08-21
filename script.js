/* Interacciones de Colegio Golden: navegación, revelado, carrusel y formulario. */
const header = document.querySelector('.site-header');
const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.nav-menu');

const heroEnroll = document.querySelector('.hero-enroll');
heroEnroll?.addEventListener('click', event => {
  event.preventDefault();
  document.querySelector('#contacto')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// En pantallas táctiles, las Flip Cards alternan de cara con cada toque.
const isTouchPrimary = () => window.matchMedia('(hover: none), (pointer: coarse)').matches;
document.querySelectorAll('.flip-card').forEach(card => {
  const inner = card.querySelector('.flip-card__inner');
  const toggleCard = () => {
    card.classList.toggle('is-flipped');
    inner.setAttribute('aria-pressed', card.classList.contains('is-flipped'));
  };
  inner.addEventListener('click', () => { if (isTouchPrimary()) toggleCard(); });
  inner.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleCard(); }
  });
});

// Cada novedad se abre y cierra dentro de su propia tarjeta.
document.querySelectorAll('.news-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const card = toggle.closest('.news-card');
    const extra = card.querySelector('.news-extra');
    const isOpen = card.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen);
    toggle.innerHTML = isOpen ? 'Cerrar <span>→</span>' : 'Conocer la experiencia <span>→</span>';
    extra.setAttribute('aria-hidden', !isOpen);
  });
});

// La intro se desvanece después de completar la entrada del logo y el trazo circular.
const siteIntro = document.querySelector('.site-intro');
if (siteIntro) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const introExitDelay = reducedMotion ? 700 : 2650;
  const introRemoveDelay = reducedMotion ? 1250 : 3200;
  window.setTimeout(() => siteIntro.classList.add('is-exiting'), introExitDelay);
  window.setTimeout(() => siteIntro.remove(), introRemoveDelay);
}

window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 30), { passive: true });
toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
});
document.querySelectorAll('.nav-menu a').forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false');
}));

const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
}), { threshold: 0.13 });
document.querySelectorAll('.reveal').forEach(item => revealObserver.observe(item));

const track = document.querySelector('.testimonial-track');
const dots = [...document.querySelectorAll('.carousel-dots button')]; let current = 0; let timer;
function showSlide(index) { current = (index + dots.length) % dots.length; track.style.transform = `translateX(-${current * 100}%)`; dots.forEach((dot, i) => dot.classList.toggle('active', i === current)); }
function resetTimer() { clearInterval(timer); timer = setInterval(() => showSlide(current + 1), 5500); }
document.querySelector('.next').addEventListener('click', () => { showSlide(current + 1); resetTimer(); });
document.querySelector('.prev').addEventListener('click', () => { showSlide(current - 1); resetTimer(); });
dots.forEach((dot, i) => dot.addEventListener('click', () => { showSlide(i); resetTimer(); })); resetTimer();

// Deslizamiento táctil para recorrer las voces sin interferir con el scroll vertical.
let touchStartX = 0;
track.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
track.addEventListener('touchend', event => {
  const distance = event.changedTouches[0].screenX - touchStartX;
  if (Math.abs(distance) > 40) { showSlide(current + (distance < 0 ? 1 : -1)); resetTimer(); }
}, { passive: true });

document.querySelector('#info-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = new FormData(event.target);
  const message = [
    'Hola, quisiera consultar por Colegio Golden.',
    '',
    `Nombre de la familia: ${form.get('familia')}`,
    `Nombre del niño/a: ${form.get('nino')}`,
    `Nivel de interés: ${form.get('nivel')}`,
    `Consulta: ${form.get('consulta')}`
  ].join('\n');
  window.open(`https://wa.me/59894167320?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});
