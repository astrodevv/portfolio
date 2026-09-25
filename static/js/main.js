

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initLiquidNav();
  initDecryptText();
  initRoleRotator();
  initBackToTop();
  initScrollReveal();
});

function initLiquidNav(){
  const nav = document.getElementById('site-nav');
  const wrap = nav ? nav.querySelector('.nav-liquid-wrap') : null;
  const indicator = document.getElementById('nav-indicator');
  if(!nav || !wrap || !indicator) return;

  const links = Array.from(nav.querySelectorAll('.nav-link'));

  function setActiveByPath(){
    const current = window.location.pathname;
    links.forEach(link => {
      const linkPath = new URL(link.getAttribute('href'), window.location.href).pathname;
      const isActive = linkPath === current || (linkPath !== '/' && current.startsWith(linkPath));
      link.classList.toggle('active', isActive);
    });
  }

  function moveIndicatorTo(link){
    if(!link) return;
    const wrapRect = wrap.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const x = linkRect.left - wrapRect.left;
    indicator.style.width = linkRect.width + 'px';
    indicator.style.transform = `translateX(${x}px)`;
  }

  setActiveByPath();
  const activeLink = links.find(l => l.classList.contains('active')) || links[0];

  requestAnimationFrame(() => moveIndicatorTo(activeLink));

  links.forEach(link => {
    link.addEventListener('mouseenter', () => moveIndicatorTo(link));
    link.addEventListener('mouseleave', () => moveIndicatorTo(activeLink));
  });

  window.addEventListener('resize', () => moveIndicatorTo(activeLink));
}
function initDecryptText(){
  const targets = document.querySelectorAll('[data-decrypt]');
  if(!targets.length) return;

  const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*<>/\\{}[]01';

  targets.forEach((el, index) => {
    const finalText = el.textContent.trim();
    el.setAttribute('aria-label', finalText); // screen reader uchun asl matn darrov beriladi

    if(prefersReducedMotion){
      el.textContent = finalText;
      return;
    }

    el.textContent = '';
    const delay = Number(el.dataset.decryptDelay) || index * 300;
    setTimeout(() => runDecrypt(el, finalText, CHARSET), delay);
  });
}

function runDecrypt(el, finalText, charset, onComplete){
  const TOTAL_FRAMES = 28;
  let frame = 0;

  function render(){
    const revealCount = Math.floor((frame / TOTAL_FRAMES) * finalText.length);
    let output = '';

    for(let i = 0; i < finalText.length; i++){
      if(finalText[i] === ' '){
        output += ' ';
      } else if(i < revealCount){
        output += finalText[i];
      } else {
        output += charset[Math.floor(Math.random() * charset.length)];
      }
    }

    el.textContent = output;
    frame++;

    if(frame <= TOTAL_FRAMES){
      requestAnimationFrame(render);
    } else {
      el.textContent = finalText;
      if(onComplete) onComplete();
    }
  }

  render();
}

function initRoleRotator(){
  const el = document.querySelector('[data-decrypt-cycle]');
  if(!el) return;

  const roles = (el.dataset.roles || '').split('|').map(s => s.trim()).filter(Boolean);
  if(!roles.length) return;

  const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*<>/\\{}[]01';
  const HOLD_MS = 2200; // har bir rolni necha vaqt ko'rsatib turish
  const initialDelay = Number(el.dataset.decryptDelay) || 0;

  el.setAttribute('aria-live', 'polite');
  let index = 0;

  function showRole(text, callback){
    if(prefersReducedMotion){
      el.textContent = text;
      if(callback) setTimeout(callback, HOLD_MS);
      return;
    }
    runDecrypt(el, text, CHARSET, () => {
      if(callback) setTimeout(callback, HOLD_MS);
    });
  }

  function next(){
    index = (index + 1) % roles.length;
    showRole(roles[index], next);
  }

  setTimeout(() => showRole(roles[0], next), initialDelay);
}

function initBackToTop(){
  const btn = document.getElementById('back-to-top');
  if(!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}

function initScrollReveal(){
  const items = document.querySelectorAll('[data-reveal]');
  if(!items.length) return;

  if(prefersReducedMotion){
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach(el => observer.observe(el));
}