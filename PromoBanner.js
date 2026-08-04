/* ===== Акция «3 курса по цене одного» — sticky-баннер =====
   Дедлайн акции задаётся ТОЛЬКО здесь: INTERNO_PROMO читают и баннер,
   и карточка PromoOffer.js (подключается после этого файла). После
   hideAfter промо не рендерится вовсе — выключается без деплоя. */
window.INTERNO_PROMO = {
  deadline:  '2026-08-10T23:59:00+05:00', // конец обратного отсчёта (Ташкент)
  hideAfter: '2026-08-11T00:00:00+05:00', // с этого момента промо не рендерится
  nav: '.navbar',       // шапка, которую баннер сдвигает вниз
  target: '#register',  // куда плавно скроллим по клику
  offerBefore: '.countdown-section', // перед каким блоком PromoOffer.js вставит карточку
  displayFont: "'Inter',sans-serif"
};

(function(){
  var P = window.INTERNO_PROMO;
  if (new Date() >= new Date(P.hideAfter)) return;
  var closed = false;
  try { closed = sessionStorage.getItem('interno_promo_closed') === '1'; } catch(_) {}
  if (closed) return;

  var T = {
    ru: { full: '🎁 3 курса по цене одного — до 10 августа | Успей записаться',
          short: '🎁 3 курса по цене одного — до 10 авг',
          units: ['д','ч','м'], close: 'Закрыть' },
    uz: { full: '🎁 1 ta kurs narxiga — 3 ta kurs | 10-avgustgacha',
          short: '🎁 1 ta kurs narxiga — 3 ta kurs',
          units: ['k','s','d'], close: 'Yopish' }
  };
  function lang(){ return document.documentElement.lang === 'uz' ? 'uz' : 'ru'; }

  var style = document.createElement('style');
  style.textContent = [
    '.promo-banner{position:sticky;top:0;z-index:1500;background:#EA5101;color:#F2EFE9}',
    '.promo-banner__inner{position:relative;max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:center;gap:14px;padding:9px 48px;white-space:nowrap;overflow:hidden;cursor:pointer}',
    '.promo-banner__text{font-weight:600;font-size:14px;overflow:hidden;text-overflow:ellipsis}',
    '.promo-banner__text--short{display:none}',
    '.promo-banner__timer{display:inline-flex;align-items:baseline;gap:3px;flex:none;font-weight:700;font-size:13px;font-variant-numeric:tabular-nums;background:rgba(16,16,18,.28);border-radius:999px;padding:3px 11px}',
    '.promo-banner__timer i{font-style:normal;font-weight:500;font-size:11px;opacity:.8}',
    '.promo-banner__close{position:absolute;right:8px;top:50%;transform:translateY(-50%);width:32px;height:32px;padding:0;background:none;border:0;cursor:pointer;font-family:inherit;font-size:20px;line-height:1;color:#F2EFE9;opacity:.85;border-radius:50%}',
    '.promo-banner__close:hover{opacity:1;background:rgba(16,16,18,.28)}',
    '@media(max-width:640px){',
    ' .promo-banner__text--full{display:none}',
    ' .promo-banner__text--short{display:block;font-size:12.5px}',
    ' .promo-banner__inner{gap:8px;padding:8px 40px 8px 10px}',
    ' .promo-banner__timer{font-size:12px;padding:2px 8px}',
    '}'
  ].join('\n');
  document.head.appendChild(style);

  var el = document.createElement('div');
  el.className = 'promo-banner';
  el.innerHTML =
    '<div class="promo-banner__inner">' +
      '<span class="promo-banner__text promo-banner__text--full"></span>' +
      '<span class="promo-banner__text promo-banner__text--short"></span>' +
      '<span class="promo-banner__timer">' +
        '<b data-pb="d">00</b><i data-pbu="0"></i>&nbsp;: ' +
        '<b data-pb="h">00</b><i data-pbu="1"></i>&nbsp;: ' +
        '<b data-pb="m">00</b><i data-pbu="2"></i>' +
      '</span>' +
    '</div>' +
    '<button type="button" class="promo-banner__close">&times;</button>';
  document.body.insertBefore(el, document.body.firstChild);

  var nav = document.querySelector(P.nav);
  function syncNav(){
    if(!nav) return;
    var pos = getComputedStyle(nav).position;
    if(pos === 'sticky' || pos === 'fixed') nav.style.top = el.offsetHeight + 'px';
  }
  syncNav();
  window.addEventListener('resize', syncNav);

  function applyTexts(){
    var t = T[lang()];
    el.querySelector('.promo-banner__text--full').textContent = t.full;
    el.querySelector('.promo-banner__text--short').textContent = t.short;
    el.querySelectorAll('[data-pbu]').forEach(function(u){ u.textContent = t.units[+u.getAttribute('data-pbu')]; });
    el.querySelector('.promo-banner__close').setAttribute('aria-label', t.close);
    syncNav();
  }
  applyTexts();
  // Тексты следуют за переключением языка страницы (lang на <html>),
  // сама логика применения lang/city не затрагивается.
  new MutationObserver(applyTexts)
    .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  function teardown(){
    el.remove();
    if(nav) nav.style.top = '';
    clearInterval(timerId);
  }

  var deadline = new Date(P.deadline);
  function tickTimer(){
    var diff = deadline - new Date();
    if(diff <= 0){ teardown(); return; }
    var d = Math.floor(diff/86400000),
        h = Math.floor(diff%86400000/3600000),
        m = Math.floor(diff%3600000/60000);
    el.querySelector('[data-pb="d"]').textContent = String(d).padStart(2,'0');
    el.querySelector('[data-pb="h"]').textContent = String(h).padStart(2,'0');
    el.querySelector('[data-pb="m"]').textContent = String(m).padStart(2,'0');
  }
  tickTimer();
  var timerId = setInterval(tickTimer, 15000);

  el.querySelector('.promo-banner__inner').addEventListener('click', function(){
    var t = document.querySelector(P.target);
    if(t) t.scrollIntoView({ behavior: 'smooth' });
  });
  el.querySelector('.promo-banner__close').addEventListener('click', function(e){
    e.stopPropagation();
    try { sessionStorage.setItem('interno_promo_closed', '1'); } catch(_) {}
    teardown();
  });
})();
