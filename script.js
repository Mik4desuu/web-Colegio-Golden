/* Interacciones de Colegio Golden: navegación, revelado, carrusel y formulario. */
const header = document.querySelector('.site-header');
const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.nav-menu');

// La intro se superpone mientras carga la página y se retira sola sin bloquearla.
const siteIntro = document.querySelector('.site-intro');
if (siteIntro && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.setTimeout(() => siteIntro.classList.add('is-exiting'), 4150);
  window.setTimeout(() => siteIntro.remove(), 4850);
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
