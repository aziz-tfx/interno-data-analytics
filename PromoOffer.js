/* ===== Акция «3 курса по цене одного» — промо-карточка =====
   Конфиг и дедлайн — в INTERNO_PROMO (PromoBanner.js, подключается
   первым). После hideAfter карточка не рендерится — без деплоя. */
(function(){
  var P = window.INTERNO_PROMO;
  if (!P || new Date() >= new Date(P.hideAfter)) return;
  var anchor = document.querySelector(P.offerBefore);
  if (!anchor) return;

  var T = {
    ru: { badge: 'Акция', title: 'Купи 1 курс — получи 3',
          gifts: ['Графический дизайн — в подарок', 'Финансы — в подарок'],
          note: 'Акция до 10 августа. Количество мест ограничено.',
          cta: 'Забронировать место' },
    uz: { badge: 'Aksiya', title: '1 ta kurs sotib oling — 3 ta kurs oling',
          gifts: ["Grafik dizayn kursi — sovg'a", "Moliya kursi — sovg'a"],
          note: 'Aksiya 10-avgustgacha. Joylar soni cheklangan.',
          cta: 'Joy band qilish' }
  };
  function lang(){ return document.documentElement.lang === 'uz' ? 'uz' : 'ru'; }

  var style = document.createElement('style');
  style.textContent = [
    '.promo-offer{padding:24px 20px}',
    '.promo-offer__card{position:relative;max-width:760px;margin:0 auto;background:#101012;color:#F2EFE9;border:1px solid rgba(242,239,233,.1);border-radius:28px;padding:40px 36px;overflow:hidden;display:flex;align-items:center;gap:36px}',
    '.promo-offer__fig{flex:none;width:180px}',
    '.promo-offer__img{display:block;width:180px;height:180px;animation:promoFloat 3s ease-in-out infinite alternate}',
    '.promo-offer__fig-shadow{width:120px;height:20px;margin:2px auto 0;border-radius:50%;background:radial-gradient(ellipse at center,#000 0%,transparent 70%);opacity:.25;animation:promoShadow 3s ease-in-out infinite alternate}',
    '@keyframes promoFloat{from{transform:translateY(0)}to{transform:translateY(-12px)}}',
    '@keyframes promoShadow{from{transform:scaleX(1);opacity:.25}to{transform:scaleX(.72);opacity:.15}}',
    '@media(prefers-reduced-motion:reduce){.promo-offer__img,.promo-offer__fig-shadow{animation:none}}',
    '.promo-offer__body{min-width:0}',
    '.promo-offer__card::before{content:"";position:absolute;top:-80px;right:-80px;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(234,81,1,.35),transparent 70%)}',
    '.promo-offer__head{display:flex;align-items:center;gap:12px;margin-bottom:18px}',
    '.promo-offer__badge{display:inline-block;background:#EA5101;color:#F2EFE9;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;border-radius:999px;padding:6px 14px}',
    '.promo-offer__mech{font-weight:700;font-size:13px;color:#8A8A92;font-variant-numeric:tabular-nums}',
    '.promo-offer__title{font-family:' + P.displayFont + ';font-weight:700;font-size:clamp(24px,3.6vw,34px);line-height:1.2;margin:0 0 20px}',
    '.promo-offer__gifts{list-style:none;margin:0 0 18px;padding:0;display:grid;gap:10px}',
    '.promo-offer__gifts li{display:flex;align-items:center;gap:12px;font-size:16px;font-weight:500}',
    '.promo-offer__gifts li::before{content:"✓";flex:none;width:26px;height:26px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;background:rgba(234,81,1,.18);color:#EA5101;font-weight:700;font-size:14px}',
    '.promo-offer__note{color:#8A8A92;font-size:13.5px;margin:0 0 24px}',
    '.promo-offer__cta{display:inline-block;border:0;font-family:inherit;background:#EA5101;color:#F2EFE9;font-weight:700;font-size:16px;border-radius:999px;padding:16px 34px;cursor:pointer;transition:transform .2s,box-shadow .2s}',
    '.promo-offer__cta:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(234,81,1,.35)}',
    '@media(max-width:640px){.promo-offer{padding:16px 12px}.promo-offer__card{padding:28px 22px;border-radius:22px;flex-direction:column;gap:18px;text-align:left}.promo-offer__fig{width:120px;margin:0 auto}.promo-offer__img{width:120px;height:120px}.promo-offer__fig-shadow{width:84px;height:14px}.promo-offer__gifts li{font-size:15px}.promo-offer__cta{display:block;width:100%;text-align:center}}'
  ].join('\n');
  document.head.appendChild(style);

  var el = document.createElement('section');
  el.className = 'promo-offer';
  el.innerHTML =
    '<div class="promo-offer__card">' +
      '<div class="promo-offer__fig" aria-hidden="true">' +
        '<img class="promo-offer__img" src="/promo-gift-3d.png" alt="" width="180" height="180" loading="lazy">' +
        '<div class="promo-offer__fig-shadow"></div>' +
      '</div>' +
      '<div class="promo-offer__body">' +
        '<div class="promo-offer__head">' +
          '<span class="promo-offer__badge"></span>' +
          '<span class="promo-offer__mech">1 → 3</span>' +
        '</div>' +
        '<h2 class="promo-offer__title"></h2>' +
        '<ul class="promo-offer__gifts"><li></li><li></li></ul>' +
        '<p class="promo-offer__note"></p>' +
        '<button type="button" class="promo-offer__cta"></button>' +
      '</div>' +
    '</div>';
  anchor.parentNode.insertBefore(el, anchor);

  function applyTexts(){
    var t = T[lang()];
    el.querySelector('.promo-offer__badge').textContent = t.badge;
    el.querySelector('.promo-offer__title').textContent = t.title;
    el.querySelectorAll('.promo-offer__gifts li').forEach(function(li, i){ li.textContent = t.gifts[i]; });
    el.querySelector('.promo-offer__note').textContent = t.note;
    el.querySelector('.promo-offer__cta').textContent = t.cta;
  }
  applyTexts();
  new MutationObserver(applyTexts)
    .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  el.querySelector('.promo-offer__cta').addEventListener('click', function(){
    var t = document.querySelector(P.target);
    if(t) t.scrollIntoView({ behavior: 'smooth' });
  });

  // Автоотключение, если дедлайн наступил при открытой странице.
  var expireId = setInterval(function(){
    if (new Date() >= new Date(P.hideAfter)){ el.remove(); clearInterval(expireId); }
  }, 60000);
})();
