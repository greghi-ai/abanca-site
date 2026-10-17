/* A Banca Store — home
 * Scroll story: vault password (1425) → door opens → camera dives in →
 * inside the vault, the shirt (product photos) turns through 4 looks.
 */
(function () {
  'use strict';

  // ---------- settings ----------
  var CODE = ['1', '4', '2', '5']; // loja 1425 no Maxi Shopping

  // The 4 looks of the scroll. The shirt turns 180° between each one;
  // looks 1 and 3 are fronts, 2 and 4 are backs.
  var LOOKS = [
    'assets/tees/look-1-club.webp',
    'assets/tees/look-2-rosas.webp',
    'assets/tees/look-3-welove.webp',
    'assets/tees/look-4-michael.webp'
  ];
  LOOKS.forEach(function (src) { var i = new Image(); i.src = src; }); // preload

  // ---------- products ----------
  var C = {
    W: ['Branco', '#F1EEE8'], B: ['Preto', '#1E1C1B'], O: ['Off white', '#E2DBCD'], Be: ['Bege', '#C9B79C'],
    M: ['Marrom', '#5E4433'], N: ['Azul-marinho', '#1F2A44'], V: ['Vinho', '#5A1F2B'], Gr: ['Verde', '#3E4A3A'],
    J: ['Jeans', '#4B6584'], Ci: ['Cinza', '#7D7B77'], G: ['Grafite', '#3E3F42'], R: ['Vermelho', '#8E2424']
  };
  var TEE = function (k) { return 'assets/tees/tee-' + k + '.webp'; };
  // img = product photo; without img the card shows a colour block with a word
  var PRODUCTS = {
    tees: [
      { name: 'Camiseta Culture Basic azul-marinho', img: TEE('N'), colors: 'N W O Be B', price: 'R$ 129,99', old: 'R$ 189,99', off: '32% OFF', inst: 'ou 2x de R$ 65,00 sem juros' },
      { name: 'Camiseta Basic Premium vinho', img: TEE('V'), colors: 'V M Be O B', price: 'R$ 159,99', old: 'R$ 209,99', off: '24% OFF', inst: 'ou 2x de R$ 80,00 sem juros' },
      { name: 'Kit 3 camisetas básicas', img: TEE('Gr'), colors: 'B M W N Be O Gr', price: 'R$ 259,90', old: 'R$ 379,99', off: '32% OFF', inst: 'ou 4x de R$ 64,98 sem juros' },
      { name: 'Camiseta Culture Basic off white', img: TEE('O'), colors: 'O W Be N B', price: 'R$ 129,99', old: 'R$ 189,99', off: '32% OFF', inst: 'ou 2x de R$ 65,00 sem juros' },
      { name: 'Camiseta compressão preta', img: TEE('B'), colors: 'B W', price: 'R$ 119,99', old: 'R$ 179,99', off: '33% OFF', inst: 'ou 2x de R$ 60,00 sem juros' },
      { name: 'Camiseta Basic Premium marrom', img: TEE('M'), colors: 'M V Be O B', price: 'R$ 159,99', old: 'R$ 209,99', off: '24% OFF', inst: 'ou 2x de R$ 80,00 sem juros' },
      { name: 'Camiseta Basic Premium bege', img: TEE('Be'), colors: 'Be M V O B', price: 'R$ 159,99', old: 'R$ 209,99', off: '24% OFF', inst: 'ou 2x de R$ 80,00 sem juros' }
    ],
    pants: [
      { name: 'Calça baggy bordado aranha', word: 'Baggy', show: 'J', colors: 'J', price: 'R$ 299,99', old: 'R$ 349,99', off: '14% OFF', inst: 'ou 5x de R$ 60,00 sem juros' },
      { name: 'Calça baggy anjo silk', word: 'Baggy', show: 'J', colors: 'J', price: 'R$ 279,99', old: 'R$ 289,99', off: '3% OFF', inst: 'ou 4x de R$ 70,00 sem juros' },
      { name: 'Calça baggy cargo four estonada', word: 'Cargo', show: 'Ci', colors: 'Ci', price: 'R$ 259,99', old: 'R$ 289,99', off: '10% OFF', inst: 'ou 4x de R$ 65,00 sem juros' },
      { name: 'Calça baggy destroyed', word: 'Destroyed', show: 'J', colors: 'J', price: 'R$ 259,99', old: 'R$ 289,99', off: '10% OFF', inst: 'ou 4x de R$ 65,00 sem juros' },
      { name: 'Calça baggy basic estonada', word: 'Basic', show: 'G', colors: 'G', price: 'R$ 229,99', old: 'R$ 269,99', off: '15% OFF', inst: 'ou 3x de R$ 76,66 sem juros' }
    ],
    others: [
      { name: 'Conjunto moletom zíper duplo marrom', word: 'Conjunto', show: 'M', colors: 'M Be', price: 'R$ 289,99', old: 'R$ 599,99', off: '52% OFF', inst: 'ou 4x de R$ 72,50 sem juros' },
      { name: 'Conjunto moletom zíper duplo bege', word: 'Conjunto', show: 'Be', colors: 'Be M', price: 'R$ 289,99', old: 'R$ 599,99', off: '52% OFF', inst: 'ou 4x de R$ 72,50 sem juros' },
      { name: 'Regata canelada branca', word: 'Regata', show: 'W', colors: 'W B', price: 'R$ 109,99', old: 'R$ 169,99', off: '35% OFF', inst: 'ou R$ 104,49 no Pix' },
      { name: 'Regata canelada preta', word: 'Regata', show: 'B', colors: 'B W', price: 'R$ 109,99', old: 'R$ 169,99', off: '35% OFF', inst: 'ou R$ 104,49 no Pix' }
    ],
    prints: [
      { name: 'Camiseta A Banca Club', img: LOOKS[0], colors: 'O', price: '[PREÇO]' },
      { name: 'Camiseta Rosas do Club', img: LOOKS[1], colors: 'B', price: '[PREÇO]' },
      { name: 'Camiseta Jordan Airness', img: 'assets/tees/jordan.webp', colors: 'B O', price: 'R$ 189,99', old: 'R$ 219,99', off: '14% OFF', inst: 'ou 3x de R$ 63,33 sem juros' },
      { name: 'Camiseta We Love', img: LOOKS[2], colors: 'O', price: '[PREÇO]' },
      { name: 'Camiseta Michael', img: LOOKS[3], colors: 'B', price: '[PREÇO]' }
    ]
  };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function shade(hex, k) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    var f = function (v) { return Math.max(0, Math.min(255, Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k))); };
    return '#' + ((1 << 24) + (f(r) << 16) + (f(g) << 8) + f(b)).toString(16).slice(1);
  }
  function lum(hex) { var n = parseInt(hex.slice(1), 16); return (0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255; }

  function card(p) {
    var dots = p.colors.split(' ').map(function (k) { return '<span title="' + esc(C[k][0]) + '" style="background:' + C[k][1] + '"></span>'; }).join('');
    var media;
    if (p.img) {
      media = '<img src="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy" decoding="async">';
    } else {
      var hex = C[p.show][1], light = lum(hex) > 0.55;
      media = '<div class="card-block" style="background:linear-gradient(160deg,' + shade(hex, 0.1) + ',' + shade(hex, -0.2) + ')">' +
        '<span class="card-block-word" style="' + (light ? 'color:rgba(0,0,0,0.12);' : '') + (p.word.length > 7 ? 'font-size:clamp(38px,3.4vw,56px);' : '') + '">' + esc(p.word) + '</span>' +
        '<span class="card-block-note"' + (light ? ' style="color:rgba(0,0,0,0.55)"' : '') + '>Foto em breve</span></div>';
    }
    return '<article class="card">' +
      '<div class="card-media"><a href="#" class="card-link" aria-label="' + esc(p.name) + '">' + media + '</a>' +
      (p.off ? '<span class="tag">' + esc(p.off) + '</span>' : '') +
      '<button class="card-add" type="button">Adicionar à sacola</button></div>' +
      '<span class="swatches">' + dots + '</span>' +
      '<h3 class="card-name"><a href="#">' + esc(p.name) + '</a></h3>' +
      '<p class="card-price">' + esc(p.price) + (p.old ? '<s>' + esc(p.old) + '</s>' : '') + '</p>' +
      (p.inst ? '<p class="card-inst">' + esc(p.inst) + '</p>' : '') + '</article>';
  }
  function fillRail(el, key) { el.innerHTML = (PRODUCTS[key] || []).map(card).join(''); el.scrollLeft = 0; }
  var bestRail = document.getElementById('best'), printsRail = document.getElementById('prints');
  fillRail(bestRail, 'tees');
  fillRail(printsRail, 'prints');
  document.querySelectorAll('[data-offer-shirt]').forEach(function (el) {
    el.style.backgroundImage = 'url(' + TEE(el.dataset.offerShirt) + ')';
  });
  var catTees = document.querySelector('.cat-tees');
  if (catTees) { var ci = new Image(); ci.alt = ''; ci.src = TEE('O'); catTees.appendChild(ci); }

  // ---------- elements ----------
  var $ = function (id) { return document.getElementById(id); };
  var story = $('story'), stage = story.querySelector('.stage');
  var room = $('room'), roomBg = $('roomBg');
  var vbg = $('vbg'), vscene = $('vscene'), vdoor = $('vdoor'), vplate = $('vplate');
  var vlight = $('vlight'), vrays = $('vrays'), vlabel = $('vlabel'), vshade = $('vshade');
  var cells = Array.prototype.slice.call(document.querySelectorAll('.vcell'));
  var intro = $('intro'), cap1 = $('cap1');
  var tees = $('tees'), tee = $('tee'), teeCard = $('teeCard'), refl = $('teeRefl'), reflCard = $('reflCard'), shadow = $('shadow');
  var faces = { front: [$('teeFront'), $('reflFront')], back: [$('teeBack'), $('reflBack')] };
  var lights = { front: $('teeFrontLight'), back: $('teeBackLight') };
  var lookEls = Array.prototype.slice.call(document.querySelectorAll('.look'));

  // ---------- math ----------
  function clamp(x) { return Math.min(1, Math.max(0, x)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smooth(a, b, x) { var t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  // ---------- layout ----------
  var IMG_W = 2752, IMG_H = 1536, VAULT_D = 1360 / IMG_W;   // street vault photo
  var ROOM_W = 2752, ROOM_H = 1536, ROOM_FLOOR = 0.80;       // vault room photo: centre of the light pool on the floor
  var stageW = 1, stageH = 1, narrow = false;
  var teeW = 400, teeH = 362, floorY = 600, roomScale = 1, roomX = 0, roomY = 0;

  function layout() {
    stageW = stage.clientWidth; stageH = stage.clientHeight; narrow = stageW < 760;
    // street vault
    var cover = Math.max(stageW, stageH * IMG_W / IMG_H);
    var fit = Math.min(0.78 * stageH, 0.92 * stageW) / VAULT_D;
    var sceneW = Math.min(cover, fit), sceneH = sceneW * IMG_H / IMG_W;
    vscene.style.width = sceneW + 'px';
    vscene.style.left = (stageW / 2 - sceneW / 2) + 'px';
    vscene.style.top = (stageH * 0.52 - sceneH * 0.5013) + 'px';
    vscene.style.setProperty('--dw', (sceneW * 0.41788) + 'px');

    // vault room photo: cover the stage; on phones lift the floor so the shirt sits above the text panel
    roomScale = Math.max(stageW / ROOM_W, stageH / ROOM_H);
    var rw = ROOM_W * roomScale, rh = ROOM_H * roomScale;
    floorY = narrow ? stageH * 0.6 : stageH / 2 + (ROOM_FLOOR - 0.5) * rh;
    roomX = (stageW - rw) / 2;
    roomY = narrow ? floorY - ROOM_FLOOR * rh : (stageH - rh) / 2;
    roomBg.style.width = ROOM_W + 'px';

    // shirt size: tall enough to read the print, narrow enough to leave room for the text
    teeH = narrow ? Math.min(stageH * 0.36, stageW * 0.8 * 815 / 900) : Math.min(stageH * 0.54, stageW * 0.34 * 815 / 900);
    teeW = teeH * 900 / 815;
    tee.style.width = refl.style.width = teeW + 'px';
    shadow.style.width = (teeW * 0.86) + 'px';
  }

  // ---------- timeline (p goes 0 → 1 over ~1.7 screens of scrolling) ----------
  var T = {
    digits: [0.02, 0.045, 0.07, 0.095], ok: 0.105,
    dial: [0.12, 0.19], pop: [0.185, 0.2], open: [0.2, 0.28], dive: [0.25, 0.37], sceneOut: [0.345, 0.385],
    arrive: [0.355, 0.44],
    path: function (X) {                    // [p, x %, turn°]; flat stretches are where a look rests
      return [
        [0.44, X[0], 0],
        [0.47, X[1], 0], [0.53, X[1], 0],     // look 1 · front
        [0.61, X[2], 180], [0.68, X[2], 180], // look 2 · back
        [0.76, X[3], 360], [0.83, X[3], 360], // look 3 · front
        [0.92, X[4], 540]                     // look 4 · back
      ];
    },
    rests: [[0.46, 0.555], [0.6, 0.705], [0.75, 0.855], [0.905, 1.01]]
  };

  var shown = { front: '', back: '' };
  function setFace(side, src) {
    if (shown[side] === src) return;
    shown[side] = src;
    faces[side].forEach(function (img) { img.src = src; });
    var m = 'url(' + src + ')';
    lights[side].style.webkitMaskImage = m;
    lights[side].style.maskImage = m;
  }

  var vaultGone = false;
  function render(p) {
    // --- vault: password, dial, door, dive (skipped once it has left the screen)
    var past = p > T.sceneOut[1] + 0.01;
    if (past && vaultGone) { renderShirt(p); return; }
    vaultGone = past;

    var typed = T.digits.filter(function (t) { return p >= t; }).length;
    var accepted = p >= T.ok;
    cells.forEach(function (c, i) {
      c.firstChild.textContent = i < typed ? CODE[i] : '';
      c.classList.toggle('on', i < typed);
      c.classList.toggle('ok', accepted);
    });
    vlabel.textContent = accepted ? 'LIBERADO' : (typed ? 'DIGITANDO' : 'TRAVADO');
    vlabel.classList.toggle('ok', accepted);

    var pop = smooth(T.pop[0], T.pop[1], p);
    var open = ease(smooth(T.open[0], T.open[1], p));
    var dive = smooth(T.dive[0], T.dive[1], p);
    var diveE = dive * dive * (1.6 - 0.6 * dive);
    vplate.style.transform = 'rotate(' + (ease(smooth(T.dial[0], T.dial[1], p)) * 450).toFixed(1) + 'deg)';
    vdoor.style.transform = 'translateZ(' + (pop * 26).toFixed(1) + 'px) rotateY(' + (-108 * open).toFixed(2) + 'deg)';
    vlight.style.opacity = (Math.max(pop * 0.35, open) * (1 - 0.85 * dive)).toFixed(3);
    vrays.style.opacity = (open * (1 - dive)).toFixed(3);
    vrays.style.transform = 'rotate(' + (p * 120).toFixed(1) + 'deg)';
    vscene.style.transform = 'scale(' + (1 + diveE * 11).toFixed(3) + ')';
    vbg.style.transform = 'scale(' + (1 + diveE * 0.6).toFixed(3) + ')';
    var sceneOut = smooth(T.sceneOut[0], T.sceneOut[1], p);
    vscene.style.opacity = vbg.style.opacity = vshade.style.opacity = (1 - sceneOut).toFixed(3);
    vscene.style.visibility = vbg.style.visibility = sceneOut >= 1 ? 'hidden' : 'visible';

    var introOut = smooth(0.008, 0.04, p);
    intro.style.opacity = (1 - introOut).toFixed(3);
    intro.style.transform = 'translateY(' + (-24 * introOut).toFixed(1) + 'px)';
    cap1.style.opacity = (smooth(T.ok, T.ok + 0.012, p) * (1 - smooth(T.pop[0], T.pop[1], p))).toFixed(3);
    renderShirt(p);
  }

  function renderShirt(p) {
    // --- the room: fades in as the camera passes the door, and settles from a slight push-in
    var roomIn = smooth(T.dive[0] + 0.04, T.sceneOut[1], p);
    room.style.opacity = roomIn.toFixed(3);
    var settle = 1 + 0.18 * (1 - ease(smooth(T.dive[0] + 0.04, T.arrive[1], p)));
    var sc = roomScale * settle;
    var cx = stageW / 2, cy = floorY;
    roomBg.style.transform = 'translate3d(' + (cx + (roomX - cx) * settle).toFixed(1) + 'px,' + (cy + (roomY - cy) * settle).toFixed(1) + 'px,0) scale(' + sc.toFixed(4) + ')';

    // --- the shirt
    var X = narrow ? [50, 50, 50, 50, 50] : [50, 57, 43, 57, 43];
    var K = T.path(X);
    var arrive = ease(smooth(T.arrive[0], T.arrive[1], p));
    var x = X[0], ry, tilt = 0, lift = 0;
    if (p < K[0][0]) { ry = lerp(-75, 0, arrive); tilt = lerp(-6, 0, arrive); }
    else {
      x = K[K.length - 1][1]; ry = K[K.length - 1][2];
      for (var k = 0; k < K.length - 1; k++) {
        if (p < K[k + 1][0]) {
          var t = ease((p - K[k][0]) / (K[k + 1][0] - K[k][0]));
          x = lerp(K[k][1], K[k + 1][1], t);
          ry = lerp(K[k][2], K[k + 1][2], t);
          var swing = Math.sin(t * Math.PI);
          tilt = swing * 3 * (K[k + 1][1] < K[k][1] ? -1 : 1);
          lift = swing * teeH * 0.04;
          break;
        }
      }
    }
    var r = Math.max(0, ry);
    setFace('front', LOOKS[r < 180 ? 0 : 2]);
    setFace('back', LOOKS[r < 360 ? 1 : 3]);

    var on = smooth(T.arrive[0] - 0.01, T.arrive[0] + 0.03, p);
    tees.style.opacity = on.toFixed(3);
    tees.style.visibility = on > 0 ? 'visible' : 'hidden';
    if (on <= 0) return;
    var px = x / 100 * stageW - teeW / 2;
    var bob = Math.sin(p * 60) * teeH * 0.006;
    var py = floorY - teeH - teeH * 0.06 - lift + bob;      // hangs just above the floor
    var z = lerp(-1600, 0, arrive);
    tee.style.transform = 'translate3d(' + px.toFixed(1) + 'px,' + py.toFixed(1) + 'px,' + z.toFixed(1) + 'px) rotateZ(' + tilt.toFixed(2) + 'deg)';
    teeCard.style.transform = 'rotateY(' + ry.toFixed(2) + 'deg)';
    // reflection on the floor: same card, flipped below the hem
    var ry2 = floorY + (floorY - (py + teeH));
    refl.style.transform = 'translate3d(' + px.toFixed(1) + 'px,' + ry2.toFixed(1) + 'px,' + z.toFixed(1) + 'px) rotateZ(' + (-tilt).toFixed(2) + 'deg) scaleY(-1)';
    reflCard.style.transform = 'rotateY(' + ry.toFixed(2) + 'deg)';
    refl.style.opacity = (0.2 * smooth(0.42, 0.46, p)).toFixed(3);
    // soft shadow on the floor, narrower while the shirt is edge-on
    var turn = Math.abs(Math.cos(ry * Math.PI / 180));
    var sw = teeW * 0.86 * (0.45 + 0.55 * turn);
    shadow.style.transform = 'translate3d(' + (x / 100 * stageW - sw / 2).toFixed(1) + 'px,' + (floorY - 17).toFixed(1) + 'px,0) scaleX(' + (sw / (teeW * 0.86)).toFixed(3) + ')';
    shadow.style.opacity = (0.85 * smooth(0.42, 0.46, p) * (0.7 + 0.3 * turn)).toFixed(3);

    // --- copy for the active look
    lookEls.forEach(function (el, i) {
      var w = T.rests[i];
      var o = smooth(w[0] - 0.03, w[0], p) * (1 - smooth(w[1], w[1] + 0.03, p));
      el.style.opacity = o.toFixed(3);
      el.style.visibility = o > 0.01 ? 'visible' : 'hidden';
      el.classList.toggle('on', o > 0.5);
      var dy = (1 - o) * 20;
      el.style.transform = narrow ? 'translateY(' + dy.toFixed(1) + 'px)' : 'translateY(calc(-50% + ' + dy.toFixed(1) + 'px))';
    });
  }

  // ---------- scroll loop (eased, so wheel clicks glide instead of jumping) ----------
  var target = 0, current = 0, running = false, storyOnScreen = true;
  function progress() {
    var r = story.getBoundingClientRect();
    return clamp(-r.top / Math.max(1, r.height - stage.offsetHeight));
  }
  function tick() {
    var d = target - current;
    current = Math.abs(d) < 0.0004 ? target : current + d * 0.16;
    render(current);
    if (current !== target) requestAnimationFrame(tick); else running = false;
  }

  // ---------- store motion ----------
  // tabs swap the best-sellers rail
  document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.tab').forEach(function (t) { t.setAttribute('aria-selected', t === tab ? 'true' : 'false'); });
      fillRail(bestRail, tab.dataset.tab);
      bestRail.classList.remove('swap'); void bestRail.offsetWidth; bestRail.classList.add('swap');
    });
  });

  // rails: arrows + drag with inertia
  document.querySelectorAll('.rail').forEach(function (rail) {
    var track = rail.querySelector('[data-rail]');
    rail.querySelectorAll('.arrow').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var c = track.querySelector('.card');
        var step = c ? (c.getBoundingClientRect().width + 16) * 2 : 400;
        track.scrollBy({ left: step * Number(btn.dataset.dir), behavior: 'smooth' });
      });
    });
    var down = false, startX = 0, startLeft = 0, lastX = 0, lastT = 0, v = 0, moved = false;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return; // touch scrolls natively
      down = true; moved = false; startX = lastX = e.clientX; startLeft = track.scrollLeft; lastT = performance.now(); v = 0;
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 4 && !moved) { moved = true; track.classList.add('dragging'); }
      if (!moved) return;
      track.scrollLeft = startLeft - dx;
      var now = performance.now(); v = (e.clientX - lastX) / Math.max(1, now - lastT); lastX = e.clientX; lastT = now;
    });
    window.addEventListener('pointerup', function () {
      if (!down) return;
      down = false;
      if (!moved) return;
      var vel = -v * 16;
      (function glide() {
        if (Math.abs(vel) < 0.5) { track.classList.remove('dragging'); return; }
        track.scrollLeft += vel; vel *= 0.94;
        requestAnimationFrame(glide);
      })();
    });
    track.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  });

  // cards: slight 3D tilt following the pointer
  var tilted = null;
  document.addEventListener('pointermove', function (e) {
    var m = e.target.closest && e.target.closest('.card-media');
    if (tilted && tilted !== m) { tilted.classList.remove('tilting'); tilted.style.transform = ''; tilted = null; }
    if (!m || e.pointerType !== 'mouse') return;
    tilted = m;
    var r = m.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    m.classList.add('tilting');
    m.style.transform = 'perspective(800px) rotateY(' + (x * 8).toFixed(2) + 'deg) rotateX(' + (-y * 8).toFixed(2) + 'deg) translateY(-4px)';
  });

  // add to bag: the counter answers
  var bagCount = document.querySelector('.bag-count'), bag = 0;
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.card-add');
    if (!b) return;
    bag++; bagCount.textContent = bag;
    bagCount.parentElement.setAttribute('aria-label', 'Sacola, ' + bag + (bag === 1 ? ' item' : ' itens'));
    bagCount.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.6)' }, { transform: 'scale(1)' }], { duration: 400, easing: 'cubic-bezier(.2,.7,.2,1)' });
    b.textContent = 'Adicionado';
    setTimeout(function () { b.textContent = 'Adicionar à sacola'; }, 1400);
  });

  // campaign: giant type slides with the scroll, halftone drifts
  var campaign = document.querySelector('.campaign');
  var ctRows = Array.prototype.slice.call(document.querySelectorAll('.ct-row'));
  var dots = document.querySelector('.campaign-dots');
  function campaignMotion() {
    if (!campaign) return;
    var r = campaign.getBoundingClientRect(), vh = window.innerHeight;
    if (r.bottom < 0 || r.top > vh) return;
    var t = (vh - r.top) / (vh + r.height); // 0 → 1 while it crosses the screen
    ctRows.forEach(function (row) {
      var sp = Number(row.dataset.speed);
      row.style.transform = 'translateX(' + ((sp > 0 ? -40 : -10) + sp * t * 30).toFixed(2) + '%)';
    });
    dots.style.transform = 'translate3d(' + (t * -60).toFixed(1) + 'px,' + (t * -120).toFixed(1) + 'px,0)';
  }

  // titles reveal once when they enter
  if ('IntersectionObserver' in window) {
    // watch the parent: a clipped element can report as not visible
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
        io.unobserve(en.target);
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el.parentElement); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  // ---------- start ----------
  var nav = $('nav');
  var ticking2 = false;
  function onScroll() {
    if (ticking2) return;
    ticking2 = true;
    requestAnimationFrame(function () {
      ticking2 = false;
      var r = story.getBoundingClientRect();
      nav.classList.toggle('solid', r.bottom < 80);
      storyOnScreen = r.bottom > 0;
      var t = progress();
      if (t !== target || current !== target) {
        target = t;
        if (!running && storyOnScreen) { running = true; requestAnimationFrame(tick); }
        else if (!storyOnScreen) { current = target; }
      }
      campaignMotion();
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { layout(); target = current = progress(); vaultGone = false; render(current); campaignMotion(); });
  layout();
  target = current = progress();
  render(current);
  campaignMotion();
})();
