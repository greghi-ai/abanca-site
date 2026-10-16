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
    { side: 'front', color: 'branca',   src: 'assets/prints/1-frente-club.png',    x: 50, y: 21, w: 24 },
    { side: 'back',  color: 'preta',    src: 'assets/prints/2-costas-rosas.png',   x: 50, y: 16, w: 40 },
    { side: 'front', color: 'offwhite', src: 'assets/prints/3-frente-john.png',    x: 50, y: 21, w: 34 },
    { side: 'back',  color: 'preta',    src: 'assets/prints/4-costas-michael.png', x: 50, y: 15, w: 46 }
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

  function render(p) {
    var narrow = stageW < 760;
    // timeline (p goes 0 → 1 over the whole story):
    //   0    – 0.10  password 1-4-2-5 typed on the door's display
    //   0.10 – 0.16  dial turns, door unlatches
    //   0.16 – 0.23  door swings open, light pours out
    //   0.21 – 0.31  camera flies into the vault
    //   0.30 – 0.42  shirt arrives, then: 0.5 look 1 · 0.667 look 2 · 0.833 look 3 · 1 look 4
    var typed = [0.025, 0.045, 0.065, 0.085].filter(function (t) { return p >= t; }).length;
    var accepted = p >= 0.095;
    cells.forEach(function (c, i) {
      c.firstChild.textContent = i < typed ? CODE[i] : '';
      c.classList.toggle('on', i < typed);
      c.classList.toggle('ok', accepted);
    });
    vlabel.textContent = accepted ? 'LIBERADO' : (typed ? 'DIGITANDO' : 'TRAVADO');
    vlabel.classList.toggle('ok', accepted);

    var dial = ease(smooth(0.1, 0.155, p)) * 450;
    var pop = smooth(0.15, 0.165, p);
    var open = ease(smooth(0.165, 0.235, p));
    var dive = smooth(0.205, 0.31, p);
    var diveE = dive * dive * (1.6 - 0.6 * dive);

    vplate.style.transform = 'rotate(' + dial.toFixed(1) + 'deg)';
    vdoor.style.transform = 'translateZ(' + (pop * 26).toFixed(1) + 'px) rotateY(' + (-108 * open).toFixed(2) + 'deg)';
    vlight.style.opacity = (Math.max(pop * 0.35, open) * (1 - 0.85 * dive)).toFixed(3);
    vrays.style.opacity = (open * (1 - dive)).toFixed(3);
    vrays.style.transform = 'rotate(' + (p * 120).toFixed(1) + 'deg)';
    var zoom = 1 + diveE * 11;
    vscene.style.transform = 'scale(' + zoom.toFixed(3) + ')';
    vbg.style.transform = 'scale(' + (1 + diveE * 0.6).toFixed(3) + ')';
    var sceneOut = smooth(0.285, 0.33, p);
    vscene.style.opacity = vbg.style.opacity = vshade.style.opacity = (1 - sceneOut).toFixed(3);
    vscene.style.visibility = sceneOut >= 1 ? 'hidden' : 'visible';
    vbg.style.visibility = vscene.style.visibility;

    var introOut = smooth(0.012, 0.05, p);
    intro.style.opacity = (1 - introOut).toFixed(3);
    intro.style.transform = 'translateY(' + (-24 * introOut).toFixed(1) + 'px)';
    cap1.style.opacity = (smooth(0.095, 0.11, p) * (1 - smooth(0.15, 0.165, p))).toFixed(3);
    cap2.style.opacity = (smooth(0.2, 0.215, p) * (1 - smooth(0.27, 0.29, p))).toFixed(3);

    // ---- shirt path: [p, left %, turn in degrees] (holds where a look rests)
    var X = narrow ? [50, 50, 50, 50, 50] : [50, 64, 31, 67, 31];
    var K = [
      [0.33, X[0], 0],
      [0.42, X[1], 0], [0.52, X[1], 0],      // look 1 · front
      [0.61, X[2], 180], [0.69, X[2], 180],  // look 2 · back
      [0.78, X[3], 360], [0.86, X[3], 360],  // look 3 · front
      [0.96, X[4], 540]                      // look 4 · back
    ];
    var restTop = narrow ? 36 : 52;
    var arrive = ease(smooth(0.29, 0.33, p));
    var left = X[0], top = 50, ry, tilt = 0, sway = 0;
    if (p < K[0][0]) { ry = lerp(-360, 0, arrive); }
    else {
      left = K[K.length - 1][1]; ry = K[K.length - 1][2]; top = restTop;
      for (var k = 0; k < K.length - 1; k++) {
        if (p < K[k + 1][0]) {
          var t = ease((p - K[k][0]) / (K[k + 1][0] - K[k][0]));
          left = lerp(K[k][1], K[k + 1][1], t);
          ry = lerp(K[k][2], K[k + 1][2], t);
          top = k === 0 ? lerp(50, restTop, t) : restTop;
          var dir = K[k + 1][1] < K[k][1] ? -1 : 1;
          tilt = Math.sin(t * Math.PI) * 6 * dir;
          sway = Math.sin(t * Math.PI) * 0.1;
          break;
        }
      }
    }

    // which look is showing: colour switches while the shirt is edge-on (90°, 270°, 450°)
    var r = Math.max(0, ry);
    var look = r < 90 ? 0 : r < 270 ? 1 : r < 450 ? 2 : 3;
    var pal = PALETTES[LOOKS[look].color];

    var shirtOn = smooth(0.29, 0.32, p);
    glCanvas.style.opacity = shirtOn.toFixed(3);
    if (has3D && shirtOn > 0) {
      // while it arrives spinning, the back stays plain so the first look reads clean
      var backLook = p < K[0][0] ? BLANK : LOOKS[r < 360 ? 1 : 3];
      window.Shirt3D.setLook(LOOKS[r < 180 ? 0 : 2], backLook, pal);
      var VH = window.Shirt3D.VIEW_H, VW = VH * stageW / stageH;
      var s = Math.min(VH * (narrow ? 0.27 : 0.31), VW * 0.4);
      window.Shirt3D.draw({
        x: (left / 100 - 0.5) * VW,
        y: -(top / 100 - 0.5) * VH,
        z: lerp(-26, 0, arrive),
        rx: 0.08 + sway * 0.4,
        ry: ry * Math.PI / 180,
        rz: tilt * Math.PI / 180,
        s: s
      });
      // floor shadow under the shirt
      var px = left / 100 * stageW, py = (top / 100) * stageH + s / VH * stageH * 1.18;
      var sw = s / VH * stageH * 1.5 * (0.55 + 0.45 * Math.abs(Math.cos(ry * Math.PI / 180)));
      shadow.style.width = sw.toFixed(0) + 'px';
      shadow.style.transform = 'translate(' + (px - sw / 2).toFixed(1) + 'px,' + (py - 15).toFixed(1) + 'px)';
      shadow.style.left = shadow.style.top = '0';
      shadow.style.opacity = (smooth(0.36, 0.44, p) * 0.9).toFixed(3);
    } else {
      shadow.style.opacity = '0';
    }
  }

  // ---------- scroll loop ----------
  var ticking = false, last = -1;
  function progress() {
    var r = story.getBoundingClientRect();
    var span = Math.max(1, r.height - stage.offsetHeight);
    return clamp(-r.top / span);
  }
  function update(force) {
    ticking = false;
    var p = progress();
    if (!force && Math.abs(p - last) < 0.0003) return;
    last = p;
    render(p);
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(function () { update(false); }); }
  }
  if (has3D) window.Shirt3D.onChange = function () { update(true); };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { layout(); update(true); });
  layout();
  update(true);
})();
