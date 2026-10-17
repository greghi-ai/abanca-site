/* A Banca Store — home
 * Scroll story: vault password (1425) → door opens → camera dives in →
 * inside the vault, the 3D shirt turns through 4 looks.
 */
(function () {
  'use strict';

  // ---------- settings ----------
  var CODE = ['1', '4', '2', '5']; // loja 1425 no Maxi Shopping

  var PALETTES = {
    branca:   { fab: '#EAE7E1', rib: '#DCD8D0', seam: '#CFCAC1', dark: false },
    offwhite: { fab: '#DDD6C8', rib: '#CEC6B6', seam: '#C3BBAA', dark: false },
    preta:    { fab: '#262422', rib: '#1E1C1B', seam: '#3A3734', dark: true }
  };

  // The 4 looks of the scroll: the shirt turns 180° between each one.
  // y / w = where the print sits: % down from the shoulder line, % of the body width.
  var LOOKS = [
    { color: 'branca',   src: 'assets/prints/1-frente-club.png',    y: 12, w: 22 },
    { color: 'preta',    src: 'assets/prints/2-costas-rosas.png',   y: 8,  w: 44 },
    { color: 'offwhite', src: 'assets/prints/3-frente-john.png',    y: 12, w: 34 },
    { color: 'preta',    src: 'assets/prints/4-costas-michael.png', y: 7,  w: 50 }
  ];
  var BLANK = { src: '', y: 0, w: 0 };
  LOOKS.forEach(function (l) { var i = new Image(); i.src = l.src; }); // preload

  // ---------- products ----------
  var C = {
    W: ['Branco', '#F1EEE8'], B: ['Preto', '#1E1C1B'], O: ['Off white', '#E2DBCD'], Be: ['Bege', '#C9B79C'],
    M: ['Marrom', '#5E4433'], N: ['Azul-marinho', '#1F2A44'], V: ['Vinho', '#5A1F2B'], Gr: ['Verde', '#3E4A3A'],
    J: ['Jeans', '#4B6584'], Ci: ['Cinza', '#7D7B77'], G: ['Grafite', '#3E3F42'], R: ['Vermelho', '#8E2424']
  };
  // kind 'tee' = rendered with the 3D shirt in colour `show`; anything else = colour block with a word
  var PRODUCTS = {
    tees: [
      { name: 'Camiseta Culture Basic azul-marinho', kind: 'tee', show: 'N', colors: 'N W O Be B', price: 'R$ 129,99', old: 'R$ 189,99', off: '32% OFF', inst: 'ou 2x de R$ 65,00 sem juros' },
      { name: 'Camiseta Basic Premium vinho', kind: 'tee', show: 'V', colors: 'V M Be O B', price: 'R$ 159,99', old: 'R$ 209,99', off: '24% OFF', inst: 'ou 2x de R$ 80,00 sem juros' },
      { name: 'Kit 3 camisetas básicas', kind: 'tee', show: 'Gr', colors: 'B M W N Be O Gr', price: 'R$ 259,90', old: 'R$ 379,99', off: '32% OFF', inst: 'ou 4x de R$ 64,98 sem juros' },
      { name: 'Camiseta Culture Basic off white', kind: 'tee', show: 'O', colors: 'O W Be N B', price: 'R$ 129,99', old: 'R$ 189,99', off: '32% OFF', inst: 'ou 2x de R$ 65,00 sem juros' },
      { name: 'Camiseta compressão preta', kind: 'tee', show: 'B', colors: 'B W', price: 'R$ 119,99', old: 'R$ 179,99', off: '33% OFF', inst: 'ou 2x de R$ 60,00 sem juros' },
      { name: 'Camiseta Basic Premium marrom', kind: 'tee', show: 'M', colors: 'M V Be O B', price: 'R$ 159,99', old: 'R$ 209,99', off: '24% OFF', inst: 'ou 2x de R$ 80,00 sem juros' },
      { name: 'Camiseta Basic Premium bege', kind: 'tee', show: 'Be', colors: 'Be M V O B', price: 'R$ 159,99', old: 'R$ 209,99', off: '24% OFF', inst: 'ou 2x de R$ 80,00 sem juros' }
    ],
    pants: [
      { name: 'Calça baggy bordado aranha', kind: 'block', word: 'Baggy', show: 'J', colors: 'J', price: 'R$ 299,99', old: 'R$ 349,99', off: '14% OFF', inst: 'ou 5x de R$ 60,00 sem juros' },
      { name: 'Calça baggy anjo silk', kind: 'block', word: 'Baggy', show: 'J', colors: 'J', price: 'R$ 279,99', old: 'R$ 289,99', off: '3% OFF', inst: 'ou 4x de R$ 70,00 sem juros' },
      { name: 'Calça baggy cargo four estonada', kind: 'block', word: 'Cargo', show: 'Ci', colors: 'Ci', price: 'R$ 259,99', old: 'R$ 289,99', off: '10% OFF', inst: 'ou 4x de R$ 65,00 sem juros' },
      { name: 'Calça baggy destroyed', kind: 'block', word: 'Destroyed', show: 'J', colors: 'J', price: 'R$ 259,99', old: 'R$ 289,99', off: '10% OFF', inst: 'ou 4x de R$ 65,00 sem juros' },
      { name: 'Calça baggy basic estonada', kind: 'block', word: 'Basic', show: 'G', colors: 'G', price: 'R$ 229,99', old: 'R$ 269,99', off: '15% OFF', inst: 'ou 3x de R$ 76,66 sem juros' }
    ],
    others: [
      { name: 'Conjunto moletom zíper duplo marrom', kind: 'block', word: 'Conjunto', show: 'M', colors: 'M Be', price: 'R$ 289,99', old: 'R$ 599,99', off: '52% OFF', inst: 'ou 4x de R$ 72,50 sem juros' },
      { name: 'Conjunto moletom zíper duplo bege', kind: 'block', word: 'Conjunto', show: 'Be', colors: 'Be M', price: 'R$ 289,99', old: 'R$ 599,99', off: '52% OFF', inst: 'ou 4x de R$ 72,50 sem juros' },
      { name: 'Regata canelada branca', kind: 'block', word: 'Regata', show: 'W', colors: 'W B', price: 'R$ 109,99', old: 'R$ 169,99', off: '35% OFF', inst: 'ou R$ 104,49 no Pix' },
      { name: 'Regata canelada preta', kind: 'block', word: 'Regata', show: 'B', colors: 'B W', price: 'R$ 109,99', old: 'R$ 169,99', off: '35% OFF', inst: 'ou R$ 104,49 no Pix' }
    ],
    prints: [
      { name: 'Camiseta Jordan Airness', kind: 'tee', show: 'B', colors: 'B O', price: 'R$ 189,99', old: 'R$ 219,99', off: '14% OFF', inst: 'ou 3x de R$ 63,33 sem juros' },
      { name: 'Camiseta Jesus Saved', kind: 'tee', show: 'O', colors: 'O B', price: 'R$ 175,99', old: 'R$ 219,99', off: '20% OFF', inst: 'ou 2x de R$ 88,00 sem juros' },
      { name: 'Camiseta Rodman Bulls', kind: 'tee', show: 'B', colors: 'B O', price: 'R$ 185,99', old: 'R$ 229,99', off: '19% OFF', inst: 'ou 3x de R$ 62,00 sem juros' },
      { name: 'Camiseta Angel’s Dual', kind: 'tee', show: 'R', colors: 'B O R', price: 'R$ 169,99', old: 'R$ 219,99', off: '23% OFF', inst: 'ou 2x de R$ 85,00 sem juros' },
      { name: 'Camiseta Basic For Winners', kind: 'tee', show: 'B', colors: 'B O', price: 'R$ 159,99', old: 'R$ 219,99', off: '27% OFF', inst: 'ou 2x de R$ 80,00 sem juros' },
      { name: 'Camiseta We Need Jesus', kind: 'tee', show: 'O', colors: 'B O', price: 'R$ 169,99', old: 'R$ 219,99', off: '23% OFF', inst: 'ou 2x de R$ 85,00 sem juros' }
    ]
  };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function shade(hex, k) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    var f = function (v) { return Math.max(0, Math.min(255, Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k))); };
    return '#' + ((1 << 24) + (f(r) << 16) + (f(g) << 8) + f(b)).toString(16).slice(1);
  }
  function lum(hex) { var n = parseInt(hex.slice(1), 16); return (0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255; }
  function palFromHex(hex) { return { fab: hex, rib: shade(hex, -0.08), seam: shade(hex, lum(hex) > 0.5 ? -0.12 : 0.12), dark: lum(hex) < 0.4 }; }

  function card(p) {
    var dots = p.colors.split(' ').map(function (k) { return '<span title="' + esc(C[k][0]) + '" style="background:' + C[k][1] + '"></span>'; }).join('');
    var hex = C[p.show][1], media;
    if (p.kind === 'tee') {
      media = '<img class="front" alt="' + esc(p.name) + '" data-tee="' + hex + '" data-side="front">' +
              '<img class="back" alt="" aria-hidden="true" data-tee="' + hex + '" data-side="back">';
    } else {
      var light = lum(hex) > 0.55;
      media = '<div class="card-block" style="background:linear-gradient(160deg,' + shade(hex, 0.1) + ',' + shade(hex, -0.2) + ')">' +
        '<span class="card-block-word" style="' + (light ? 'color:rgba(0,0,0,0.12);' : '') + (p.word.length > 7 ? 'font-size:clamp(38px,3.4vw,56px);' : '') + '">' + esc(p.word) + '</span>' +
        '<span class="card-block-note"' + (light ? ' style="color:rgba(0,0,0,0.55)"' : '') + '>Foto em breve</span></div>';
    }
    return '<article class="card">' +
      '<div class="card-media"><a href="#" class="card-link" aria-label="' + esc(p.name) + '">' + media + '</a>' +
      '<span class="tag">' + esc(p.off) + '</span>' +
      '<button class="card-add" type="button">Adicionar à sacola</button></div>' +
      '<span class="swatches">' + dots + '</span>' +
      '<h3 class="card-name"><a href="#">' + esc(p.name) + '</a></h3>' +
      '<p class="card-price">' + esc(p.price) + '<s>' + esc(p.old) + '</s></p>' +
      '<p class="card-inst">' + esc(p.inst) + '</p></article>';
  }
  function fillRail(el, key) { el.innerHTML = (PRODUCTS[key] || []).map(card).join(''); el.scrollLeft = 0; }
  var bestRail = document.getElementById('best'), printsRail = document.getElementById('prints');
  fillRail(bestRail, 'tees');
  fillRail(printsRail, 'prints');

  // ---------- elements ----------
  var $ = function (id) { return document.getElementById(id); };
  var story = $('story'), stage = story.querySelector('.stage');
  var room = $('room'), lockers = $('lockers'), refl = $('refl'), reflCtx = refl.getContext('2d'), spot = $('spot');
  var vbg = $('vbg'), vscene = $('vscene'), vdoor = $('vdoor'), vplate = $('vplate');
  var vlight = $('vlight'), vrays = $('vrays'), vlabel = $('vlabel'), vshade = $('vshade');
  var cells = Array.prototype.slice.call(document.querySelectorAll('.vcell'));
  var intro = $('intro'), cap1 = $('cap1');
  var glCanvas = $('shirtGL'), shadow = $('shadow');
  var lookEls = Array.prototype.slice.call(document.querySelectorAll('.look'));
  var has3D = window.Shirt3D && window.Shirt3D.init(glCanvas);

  // ---------- math ----------
  function clamp(x) { return Math.min(1, Math.max(0, x)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smooth(a, b, x) { var t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  // ---------- layout ----------
  var IMG_W = 2752, IMG_H = 1536, VAULT_D = 1360 / IMG_W; // vault diameter as a share of photo width
  var stageW = 1, stageH = 1, narrow = false, shirtS = 1, restTop = 50, floorPx = 600, dpr = 1;

  function buildLockers() {
    var cols = Math.max(5, Math.round(stageW / 150));
    var rowH = Math.round(Math.max(64, Math.min(104, stageH * 0.105)));
    var rows = Math.ceil(floorPx / (rowH + 4)) + 1;
    // put box 1425 high on the right, where the spotlight doesn't cover it
    var tRow = Math.max(1, rows - Math.ceil(floorPx * 0.72 / (rowH + 4))), tCol = cols - 2;
    var start = 1425 - (tRow * cols + tCol);
    var html = '';
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
      var n = start + r * cols + c;
      html += '<div class="box' + (n === 1425 ? ' is-code' : '') + '" data-n="' + n + '"></div>';
    }
    lockers.style.setProperty('--cols', cols);
    lockers.style.setProperty('--row', rowH + 'px');
    lockers.innerHTML = html;
  }

  function layout() {
    stageW = stage.clientWidth; stageH = stage.clientHeight; narrow = stageW < 760;
    var cover = Math.max(stageW, stageH * IMG_W / IMG_H);
    var fit = Math.min(0.78 * stageH, 0.92 * stageW) / VAULT_D;
    var sceneW = Math.min(cover, fit), sceneH = sceneW * IMG_H / IMG_W;
    vscene.style.width = sceneW + 'px';
    vscene.style.left = (stageW / 2 - sceneW / 2) + 'px';
    vscene.style.top = (stageH * 0.52 - sceneH * 0.5013) + 'px';
    vscene.style.setProperty('--dw', (sceneW * 0.41788) + 'px');

    if (has3D) {
      window.Shirt3D.resize(stageW, stageH);
      var VH = window.Shirt3D.VIEW_H, VW = VH * stageW / stageH;
      shirtS = Math.min(VH * (narrow ? 0.44 : 0.6) / window.Shirt3D.HEIGHT, VW * (narrow ? 0.66 : 0.36) / 3.0);
    }
    restTop = narrow ? 36 : 47;
    var hpx = has3D ? shirtS * window.Shirt3D.HEIGHT / window.Shirt3D.VIEW_H * stageH : stageH * 0.5;
    floorPx = Math.round(restTop / 100 * stageH + hpx * 0.5 + 4);
    room.style.setProperty('--floor', floorPx + 'px');
    dpr = 0.5; // the reflection is blurry anyway: half resolution is plenty
    refl.width = Math.round(stageW * dpr); refl.height = Math.round(stageH * dpr);
    buildLockers();
  }

  // ---------- timeline (p goes 0 → 1 over ~1.7 screens of scrolling) ----------
  var T = {
    digits: [0.02, 0.045, 0.07, 0.095], ok: 0.105,
    dial: [0.12, 0.19], pop: [0.185, 0.2], open: [0.2, 0.28], dive: [0.25, 0.37], sceneOut: [0.345, 0.385],
    arrive: [0.355, 0.44],
    path: function (X) {                    // [p, left %, turn°]; flat stretches are where a look rests
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

  function drawReflection(alpha) {
    var W = refl.width, H = refl.height, fy = floorPx * dpr;
    reflCtx.setTransform(1, 0, 0, 1, 0, 0);
    reflCtx.clearRect(0, 0, W, H);
    if (alpha <= 0.01) return;
    reflCtx.save();
    reflCtx.globalAlpha = 0.28 * alpha;
    reflCtx.translate(0, 2 * fy);
    reflCtx.scale(1, -1);
    reflCtx.drawImage(glCanvas, 0, 0, W, H);
    reflCtx.restore();
    reflCtx.globalCompositeOperation = 'destination-in';
    var g = reflCtx.createLinearGradient(0, fy, 0, fy + H * 0.22);
    g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    reflCtx.fillStyle = g;
    reflCtx.fillRect(0, 0, W, H);
    reflCtx.globalCompositeOperation = 'source-over';
  }

  var vaultGone = false, reflOn = true;
  function render(p) {
    // --- vault: password, dial, door, dive (skipped entirely once it has left the screen)
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
    room.style.opacity = smooth(T.dive[0] + 0.04, T.sceneOut[1], p).toFixed(3);

    var introOut = smooth(0.008, 0.04, p);
    intro.style.opacity = (1 - introOut).toFixed(3);
    intro.style.transform = 'translateY(' + (-24 * introOut).toFixed(1) + 'px)';
    cap1.style.opacity = (smooth(T.ok, T.ok + 0.012, p) * (1 - smooth(T.pop[0], T.pop[1], p))).toFixed(3);

    renderShirt(p);
  }

  function renderShirt(p) {
    // --- shirt
    var X = narrow ? [50, 50, 50, 50, 50] : [50, 63, 37, 63, 37];
    var K = T.path(X);
    var arrive = ease(smooth(T.arrive[0], T.arrive[1], p));
    var left = X[0], top = restTop, ry, tilt = 0, sway = 0;
    if (p < K[0][0]) { ry = lerp(-300, 0, arrive); }
    else {
      left = K[K.length - 1][1]; ry = K[K.length - 1][2];
      for (var k = 0; k < K.length - 1; k++) {
        if (p < K[k + 1][0]) {
          var t = ease((p - K[k][0]) / (K[k + 1][0] - K[k][0]));
          left = lerp(K[k][1], K[k + 1][1], t);
          ry = lerp(K[k][2], K[k + 1][2], t);
          tilt = Math.sin(t * Math.PI) * 4 * (K[k + 1][1] < K[k][1] ? -1 : 1);
          sway = Math.sin(t * Math.PI);
          break;
        }
      }
    }
    spot.style.transform = 'translate3d(' + (left / 100 * stageW).toFixed(1) + 'px,0,0)';
    var r = Math.max(0, ry);
    var look = r < 90 ? 0 : r < 270 ? 1 : r < 450 ? 2 : 3;
    var shirtOn = smooth(T.arrive[0] - 0.01, T.arrive[0] + 0.03, p);
    glCanvas.style.opacity = shirtOn.toFixed(3);
    if (has3D && shirtOn > 0) {
      var backLook = p < K[0][0] ? BLANK : LOOKS[r < 360 ? 1 : 3];
      window.Shirt3D.setLook(LOOKS[r < 180 ? 0 : 2], backLook, PALETTES[LOOKS[look].color]);
      var VH = window.Shirt3D.VIEW_H, VW = VH * stageW / stageH;
      window.Shirt3D.draw({
        x: (left / 100 - 0.5) * VW,
        y: -(top / 100 - 0.5) * VH,
        z: lerp(-24, 0, arrive),
        rx: 0.05 + sway * 0.04,
        ry: (ry + Math.sin(p * 90) * 4) * Math.PI / 180,
        rz: tilt * Math.PI / 180,
        s: shirtS
      });
      if (!window.Shirt3D.lowPower) { drawReflection(smooth(0.42, 0.45, p)); reflOn = true; }
      var px = left / 100 * stageW;
      var sw = (shirtS * window.Shirt3D.HEIGHT / VH * stageH) * 0.95 * (0.62 + 0.38 * Math.abs(Math.cos(ry * Math.PI / 180)));
      shadow.style.width = sw.toFixed(0) + 'px';
      shadow.style.transform = 'translate(' + (px - sw / 2).toFixed(1) + 'px,' + (floorPx - 15).toFixed(1) + 'px)';
      shadow.style.opacity = (smooth(0.42, 0.46, p) * 0.9).toFixed(3);
    } else {
      shadow.style.opacity = '0';
      if (reflOn) { drawReflection(0); reflOn = false; }
    }

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
  var target = 0, current = 0, running = false;
  function progress() {
    var r = story.getBoundingClientRect();
    return clamp(-r.top / Math.max(1, r.height - stage.offsetHeight));
  }
  function tick() {
    var d = target - current;
    // without a GPU, skip the easing frames and draw only where the scroll lands
    current = (Math.abs(d) < 0.0004 || (has3D && window.Shirt3D.lowPower)) ? target : current + d * 0.14;
    render(current);
    if (current !== target) requestAnimationFrame(tick); else running = false;
  }
  var storyOnScreen = true;
  // ---------- product thumbnails from the 3D shirt (front + back, cached per colour) ----------
  var thumbCache = {}, thumbBusy = false, thumbWaiting = [];
  function thumbURL(hex, side) {
    var key = hex + side;
    if (!thumbCache[key]) {
      var VH = window.Shirt3D.VIEW_H;
      var s = Math.min(VH * 0.74 / window.Shirt3D.HEIGHT, VH * 0.8 * 0.86 / 3.0);
      thumbCache[key] = window.Shirt3D.snapshot(BLANK, BLANK, palFromHex(hex), {
        w: 400, h: 500, s: s, rx: 0.08, y: 0.06, ry: side === 'back' ? Math.PI + 0.42 : -0.42
      });
    }
    return thumbCache[key];
  }
  function fillThumbs(root) {
    if (!has3D) return;
    thumbWaiting = thumbWaiting.concat(Array.prototype.slice.call(root.querySelectorAll('img[data-tee]:not([src])')));
    if (thumbBusy) return;
    thumbBusy = true;
    (function next() {
      var img = thumbWaiting.shift();
      if (!img) { thumbBusy = false; render(current); return; }
      img.src = thumbURL(img.dataset.tee, img.dataset.side);
      render(current);
      (window.requestIdleCallback || function (f) { return setTimeout(f, 30); })(next);
    })();
  }
  function decorateStore() {
    if (!has3D) return;
    document.querySelectorAll('[data-offer-shirt]').forEach(function (el) {
      el.style.backgroundImage = 'url(' + thumbURL(el.dataset.offerShirt, 'front') + ')';
    });
    var cat = document.querySelector('.cat-tees');
    if (cat && !cat.querySelector('img')) {
      var im = new Image(); im.alt = ''; im.src = thumbURL('#E2DBCD', 'front'); cat.appendChild(im);
    }
    render(current);
  }

  // ---------- store motion ----------
  // tabs swap the best-sellers rail
  document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.tab').forEach(function (t) { t.setAttribute('aria-selected', t === tab ? 'true' : 'false'); });
      fillRail(bestRail, tab.dataset.tab);
      bestRail.classList.remove('swap'); void bestRail.offsetWidth; bestRail.classList.add('swap');
      fillThumbs(bestRail);
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
      // nothing to redraw while the story is off screen and already settled
      if (t !== target || current !== target) {
        target = t;
        if (!running && storyOnScreen) { running = true; requestAnimationFrame(tick); }
        else if (!storyOnScreen) { current = target; }
      }
      campaignMotion();
    });
  }
  if (has3D) window.Shirt3D.onChange = function () { render(current); };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { layout(); target = current = progress(); render(current); campaignMotion(); });
  layout();
  target = current = progress();
  render(current);
  campaignMotion();
  setTimeout(function () { decorateStore(); fillThumbs(document); }, 300);
})();
