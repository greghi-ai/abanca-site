/* A Banca Store — home
 * Scroll story: vault password (1425) → door opens → 3D shirt emerges,
 * turns to the side (print swaps) and ends showing the back print.
 */
(function () {
  'use strict';

  // ---------- settings ----------
  // Shirt colour: 'preto' | 'offwhite' | 'marrom'
  var SHIRT = 'preto';
  var CODE = ['1', '4', '2', '5']; // loja 1425 no Maxi Shopping

  var PALETTES = {
    preto:    { fab: '#191613', hi: '#3A342E', edge: ['#0E0C0A', '#141210'], seam: '#4A433C', ink: '#EDE6DA' },
    offwhite: { fab: '#D9D1C3', hi: '#F4EFE6', edge: ['#B3AA9B', '#C2B9AA'], seam: '#BDB3A3', ink: '#2B2520' },
    marrom:   { fab: '#4E3A2B', hi: '#76594A', edge: ['#33251B', '#3E2E22'], seam: '#6A5242', ink: '#EDE6DA' }
  };

  // ---------- products ----------
  var C = {
    W: ['Branco', '#F4F1EA'], B: ['Preto', '#1E1B18'], O: ['Off white', '#E7DFCF'], Be: ['Bege', '#C9B79C'],
    M: ['Marrom', '#6B4E3A'], N: ['Azul marinho', '#1F2A44'], V: ['Vinho', '#5A1F2B'], J: ['Jeans', '#4B6584'],
    Ci: ['Cinza', '#8A8782'], G: ['Grafite', '#3E3F42'], R: ['Vermelho', '#8E2424']
  };
  // [linha, nome, tipo, cores, preço, preço antigo, desconto, cor de fundo, foto (opcional)]
  var PRODUCTS = {
    basics: [
      ['CULTURE BASIC', 'Camiseta Azul Marinho', 'tee', 'N W O Be B', 'R$129,99', 'R$189,99', '−32%', '#9FA3AE'],
      ['BASIC PREMIUM', 'Camiseta Vinho', 'tee', 'V M Be O B', 'R$159,99', 'R$209,99', '−24%', '#A88E8E']
    ],
    basics2: [
      ['BASIC PREMIUM', 'Camiseta Marrom', 'tee', 'M V Be O B', 'R$159,99', 'R$209,99', '−24%', '#A89382'],
      ['CULTURE BASIC', 'Camiseta Off White', 'tee', 'O W Be N B', 'R$129,99', 'R$189,99', '−32%', '#C8BFB1'],
      ['COMPRESSÃO', 'Camiseta Preta', 'tee', 'B W', 'R$119,99', 'R$179,99', '−33%', '#8C857C'],
      ['REGATA CANELADA', 'Regata Branca', 'tank', 'W B', 'R$109,99', 'R$169,99', '−35%', '#C3BAAD'],
      ['KIT 2 BÁSICAS', 'Escolha 2 cores', 'tee', 'B Be O M N', 'R$189,90', 'R$299,99', '−37%', '#A49A8C']
    ],
    pants: [
      ['BAGGY BORDADO', 'Calça Aranha', 'pants', 'J', 'R$299,99', 'R$349,99', '−14%', '#8E9AA8'],
      ['BAGGY SILK', 'Calça Anjo', 'pants', 'J', 'R$279,99', 'R$289,99', '−3%', '#96A1AC'],
      ['BAGGY CARGO FOUR', 'Calça Estonada', 'pants', 'Ci', 'R$259,99', 'R$289,99', '−10%', '#A29D96'],
      ['BAGGY DESTROYED', 'Calça Jeans', 'pants', 'J', 'R$259,99', 'R$289,99', '−10%', '#8F9BA6'],
      ['BAGGY BASIC', 'Calça Grafite', 'pants', 'G', 'R$229,99', 'R$269,99', '−15%', '#8B8784']
    ],
    prints: [
      ['ESPORTES', 'Jordan Airness', 'tee', 'B O', 'R$189,99', 'R$219,99', '−14%', '#948B80'],
      ['ESPORTES', 'Rodman Bulls', 'tee', 'B O', 'R$185,99', 'R$229,99', '−19%', '#9A8F83'],
      ['CRISTÃS', 'Jesus Is Coming', 'tee', 'B O', 'R$179,99', 'R$219,99', '−18%', '#B3A897'],
      ['CRISTÃS', 'We Need Jesus', 'tee', 'B O', 'R$169,99', 'R$219,99', '−23%', '#A39886'],
      ['ARTISTAS', 'Angel’s Dual', 'tee', 'B O R', 'R$169,99', 'R$219,99', '−23%', '#9D8E86']
    ]
  };

  var ICONS = {
    tee: '<svg aria-hidden="true" width="62%" viewBox="0 0 200 200" fill="none" stroke="rgba(43,37,32,0.55)" stroke-width="2"><path d="M72 30 L36 44 L14 88 L40 98 L52 78 L52 178 L148 178 L148 78 L160 98 L186 88 L164 44 L128 30 Q100 52 72 30 Z"/></svg>',
    tank: '<svg aria-hidden="true" width="50%" viewBox="0 0 200 200" fill="none" stroke="rgba(43,37,32,0.55)" stroke-width="2"><path d="M70 22 L70 50 Q60 80 54 96 L54 182 L146 182 L146 96 Q140 80 130 50 L130 22 Q100 66 70 22 Z"/></svg>',
    pants: '<svg aria-hidden="true" width="52%" viewBox="0 0 200 220" fill="none" stroke="rgba(43,37,32,0.55)" stroke-width="2"><path d="M56 14 L144 14 L160 206 L114 206 L100 80 L86 206 L40 206 Z"/><path d="M56 34 L144 34"/></svg>'
  };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function card(p) {
    var dots = p[3].split(' ').map(function (k) { return '<span title="' + esc(C[k][0]) + '" style="background:' + C[k][1] + '"></span>'; }).join('');
    var media = p[8] ? '<img src="' + esc(p[8]) + '" alt="' + esc(p[1]) + '" loading="lazy">' : ICONS[p[2]] + '<span class="card-photo">[ FOTO ]</span>';
    return '<a href="#" class="card">' +
      '<div class="card-img" style="background:' + p[7] + '">' + media + '<span class="card-off">' + esc(p[6]) + '</span></div>' +
      '<div class="card-info"><span class="card-line">' + esc(p[0]) + '</span><span class="card-name">' + esc(p[1]) + '</span>' +
      '<div class="card-dots">' + dots + '</div>' +
      '<span class="card-price">' + esc(p[4]) + ' <s>' + esc(p[5]) + '</s></span></div></a>';
  }

  document.querySelectorAll('[data-products]').forEach(function (el) {
    el.innerHTML = (PRODUCTS[el.dataset.products] || []).map(card).join('');
  });

  // ---------- size / colour pickers ----------
  function chips(id, values, initial) {
    var box = document.getElementById(id);
    values.forEach(function (v) {
      var b = document.createElement('button');
      b.className = 'chip';
      b.textContent = v;
      b.setAttribute('aria-pressed', v === initial ? 'true' : 'false');
      b.addEventListener('click', function () {
        box.querySelectorAll('.chip').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
      });
      box.appendChild(b);
    });
  }
  chips('sizes', ['P', 'M', 'G', 'GG'], 'M');
  chips('colors', ['PRETO', 'OFF WHITE', 'BEGE'], 'PRETO');

  // ---------- build vault + shirt ----------
  var $ = function (id) { return document.getElementById(id); };
  var story = $('story'), stage = story.querySelector('.stage');
  var shirt = $('shirt'), wrap = $('shirtWrap'), shadow = $('shadow');
  var vault = $('vault'), door = $('door'), wheel = $('wheel'), glow = $('glow'), rays = $('rays'), flashEl = $('flash');
  var backdrop = $('backdrop'), intro = $('intro'), cap1 = $('cap1'), cap2 = $('cap2');
  var print1 = $('print1'), print2 = $('print2'), frontShade = $('frontShade'), backShade = $('backShade');
  var digitsBox = $('digits'), lock = $('lock');

  var pal = PALETTES[SHIRT] || PALETTES.preto;
  shirt.style.setProperty('--fab', pal.fab);
  shirt.style.setProperty('--fab-hi', pal.hi);
  shirt.style.setProperty('--seam', pal.seam);
  shirt.style.setProperty('--shirt-ink', pal.ink);

  var BODY = 'M70 14 L34 28 L6 82 L36 96 L50 72 L50 202 L150 202 L150 72 L164 96 L194 82 L166 28 L130 14 Q100 40 70 14 Z';
  var slicesHtml = '';
  for (var i = 0; i < 11; i++) {
    slicesHtml += '<svg class="slice" viewBox="0 0 200 210" style="transform:translateZ(' + (-20 + i * 4) + 'px)"><path d="' + BODY + '" fill="' + pal.edge[i % 2] + '"/></svg>';
  }
  $('slices').innerHTML = slicesHtml;

  var bolts = [];
  for (var a = 0; a < 360; a += 45) {
    var b = document.createElement('div');
    b.className = 'bolt';
    b.dataset.angle = a;
    $('bolts').appendChild(b);
    bolts.push(b);
  }

  var digits = CODE.map(function () {
    var d = document.createElement('span');
    d.className = 'digit';
    d.textContent = '_';
    digitsBox.appendChild(d);
    return d;
  });

  // ---------- math ----------
  function clamp(x) { return Math.min(1, Math.max(0, x)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smooth(a, b, x) { var t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function render(p) {
    var narrow = window.innerWidth < 760;
    // vault: password → unlock → open
    // timeline: 0–0.25 vault (room section), 0.5 step 1, 0.75 step 2, 1 step 3
    var typed = [0.02, 0.04, 0.06, 0.08].filter(function (t) { return p >= t; }).length;
    var accepted = p >= 0.09;
    digits.forEach(function (d, i) {
      d.textContent = i < typed ? CODE[i] : '_';
      d.classList.toggle('on', i < typed);
    });
    digitsBox.classList.toggle('ok', accepted);
    lock.textContent = accepted ? 'LIBERADO' : (typed ? 'DIGITANDO' : 'TRAVADO');
    lock.classList.toggle('ok', accepted);

    var vaultOut = smooth(0.2, 0.26, p);
    var unlock = smooth(0.1, 0.14, p);
    var open = smooth(0.12, 0.18, p);
    var emerge = ease(smooth(0.14, 0.24, p));
    var flash = Math.max(0, 1 - Math.abs(p - 0.165) / 0.03);

    wheel.style.transform = 'rotate(' + (smooth(0.09, 0.14, p) * 540).toFixed(1) + 'deg)';
    var boltX = lerp(560, 420, unlock).toFixed(1);
    bolts.forEach(function (b) {
      b.style.transform = 'translate(-50%,-50%) rotate(' + b.dataset.angle + 'deg) translateX(' + boltX + '%)';
    });
    door.style.transform = 'rotateY(' + (-112 * open).toFixed(2) + 'deg)';
    door.style.boxShadow = (24 * open).toFixed(0) + 'px 0 50px rgba(0,0,0,' + (0.6 * open).toFixed(2) + ')';
    glow.style.opacity = open.toFixed(3);
    rays.style.opacity = (open * (1 - vaultOut)).toFixed(3);
    rays.style.transform = 'rotate(' + (p * 160).toFixed(1) + 'deg)';
    vault.style.transform = 'translate(-50%,-50%) scale(' + (1 + 1.2 * vaultOut).toFixed(3) + ')';
    vault.style.opacity = (1 - vaultOut).toFixed(3);
    flashEl.style.opacity = (flash * 0.9).toFixed(3);
    backdrop.style.opacity = (1 - smooth(0.24, 0.32, p)).toFixed(3);
    var introOut = smooth(0.07, 0.12, p);
    intro.style.opacity = (1 - introOut).toFixed(3);
    intro.style.transform = 'translateY(' + (-30 * introOut).toFixed(1) + 'px)';
    cap1.style.opacity = (smooth(0.085, 0.1, p) * (1 - smooth(0.13, 0.145, p))).toFixed(3);
    cap2.style.opacity = (smooth(0.16, 0.18, p) * (1 - smooth(0.22, 0.24, p))).toFixed(3);

    // shirt path
    var L = narrow ? { c: 50, s1: 50, a: 50, b: 50 } : { c: 50, s1: 64, a: 28, b: 70 };
    var restTop = narrow ? 34 : 52, vTop = narrow ? 45 : 50;
    var left, top = restTop, ry, tilt;
    if (p < 0.24) { left = L.c; top = vTop; ry = lerp(-540, 0, emerge); tilt = 0; }
    else if (p < 0.42) { var t1 = ease((p - 0.24) / 0.18); left = lerp(L.c, L.s1, t1); top = lerp(vTop, restTop, t1); ry = 0; tilt = 0; }
    else if (p < 0.52) { left = L.s1; ry = 0; tilt = 0; }
    else if (p < 0.68) { var t2 = ease((p - 0.52) / 0.16); left = lerp(L.s1, L.a, t2); ry = lerp(0, -58, t2); tilt = lerp(0, -4, t2); }
    else if (p < 0.76) { left = L.a; ry = -58; tilt = -4; }
    else if (p < 0.96) { var t3 = ease((p - 0.76) / 0.2); left = lerp(L.a, L.b, t3); ry = lerp(-58, -180, t3); tilt = lerp(-4, 3, t3); }
    else { left = L.b; ry = -180; tilt = 3; }
    var z = lerp(-1300, 0, emerge);
    var rad = ry * Math.PI / 180;

    wrap.style.opacity = smooth(0.13, 0.16, p).toFixed(3);
    shirt.style.left = left.toFixed(2) + '%';
    shirt.style.top = top.toFixed(2) + '%';
    shirt.style.transform = 'translate(-50%,-50%) translateZ(' + z.toFixed(1) + 'px) rotateX(6deg) rotateY(' + ry.toFixed(2) + 'deg) rotateZ(' + tilt.toFixed(2) + 'deg)';
    shadow.style.left = left.toFixed(2) + '%';
    shadow.style.top = 'calc(' + top.toFixed(2) + '% + clamp(130px, 15vw, 215px))';
    shadow.style.opacity = smooth(0.3, 0.4, p).toFixed(3);
    shadow.style.transform = 'translateX(-50%) scaleX(' + (0.55 + 0.45 * Math.abs(Math.cos(rad))).toFixed(3) + ')';

    var swap = smooth(0.56, 0.64, p);
    print1.style.opacity = (1 - swap).toFixed(3);
    print2.style.opacity = swap.toFixed(3);
    frontShade.setAttribute('fill-opacity', Math.min(0.6, (1 - Math.cos(rad)) * 0.32).toFixed(3));
    backShade.setAttribute('fill-opacity', Math.min(0.6, (1 + Math.cos(rad)) * 0.32).toFixed(3));
  }

  // ---------- scroll loop ----------
  var ticking = false, last = -1;
  function progress() {
    var r = story.getBoundingClientRect();
    var span = Math.max(1, r.height - stage.offsetHeight);
    return clamp(-r.top / span);
  }
  function update() {
    ticking = false;
    var p = progress();
    if (reduced) p = p < 0.05 ? 0 : Math.max(p, 0.3); // skip the vault animation
    if (Math.abs(p - last) < 0.0005) return;
    last = p;
    render(p);
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { last = -1; onScroll(); });
  render(0);
  update();
})();
