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
  // kind: 'tee' renders the 3D shirt in colour `show`; anything else gets a colour block
  var PRODUCTS = {
    basics: [
      { name: 'Camiseta Culture Basic azul-marinho', line: 'Culture Basic', kind: 'tee', show: 'N', colors: 'N W O Be B', price: 'R$ 129,99', old: 'R$ 189,99', off: '−32%' },
      { name: 'Camiseta Basic Premium vinho', line: 'Basic Premium', kind: 'tee', show: 'V', colors: 'V M Be O B', price: 'R$ 159,99', old: 'R$ 209,99', off: '−24%' },
      { name: 'Camiseta Basic Premium marrom', line: 'Basic Premium', kind: 'tee', show: 'M', colors: 'M V Be O B', price: 'R$ 159,99', old: 'R$ 209,99', off: '−24%' },
      { name: 'Camiseta Culture Basic off white', line: 'Culture Basic', kind: 'tee', show: 'O', colors: 'O W Be N B', price: 'R$ 129,99', old: 'R$ 189,99', off: '−32%' },
      { name: 'Camiseta compressão preta', line: 'Compressão', kind: 'tee', show: 'B', colors: 'B W', price: 'R$ 119,99', old: 'R$ 179,99', off: '−33%' },
      { name: 'Camiseta Basic Premium bege', line: 'Basic Premium', kind: 'tee', show: 'Be', colors: 'Be M V O B', price: 'R$ 159,99', old: 'R$ 209,99', off: '−24%' },
      { name: 'Regata canelada branca', line: 'Regata', kind: 'block', word: 'Regata', show: 'W', colors: 'W B', price: 'R$ 109,99', old: 'R$ 169,99', off: '−35%' },
      { name: 'Kit 3 camisetas básicas', line: 'Você escolhe as cores', kind: 'tee', show: 'Gr', colors: 'B M W N Be O Gr', price: 'R$ 259,90', old: 'R$ 379,99', off: '−32%' }
    ],
    pants: [
      { name: 'Calça baggy bordado aranha', line: 'Baggy', kind: 'block', word: 'Baggy', show: 'J', colors: 'J', price: 'R$ 299,99', old: 'R$ 349,99', off: '−14%' },
      { name: 'Calça baggy anjo silk', line: 'Baggy', kind: 'block', word: 'Baggy', show: 'J', colors: 'J', price: 'R$ 279,99', old: 'R$ 289,99', off: '−3%' },
      { name: 'Calça baggy cargo four estonada', line: 'Cargo', kind: 'block', word: 'Cargo', show: 'Ci', colors: 'Ci', price: 'R$ 259,99', old: 'R$ 289,99', off: '−10%' },
      { name: 'Calça baggy destroyed', line: 'Baggy', kind: 'block', word: 'Baggy', show: 'J', colors: 'J', price: 'R$ 259,99', old: 'R$ 289,99', off: '−10%' },
      { name: 'Calça baggy basic estonada', line: 'Baggy', kind: 'block', word: 'Basic', show: 'G', colors: 'G', price: 'R$ 229,99', old: 'R$ 269,99', off: '−15%' }
    ],
    prints: [
      { name: 'Camiseta Jordan Airness', line: 'Esportes', kind: 'tee', show: 'B', colors: 'B O', price: 'R$ 189,99', old: 'R$ 219,99', off: '−14%' },
      { name: 'Camiseta Jesus Saved', line: 'Cristãs', kind: 'tee', show: 'O', colors: 'O B', price: 'R$ 175,99', old: 'R$ 219,99', off: '−20%' },
      { name: 'Camiseta Rodman Bulls', line: 'Esportes', kind: 'tee', show: 'B', colors: 'B O', price: 'R$ 185,99', old: 'R$ 229,99', off: '−19%' },
      { name: 'Camiseta Angel’s Dual', line: 'Artistas', kind: 'tee', show: 'R', colors: 'B O R', price: 'R$ 169,99', old: 'R$ 219,99', off: '−23%' },
      { name: 'Camiseta Basic For Winners', line: 'Exclusivas', kind: 'tee', show: 'B', colors: 'B O', price: 'R$ 159,99', old: 'R$ 219,99', off: '−27%' }
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

  var teeQueue = [];
  function card(p) {
    var dots = p.colors.split(' ').map(function (k) { return '<span title="' + esc(C[k][0]) + '" style="background:' + C[k][1] + '"></span>'; }).join('');
    var hex = C[p.show][1], media;
    if (p.kind === 'tee') {
      media = '<img alt="' + esc(p.name) + '" data-tee="' + hex + '">';
    } else {
      var light = lum(hex) > 0.55;
      media = '<div class="card-block" style="background:linear-gradient(160deg,' + shade(hex, 0.08) + ',' + shade(hex, -0.18) + ')">' +
        '<span class="card-block-word"' + (light ? ' style="color:rgba(0,0,0,0.1)"' : '') + '>' + esc(p.word) + '</span>' +
        '<span class="card-block-note"' + (light ? ' style="color:rgba(0,0,0,0.55)"' : '') + '>Foto em breve</span></div>';
    }
    return '<a href="#" class="card">' +
      '<div class="card-media">' + media + '<span class="tag">' + esc(p.off) + '</span></div>' +
      '<div><h3 class="card-name">' + esc(p.name) + '</h3><p class="card-line">' + esc(p.line) + '</p></div>' +
      '<div class="card-foot"><span class="card-price">' + esc(p.price) + '<s>' + esc(p.old) + '</s></span><span class="swatches">' + dots + '</span></div></a>';
  }
  document.querySelectorAll('[data-products]').forEach(function (el) {
    el.innerHTML = (PRODUCTS[el.dataset.products] || []).map(card).join('');
  });

  // ---------- elements ----------
  var $ = function (id) { return document.getElementById(id); };
  var story = $('story'), stage = story.querySelector('.stage');
  var room = $('room'), lockers = $('lockers'), refl = $('refl'), reflCtx = refl.getContext('2d');
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
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
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

  function render(p) {
    // --- vault: password, dial, door, dive
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
    room.style.setProperty('--sx', left.toFixed(2) + '%');
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
      drawReflection(smooth(0.42, 0.45, p));
      var px = left / 100 * stageW;
      var sw = (shirtS * window.Shirt3D.HEIGHT / VH * stageH) * 0.95 * (0.62 + 0.38 * Math.abs(Math.cos(ry * Math.PI / 180)));
      shadow.style.width = sw.toFixed(0) + 'px';
      shadow.style.transform = 'translate(' + (px - sw / 2).toFixed(1) + 'px,' + (floorPx - 15).toFixed(1) + 'px)';
      shadow.style.opacity = (smooth(0.42, 0.46, p) * 0.9).toFixed(3);
    } else {
      shadow.style.opacity = '0';
      drawReflection(0);
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
    current = Math.abs(d) < 0.0004 ? target : current + d * 0.14;
    render(current);
    if (current !== target) requestAnimationFrame(tick); else running = false;
  }
  var nav = $('nav');
  function onScroll() {
    nav.classList.toggle('solid', story.getBoundingClientRect().bottom < 80);
    target = progress();
    if (!running) { running = true; requestAnimationFrame(tick); }
  }

  // ---------- product thumbnails from the 3D shirt ----------
  function renderThumbs() {
    if (!has3D) return;
    var imgs = Array.prototype.slice.call(document.querySelectorAll('img[data-tee]'));
    var VH = window.Shirt3D.VIEW_H;
    var s = Math.min(VH * 0.74 / window.Shirt3D.HEIGHT, VH * 0.8 * 0.86 / 3.0);
    (function next(i) {
      if (i >= imgs.length) { render(current); return; }
      var img = imgs[i];
      img.src = window.Shirt3D.snapshot(BLANK, BLANK, palFromHex(img.dataset.tee), { w: 480, h: 600, s: s, ry: -0.42, rx: 0.08, y: 0.08 });
      render(current);
      setTimeout(function () { next(i + 1); }, 16);
    })(0);
  }

  if (has3D) window.Shirt3D.onChange = function () { render(current); };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { layout(); target = current = progress(); render(current); });
  layout();
  target = current = progress();
  render(current);
  setTimeout(renderThumbs, 300);
})();
