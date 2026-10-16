/* A Banca Store — home
 * Scroll story: vault password (1425) → door opens → 3D shirt emerges,
 * turns to the side (print swaps) and ends showing the back print.
 */
(function () {
  'use strict';

  // ---------- settings ----------
  var CODE = ['1', '4', '2', '5']; // loja 1425 no Maxi Shopping

  var PALETTES = {
    branca:   { fab: '#EAE7E1', rib: '#DCD8D0', seam: '#CFCAC1', inner: '#B9B4AB', dark: false },
    offwhite: { fab: '#DDD6C8', rib: '#CEC6B6', seam: '#C3BBAA', inner: '#ACA493', dark: false },
    preta:    { fab: '#262422', rib: '#1E1C1B', seam: '#3A3734', inner: '#121110', dark: true }
  };

  // The 4 looks of the scroll: the shirt turns 180° between each one.
  // side 'front' = print on the chest, 'back' = print on the back.
  // x / y / w = where the print sits on the shirt, in % of the shirt's width/height.
  var LOOKS = [
    { side: 'front', color: 'branca',   src: 'assets/prints/1-frente-club.png',    x: 50, y: 12, w: 22 },
    { side: 'back',  color: 'preta',    src: 'assets/prints/2-costas-rosas.png',   x: 50, y: 8, w: 44 },
    { side: 'front', color: 'offwhite', src: 'assets/prints/3-frente-john.png',    x: 50, y: 12, w: 34 },
    { side: 'back',  color: 'preta',    src: 'assets/prints/4-costas-michael.png', x: 50, y: 7, w: 50 }
  ];
  var BLANK = { src: '', x: 50, y: 20, w: 0 };
  LOOKS.forEach(function (l) { var i = new Image(); i.src = l.src; }); // preload

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
    if (!box) return;
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
  chips('colors', ['OFF WHITE', 'PRETO', 'CINZA'], 'OFF WHITE');

  // ---------- vault + shirt ----------
  var $ = function (id) { return document.getElementById(id); };
  var story = $('story'), stage = story.querySelector('.stage');
  var vbg = $('vbg'), vscene = $('vscene'), vdoor = $('vdoor'), vplate = $('vplate');
  var vlight = $('vlight'), vrays = $('vrays'), vlabel = $('vlabel'), vshade = $('vshade');
  var cells = Array.prototype.slice.call(document.querySelectorAll('.vcell'));
  var intro = $('intro'), cap1 = $('cap1'), cap2 = $('cap2');
  var glCanvas = $('shirtGL'), shadow = $('shadow');
  var has3D = window.Shirt3D && window.Shirt3D.init(glCanvas);

  // ---------- math ----------
  function clamp(x) { return Math.min(1, Math.max(0, x)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smooth(a, b, x) { var t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }


  // ---------- layout of the vault photo ----------
  var IMG_W = 2752, IMG_H = 1536, VAULT_D = 1360 / IMG_W; // vault diameter as a share of photo width
  var sceneW = 1200, sceneH = 670, stageW = 1, stageH = 1;
  function layout() {
    stageW = stage.clientWidth; stageH = stage.clientHeight;
    var cover = Math.max(stageW, stageH * IMG_W / IMG_H);
    var fit = Math.min(0.78 * stageH, 0.92 * stageW) / VAULT_D;
    sceneW = Math.min(cover, fit);
    sceneH = sceneW * IMG_H / IMG_W;
    vscene.style.width = sceneW + 'px';
    vscene.style.left = (stageW / 2 - sceneW / 2) + 'px';
    vscene.style.top = (stageH * 0.52 - sceneH * 0.5013) + 'px';
    vscene.style.setProperty('--dw', (sceneW * 0.41788) + 'px');
    if (has3D) window.Shirt3D.resize(stageW, stageH);
  }

  var lookCopy = Array.prototype.slice.call(document.querySelectorAll('.look-copy'));
  var lookTag = $('lookTag'), lookBars = Array.prototype.slice.call(document.querySelectorAll('#lookProgress span')), lookProgress = $('lookProgress');

  // timeline (p goes 0 → 1 over the story, ~1.7 screens of scrolling):
  //   0    – 0.11  password 1-4-2-5 typed on the door's display
  //   0.12 – 0.19  dial turns, door unlatches
  //   0.19 – 0.28  door swings open, light pours out
  //   0.25 – 0.37  camera flies into the vault
  //   0.35 – 0.45  shirt arrives → then the 4 looks
  var T = {
    digits: [0.02, 0.045, 0.07, 0.095], ok: 0.105,
    dial: [0.12, 0.19], pop: [0.185, 0.2], open: [0.2, 0.28], dive: [0.25, 0.37], sceneOut: [0.345, 0.385],
    arrive: [0.355, 0.44],
    // [p, left %, turn°]  — rests are the flat stretches
    path: function (X) {
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

  function render(p) {
    var narrow = stageW < 760;
    var typed = T.digits.filter(function (t) { return p >= t; }).length;
    var accepted = p >= T.ok;
    cells.forEach(function (c, i) {
      c.firstChild.textContent = i < typed ? CODE[i] : '';
      c.classList.toggle('on', i < typed);
      c.classList.toggle('ok', accepted);
    });
    vlabel.textContent = accepted ? 'LIBERADO' : (typed ? 'DIGITANDO' : 'TRAVADO');
    vlabel.classList.toggle('ok', accepted);

    var dial = ease(smooth(T.dial[0], T.dial[1], p)) * 450;
    var pop = smooth(T.pop[0], T.pop[1], p);
    var open = ease(smooth(T.open[0], T.open[1], p));
    var dive = smooth(T.dive[0], T.dive[1], p);
    var diveE = dive * dive * (1.6 - 0.6 * dive);

    vplate.style.transform = 'rotate(' + dial.toFixed(1) + 'deg)';
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
    cap2.style.opacity = (smooth(T.dive[0] - 0.01, T.dive[0] + 0.01, p) * (1 - smooth(T.dive[1] - 0.04, T.dive[1] - 0.015, p))).toFixed(3);

    // ---- shirt
    var X = narrow ? [50, 50, 50, 50, 50] : [50, 64, 35, 65, 35];
    var K = T.path(X);
    var restTop = narrow ? 37 : 50;
    var arrive = ease(smooth(T.arrive[0], T.arrive[1], p));
    var left = X[0], top = narrow ? 42 : 50, ry, tilt = 0, sway = 0;
    if (p < K[0][0]) { ry = lerp(-300, 0, arrive); }
    else {
      left = K[K.length - 1][1]; ry = K[K.length - 1][2]; top = restTop;
      for (var k = 0; k < K.length - 1; k++) {
        if (p < K[k + 1][0]) {
          var t = ease((p - K[k][0]) / (K[k + 1][0] - K[k][0]));
          left = lerp(K[k][1], K[k + 1][1], t);
          ry = lerp(K[k][2], K[k + 1][2], t);
          top = k === 0 ? lerp(narrow ? 42 : 50, restTop, t) : restTop;
          var dir = K[k + 1][1] < K[k][1] ? -1 : 1;
          tilt = Math.sin(t * Math.PI) * 5 * dir;
          sway = Math.sin(t * Math.PI);
          break;
        }
      }
    }
    var r = Math.max(0, ry);
    var look = r < 90 ? 0 : r < 270 ? 1 : r < 450 ? 2 : 3;
    var pal = PALETTES[LOOKS[look].color];
    var shirtOn = smooth(T.arrive[0] - 0.01, T.arrive[0] + 0.03, p);
    glCanvas.style.opacity = shirtOn.toFixed(3);
    if (has3D && shirtOn > 0) {
      var backLook = p < K[0][0] ? BLANK : LOOKS[r < 360 ? 1 : 3];
      window.Shirt3D.setLook(LOOKS[r < 180 ? 0 : 2], backLook, pal);
      var VH = window.Shirt3D.VIEW_H, VW = VH * stageW / stageH;
      var s = Math.min(VH * (narrow ? 0.5 : 0.66) / window.Shirt3D.HEIGHT, VW * (narrow ? 0.62 : 0.34) / 3.0);
      // an idle breathing turn while it rests, so it never looks frozen
      var idle = Math.sin(p * 90) * 4;
      window.Shirt3D.draw({
        x: (left / 100 - 0.5) * VW,
        y: -(top / 100 - 0.5) * VH,
        z: lerp(-24, 0, arrive),
        rx: 0.06 + sway * 0.05,
        ry: (ry + idle) * Math.PI / 180,
        rz: tilt * Math.PI / 180,
        s: s
      });
      var hpx = s * window.Shirt3D.HEIGHT / VH * stageH;
      var px = left / 100 * stageW, py = top / 100 * stageH + hpx * 0.53;
      var sw = hpx * 0.95 * (0.6 + 0.4 * Math.abs(Math.cos(ry * Math.PI / 180)));
      shadow.style.width = sw.toFixed(0) + 'px';
      shadow.style.left = shadow.style.top = '0';
      shadow.style.transform = 'translate(' + (px - sw / 2).toFixed(1) + 'px,' + (py - 15).toFixed(1) + 'px)';
      shadow.style.opacity = (smooth(0.4, 0.46, p) * 0.9).toFixed(3);
    } else {
      shadow.style.opacity = '0';
    }

    // ---- look copy, spray tag and progress bars
    var active = -1;
    lookCopy.forEach(function (el, i) {
      var w = T.rests[i];
      var o = smooth(w[0] - 0.03, w[0], p) * (1 - smooth(w[1], w[1] + 0.03, p));
      if (o > 0.5) active = i;
      el.style.opacity = o.toFixed(3);
      el.style.visibility = o > 0.01 ? 'visible' : 'hidden';
      el.classList.toggle('on', o > 0.5);
      var dy = (1 - o) * 24;
      el.style.transform = narrow ? 'translateY(' + dy.toFixed(1) + 'px)' : 'translateY(calc(-50% + ' + dy.toFixed(1) + 'px))';
    });
    var after = smooth(0.42, 0.47, p);
    lookTag.style.opacity = after.toFixed(3);
    lookProgress.style.opacity = after.toFixed(3);
    lookBars.forEach(function (b, i) { b.classList.toggle('on', i <= Math.max(0, look)); });
  }

  // ---------- scroll loop (eased, so wheel clicks glide instead of jumping) ----------
  var target = 0, current = 0, running = false;
  function progress() {
    var r = story.getBoundingClientRect();
    var span = Math.max(1, r.height - stage.offsetHeight);
    return clamp(-r.top / span);
  }
  function tick() {
    var d = target - current;
    current = Math.abs(d) < 0.0004 ? target : current + d * 0.14;
    render(current);
    if (current !== target) requestAnimationFrame(tick); else running = false;
  }
  function onScroll() {
    target = progress();
    if (!running) { running = true; requestAnimationFrame(tick); }
  }
  if (has3D) window.Shirt3D.onChange = function () { render(current); };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { layout(); target = current = progress(); render(current); });
  layout();
  target = current = progress();
  render(current);
})();
