/* A Banca — camiseta 3D em WebGL puro (sem bibliotecas).
 *
 * Modelo procedural de uma camiseta oversized "vestida" num manequim
 * invisível: tronco com caimento, mangas com barra dobrada, gola
 * canelada, barra inferior e o lado de dentro visível pelas aberturas.
 * Dobras de tecido por ruído, trama da malha e brilho de tecido no shader.
 * As estampas são pintadas numa textura que envolve o tronco:
 * frente centrada em u = 0.25, costas em u = 0.75.
 *
 * API: Shirt3D.init(canvas) → bool
 *      Shirt3D.setLook(frontLook, backLook, palette)
 *      Shirt3D.draw({ x, y, z, rx, ry, rz, s })   (unidades de mundo)
 *      Shirt3D.resize(w, h)
 *      Shirt3D.VIEW_H  (altura visível em z = 0)
 *      Shirt3D.HEIGHT  (altura da camiseta com s = 1)
 */
(function () {
  'use strict';

  var CAM_Z = 8, FOV = 30 * Math.PI / 180;
  var VIEW_H = 2 * CAM_Z * Math.tan(FOV / 2);
  var TEX_W = 2048, TEX_H = 1024;

  // ---------- garment dimensions (shirt units) ----------
  var A = 0.88;          // torso half-width
  var HEM_Y = -1.42;     // hem height
  var SHOULDER_Y = 0.64; // top of the torso at the side seam
  var NECK = { a: 0.29, b: 0.25, z: -0.05, yFront: 0.80, yBack: 0.88 };
  var SLEEVE = { root: [0.62, 0.40, 0.0], dir: [0.6, -0.8, 0], len: 0.76, r0: 0.35, r1: 0.27 };
  var NA = 176;          // samples around the torso
  var PERIM = 1;         // torso perimeter (computed)

  var gl, prog, loc = {}, mesh = null, tex = null, texCanvas = null, aspect = 1, ok = false;

  // ---------- math helpers ----------
  function mul(a, b) {
    var o = new Float32Array(16);
    for (var c = 0; c < 4; c++) for (var r = 0; r < 4; r++) {
      o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
    }
    return o;
  }
  function ident() { return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]); }
  function persp(fov, asp, n, f) {
    var t = 1 / Math.tan(fov / 2), m = new Float32Array(16);
    m[0] = t / asp; m[5] = t; m[10] = (f + n) / (n - f); m[11] = -1; m[14] = 2 * f * n / (n - f);
    return m;
  }
  function trans(x, y, z) { var m = ident(); m[12] = x; m[13] = y; m[14] = z; return m; }
  function rotX(a) { var c = Math.cos(a), s = Math.sin(a), m = ident(); m[5] = c; m[6] = s; m[9] = -s; m[10] = c; return m; }
  function rotY(a) { var c = Math.cos(a), s = Math.sin(a), m = ident(); m[0] = c; m[2] = -s; m[8] = s; m[10] = c; return m; }
  function rotZ(a) { var c = Math.cos(a), s = Math.sin(a), m = ident(); m[0] = c; m[1] = s; m[4] = -s; m[5] = c; return m; }
  function scale(s) { var m = ident(); m[0] = m[5] = m[10] = s; return m; }
  function mat3of(m) { return new Float32Array([m[0], m[1], m[2], m[4], m[5], m[6], m[8], m[9], m[10]]); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function sstep(a, b, x) { var t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); }

  // smooth 3D value noise
  function hash(x, y, z) { var h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return h - Math.floor(h); }
  function noise(x, y, z) {
    var xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
    var xf = x - xi, yf = y - yi, zf = z - zi;
    var u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
    function c(i, j, k) { return hash(xi + i, yi + j, zi + k); }
    return lerp(lerp(lerp(c(0, 0, 0), c(1, 0, 0), u), lerp(c(0, 1, 0), c(1, 1, 0), u), v),
                lerp(lerp(c(0, 0, 1), c(1, 0, 1), u), lerp(c(0, 1, 1), c(1, 1, 1), u), v), w) * 2 - 1;
  }

  // ---------- torso cross-section ----------
  function depthAt(t) { return 0.47 + 0.07 * Math.sin(t * Math.PI * 0.85) - 0.1 * sstep(0.8, 1, t); }
  function sePoint(phi, a, b) {
    var c = Math.cos(phi), s = Math.sin(phi), e = 2 / 2.25;
    return [a * Math.sign(c) * Math.pow(Math.abs(c), e), b * Math.sign(s) * Math.pow(Math.abs(s), e)];
  }
  // equal-arc-length angles; u = 0 left side, 0.25 front centre, 0.5 right side, 0.75 back centre
  var PHI = [];
  function buildArcTable() {
    var M = 4000, pts = [], L = [0];
    for (var i = 0; i <= M; i++) {
      var phi = Math.PI - 2 * Math.PI * i / M;
      pts.push([phi, sePoint(phi, A, 0.46)]);
      if (i) { var p = pts[i][1], q = pts[i - 1][1]; L.push(L[i - 1] + Math.hypot(p[0] - q[0], p[1] - q[1])); }
    }
    PERIM = L[M];
    var j = 0;
    for (var k = 0; k <= NA; k++) {
      var target = PERIM * k / NA;
      while (j < M - 1 && L[j + 1] < target) j++;
      var f = (target - L[j]) / Math.max(1e-9, L[j + 1] - L[j]);
      PHI.push(lerp(pts[j][0], pts[j + 1][0], clamp01(f)));
    }
  }
  function torsoTopY(x) { var k = Math.abs(x) / A; return SHOULDER_Y + 0.19 * (1 - Math.pow(k, 1.6)); }
  function neckPoint(phi) {
    var p = sePoint(phi, NECK.a, NECK.b);
    var front = Math.max(0, Math.sin(phi));
    var y = lerp(NECK.yBack, NECK.yFront, Math.pow(front, 1.4));
    return [p[0], y, p[1] + NECK.z];
  }

  // ---------- mesh building ----------
  function Builder() { this.pos = []; this.uv = []; this.ao = []; this.idx = []; this.n = 0; }
  Builder.prototype.grid = function (cols, rows, fn) {
    var start = this.n;
    for (var r = 0; r <= rows; r++) for (var c = 0; c <= cols; c++) {
      var v = fn(c / cols, r / rows);
      this.pos.push(v.p[0], v.p[1], v.p[2]); this.uv.push(v.uv[0], v.uv[1]); this.ao.push(v.ao == null ? 1 : v.ao);
      this.n++;
    }
    var W = cols + 1, first = this.idx.length;
    for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) {
      var a = start + r * W + c, b = a + 1, d = a + W, e = d + 1;
      this.idx.push(a, b, d, b, e, d);
    }
    return { first: first, last: this.idx.length, start: start, end: this.n, cols: cols, rows: rows };
  };
  // make a part's triangles face away from a reference point (so the outside is the front face)
  Builder.prototype.orient = function (part, centreFn) {
    var P = this.pos, I = this.idx, score = 0;
    for (var i = part.first; i < part.last; i += 3) {
      var a = I[i] * 3, b = I[i + 1] * 3, c = I[i + 2] * 3;
      var ux = P[b] - P[a], uy = P[b + 1] - P[a + 1], uz = P[b + 2] - P[a + 2];
      var vx = P[c] - P[a], vy = P[c + 1] - P[a + 1], vz = P[c + 2] - P[a + 2];
      var nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      var cx = centreFn(P[a], P[a + 1], P[a + 2]);
      score += nx * (P[a] - cx[0]) + ny * (P[a + 1] - cx[1]) + nz * (P[a + 2] - cx[2]);
    }
    if (score < 0) for (i = part.first; i < part.last; i += 3) { var t = I[i + 1]; I[i + 1] = I[i + 2]; I[i + 2] = t; }
  };
  Builder.prototype.normals = function () {
    var P = this.pos, I = this.idx, N = new Float32Array(P.length);
    for (var i = 0; i < I.length; i += 3) {
      var a = I[i] * 3, b = I[i + 1] * 3, c = I[i + 2] * 3;
      var ux = P[b] - P[a], uy = P[b + 1] - P[a + 1], uz = P[b + 2] - P[a + 2];
      var vx = P[c] - P[a], vy = P[c + 1] - P[a + 1], vz = P[c + 2] - P[a + 2];
      var nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      N[a] += nx; N[a + 1] += ny; N[a + 2] += nz; N[b] += nx; N[b + 1] += ny; N[b + 2] += nz; N[c] += nx; N[c + 1] += ny; N[c + 2] += nz;
    }
    for (i = 0; i < N.length; i += 3) { var l = Math.hypot(N[i], N[i + 1], N[i + 2]) || 1; N[i] /= l; N[i + 1] /= l; N[i + 2] /= l; }
    return N;
  };
  // wrapped grids: average the normals of the duplicated first/last column
  function weldSeam(N, part) {
    var W = part.cols + 1;
    for (var r = 0; r <= part.rows; r++) {
      var a = (part.start + r * W) * 3, b = (part.start + r * W + part.cols) * 3;
      for (var k = 0; k < 3; k++) { var m = (N[a + k] + N[b + k]) / 2; N[a + k] = N[b + k] = m; }
    }
  }

  var PLAIN = [0.5, 0.035]; // texture spot with plain fabric
  function torsoV(t) { return (100 + (1 - t) * 900) / TEX_H; }

  function buildGarment() {
    buildArcTable();
    var B = new Builder(), parts = {}, wrapped = [];
    var TR = 64;
    var phiAt = function (cu) { return PHI[Math.round(cu * NA)]; };

    // torso: hem up to the shoulder line
    parts.torso = B.grid(NA, TR, function (cu, t) {
      var phi = phiAt(cu);
      var flare = 1 + 0.02 * (1 - t);
      var p = sePoint(phi, A * flare, depthAt(t) * flare);
      var y = lerp(HEM_Y, torsoTopY(p[0]), t);
      var side = Math.abs(Math.cos(phi));
      var pinch = 1 - 0.03 * Math.exp(-Math.pow((t - 0.78) / 0.1, 2)) * side;
      var hemRoll = t < 0.025 ? 1 + 0.012 * (1 - t / 0.025) : 1;
      var ao = 1 - 0.3 * Math.exp(-Math.pow((t - 0.74) / 0.12, 2)) * Math.pow(side, 6);
      return { p: [p[0] * pinch * hemRoll, y, p[1] * pinch * hemRoll], uv: [cu, torsoV(t)], ao: ao };
    });
    wrapped.push(parts.torso);
    // folded hem lip, turning inward
    parts.hemIn = B.grid(NA, 3, function (cu, rv) {
      var p = sePoint(phiAt(cu), A * 1.02, depthAt(0) * 1.02);
      var k = 1 - 0.02 * rv;
      return { p: [p[0] * k, HEM_Y + 0.016 * rv, p[1] * k], uv: PLAIN, ao: 0.55 };
    });
    wrapped.push(parts.hemIn);
    // shoulders / yoke: top of the torso to the neckline
    var CR = 18;
    parts.cap = B.grid(NA, CR, function (cu, s) {
      var phi = phiAt(cu);
      var p = sePoint(phi, A, depthAt(1));
      var top = [p[0], torsoTopY(p[0]), p[1]];
      var nk = neckPoint(phi);
      var x = lerp(top[0], nk[0], s), z = lerp(top[2], nk[2], s);
      var y = lerp(top[1], nk[1], Math.pow(s, 0.85)) + 0.05 * Math.sin(Math.PI * s) * (1 - 0.6 * Math.abs(Math.sin(phi)));
      return { p: [x, y, z], uv: [cu, Math.max(0.02, torsoV(1) - 0.06 * s)], ao: 1 };
    });
    wrapped.push(parts.cap);
    // ribbed collar: a soft tube around the neckline
    parts.rib = B.grid(NA, 12, function (cu, rv) {
      var phi = phiAt(cu), c = neckPoint(phi);
      var ang = rv * Math.PI * 2;
      var dx = c[0], dz = c[2] - NECK.z, rad = Math.hypot(dx, dz) || 1;
      var ox = dx / rad, oz = dz / rad;
      return { p: [c[0] + ox * Math.cos(ang) * 0.026, c[1] + Math.sin(ang) * 0.03 + 0.01, c[2] + oz * Math.cos(ang) * 0.026], uv: PLAIN, ao: 0.92 };
    });
    wrapped.push(parts.rib);
    // inside of the back collar, seen through the neck opening
    parts.neckIn = B.grid(NA, 4, function (cu, rv) {
      var c = neckPoint(phiAt(cu)), k = 1 - 0.05 * rv;
      return { p: [c[0] * k, c[1] - 0.1 * rv, (c[2] - NECK.z) * k + NECK.z], uv: PLAIN, ao: 0.5 };
    });
    wrapped.push(parts.neckIn);

    // sleeves
    var SA = 64, SL = 26, sleeves = [];
    [1, -1].forEach(function (side) {
      var r0 = [SLEEVE.root[0] * side, SLEEVE.root[1], SLEEVE.root[2]];
      var d = [SLEEVE.dir[0] * side, SLEEVE.dir[1], 0], dl = Math.hypot(d[0], d[1]); d = [d[0] / dl, d[1] / dl, 0];
      var e1 = [0, 0, 1];
      var e2 = [d[1] * e1[2] - d[2] * e1[1], d[2] * e1[0] - d[0] * e1[2], d[0] * e1[1] - d[1] * e1[0]];
      if (e2[1] < 0) e2 = [-e2[0], -e2[1], -e2[2]];
      function ringPoint(s, rScale, along, cu) {
        var ang = cu * Math.PI * 2;
        var r = lerp(SLEEVE.r0, SLEEVE.r1, s) * rScale;
        var flat = 0.86;
        var L = SLEEVE.len * along;
        var under = Math.max(0, -Math.cos(ang));
        return [
          r0[0] + d[0] * L + (Math.cos(ang) * e2[0] + Math.sin(ang) * e1[0] * flat) * r,
          r0[1] + d[1] * L + (Math.cos(ang) * e2[1] + Math.sin(ang) * e1[1] * flat) * r - 0.035 * s * s - 0.025 * under * s,
          r0[2] + d[2] * L + (Math.cos(ang) * e2[2] + Math.sin(ang) * e1[2] * flat) * r
        ];
      }
      var axisCentre = function (x, y, z) {
        var t = (x - r0[0]) * d[0] + (y - r0[1]) * d[1] + (z - r0[2]) * d[2];
        return [r0[0] + d[0] * t, r0[1] + d[1] * t, r0[2] + d[2] * t];
      };
      var sl = B.grid(SA, SL, function (cu, s) {
        var cuff = 1 + 0.05 * sstep(0.86, 0.93, s);
        return { p: ringPoint(s, cuff, s, cu), uv: PLAIN, ao: 0.74 + 0.26 * sstep(0.0, 0.35, s) };
      });
      B.orient(sl, axisCentre);
      var lip = B.grid(SA, 3, function (cu, rv) {
        return { p: ringPoint(1, 1.05 - 0.09 * rv, 1 - 0.035 * rv, cu), uv: PLAIN, ao: 0.6 };
      });
      B.orient(lip, axisCentre);
      sleeves.push(sl); wrapped.push(sl, lip);
    });

    var axis = function (x, y, z) { return [0, y, NECK.z * 0.5]; };
    B.orient(parts.torso, axis);
    B.orient(parts.hemIn, axis);
    B.orient(parts.cap, function (x, y, z) { return [0, y - 0.6, 0]; });
    B.orient(parts.rib, function (x, y, z) {
      var phi = Math.atan2((z - NECK.z) / NECK.b, x / NECK.a), c = neckPoint(phi);
      return [c[0], c[1], c[2]];
    });
    B.orient(parts.neckIn, function (x, y, z) { return [0, y, NECK.z]; });

    // fabric folds: push along the normal with soft noise
    var N = B.normals();
    wrapped.forEach(function (p) { weldSeam(N, p); });
    var P = B.pos;
    function displace(part, amp) {
      for (var i = part.start; i < part.end; i++) {
        var x = P[i * 3], y = P[i * 3 + 1], z = P[i * 3 + 2];
        var f = 0;
        f += 0.55 * noise(x * 2.2, y * 1.1, z * 2.2);
        f += 0.25 * noise(x * 5.0 + 3, y * 2.4, z * 5.0);
        f += 0.45 * Math.sin(Math.atan2(z, x) * 7 + noise(x * 1.5, y * 0.6, z * 1.5) * 4) * sstep(0.1, -1.3, y);   // vertical drape folds
        f += 0.35 * Math.sin(x * 9 + y * 6 + noise(x, y, z) * 2) * Math.exp(-Math.pow((y - 0.15) / 0.3, 2)) * Math.pow(Math.abs(x) / A, 4);
        f += 0.3 * Math.sin(x * 11 + noise(x * 2, 0, z) * 3) * sstep(-0.8, -1.35, y);
        var k = amp * f;
        P[i * 3] += N[i * 3] * k; P[i * 3 + 1] += N[i * 3 + 1] * k; P[i * 3 + 2] += N[i * 3 + 2] * k;
      }
    }
    displace(parts.torso, 0.032);
    displace(parts.cap, 0.010);
    sleeves.forEach(function (s) { displace(s, 0.02); });
    N = B.normals();
    wrapped.forEach(function (p) { weldSeam(N, p); });

    return { pos: new Float32Array(B.pos), nor: N, uv: new Float32Array(B.uv), ao: new Float32Array(B.ao), idx: new Uint16Array(B.idx) };
  }

  // ---------- shaders ----------
  var VS = [
    'attribute vec3 aPos; attribute vec3 aNor; attribute vec2 aUv; attribute float aAo;',
    'uniform mat4 uModel; uniform mat4 uVP; uniform mat3 uNM;',
    'varying vec3 vN; varying vec2 vUv; varying vec3 vW; varying float vAo; varying vec3 vL;',
    'void main(){ vec4 w = uModel * vec4(aPos, 1.0); vW = w.xyz; vN = uNM * aNor; vUv = aUv; vAo = aAo; vL = aPos; gl_Position = uVP * w; }'
  ].join('\n');
  var FS = [
    'precision mediump float;',
    'uniform sampler2D uTex; uniform vec3 uCam; uniform float uDark;',
    'varying vec3 vN; varying vec2 vUv; varying vec3 vW; varying float vAo; varying vec3 vL;',
    'void main(){',
    '  vec3 base = pow(texture2D(uTex, vUv).rgb, vec3(2.2));',
    '  vec3 n = normalize(vN);',
    '  float inside = 0.0;',
    '  if (!gl_FrontFacing) { n = -n; inside = 1.0; }',
    '  vec3 v = normalize(uCam - vW);',
    '  float knit = 0.5 + 0.5 * sin(vL.x * 520.0 + sin(vL.y * 900.0) * 0.6) * sin(vL.y * 380.0);',
    '  base *= 1.0 - 0.045 * knit;',
    '  vec3 L1 = normalize(vec3(-0.6, 0.75, 0.9));',
    '  vec3 L2 = normalize(vec3(0.85, 0.1, 0.5));',
    '  vec3 L3 = normalize(vec3(0.4, 0.6, -0.9));',
    '  float w = 0.3;',
    '  float d1 = max((dot(n, L1) + w) / (1.0 + w), 0.0);',
    '  float d2 = max((dot(n, L2) + w) / (1.0 + w), 0.0);',
    '  float d3 = pow(max(dot(n, L3), 0.0), 1.5);',
    '  float nv = max(dot(n, v), 0.0);',
    '  float sheen = pow(1.0 - nv, 4.0);',
    '  float spec = pow(max(dot(n, normalize(L1 + v)), 0.0), 24.0);',
    '  float ao = vAo * mix(1.0, 0.82, pow(1.0 - nv, 2.0));',
    '  vec3 amb = mix(vec3(0.13, 0.125, 0.12), vec3(0.30, 0.29, 0.28), uDark);',
    '  vec3 col = base * (amb + vec3(1.0, 0.93, 0.84) * d1 * 1.05 + vec3(0.42, 0.46, 0.54) * d2 * 0.45) * ao;',
    '  col += vec3(1.0, 0.86, 0.70) * d3 * mix(0.10, 0.22, uDark);',
    '  col += mix(base, vec3(1.0), 0.5) * sheen * mix(0.22, 0.35, uDark);',
    '  col += vec3(1.0) * spec * mix(0.025, 0.05, uDark);',
    '  col *= mix(1.0, 0.38, inside);',
    '  col = col / (col + vec3(0.9)) * 1.75;',
    '  gl_FragColor = vec4(pow(col, vec3(1.0 / 2.2)), 1.0);',
    '}'
  ].join('\n');

  function compile(type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }

  // ---------- texture ----------
  var imgCache = {};
  function getImg(src, cb) {
    if (!src) return null;
    if (imgCache[src]) return imgCache[src].complete && imgCache[src].naturalWidth ? imgCache[src] : null;
    var im = new Image(); im.onload = cb; im.src = src; imgCache[src] = im; return null;
  }
  function pxPerUnitU() { return TEX_W / PERIM; }
  var pxPerUnitV = 900 / (SHOULDER_Y + 0.19 - HEM_Y);

  function drawPrint(x, look, centreU, onload) {
    var im = getImg(look && look.src, onload);
    if (!im) return;
    var widthUnits = look.w / 100 * (2 * A);
    var wpx = widthUnits * pxPerUnitU();
    var hpx = widthUnits * (im.naturalHeight / im.naturalWidth) * pxPerUnitV;
    var topPx = 100 + (look.y / 100) * 900;
    x.drawImage(im, centreU * TEX_W - wpx / 2, topPx, wpx, hpx);
  }

  var state = { front: null, back: null, pal: null, key: '' };

  function paint(front, back, pal) {
    var x = texCanvas.getContext('2d');
    x.fillStyle = pal.fab; x.fillRect(0, 0, TEX_W, TEX_H);
    x.strokeStyle = pal.seam; x.lineWidth = 3;
    x.beginPath(); x.moveTo(1, 100); x.lineTo(1, TEX_H); x.moveTo(TEX_W / 2, 100); x.lineTo(TEX_W / 2, TEX_H); x.stroke();
    x.lineWidth = 2;
    x.beginPath(); x.moveTo(0, 100 + 900 - 26); x.lineTo(TEX_W, 100 + 900 - 26); x.stroke();
    var redraw = function () { state.key = ''; api.setLook(state.front, state.back, state.pal); if (api.onChange) api.onChange(); };
    drawPrint(x, front, 0.25, redraw);
    drawPrint(x, back, 0.75, redraw);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texCanvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  var api = {
    VIEW_H: VIEW_H,
    HEIGHT: (NECK.yBack + 0.05) - HEM_Y,
    CENTER_Y: ((NECK.yBack + 0.05) + HEM_Y) / 2,
    onChange: null,
    init: function (canvas) {
      try {
        gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: true });
        if (!gl) return false;
        prog = gl.createProgram();
        gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
        gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
        gl.useProgram(prog);
        ['aPos', 'aNor', 'aUv', 'aAo'].forEach(function (n) { loc[n] = gl.getAttribLocation(prog, n); });
        ['uModel', 'uVP', 'uNM', 'uTex', 'uCam', 'uDark'].forEach(function (n) { loc[n] = gl.getUniformLocation(prog, n); });
        var g = buildGarment();
        var buf = function (data, target) { var b = gl.createBuffer(); gl.bindBuffer(target, b); gl.bufferData(target, data, gl.STATIC_DRAW); return b; };
        mesh = {
          pos: buf(g.pos, gl.ARRAY_BUFFER), nor: buf(g.nor, gl.ARRAY_BUFFER), uv: buf(g.uv, gl.ARRAY_BUFFER), ao: buf(g.ao, gl.ARRAY_BUFFER),
          idx: buf(g.idx, gl.ELEMENT_ARRAY_BUFFER), count: g.idx.length
        };
        tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([200, 200, 200, 255]));
        texCanvas = document.createElement('canvas'); texCanvas.width = TEX_W; texCanvas.height = TEX_H;
        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(0, 0, 0, 0);
        ok = true;
        return true;
      } catch (e) {
        if (window.console) console.warn('Shirt3D off:', e);
        ok = false;
        return false;
      }
    },
    resize: function (w, h) {
      if (!ok) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      gl.canvas.width = Math.round(w * dpr); gl.canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      aspect = w / Math.max(1, h);
    },
    setLook: function (front, back, pal) {
      if (!ok) return;
      var ld = function (l) { return !l || !l.src || (imgCache[l.src] && imgCache[l.src].naturalWidth) ? 1 : 0; };
      var key = (front && front.src) + '|' + (back && back.src) + '|' + pal.fab + '|' + ld(front) + ld(back);
      state.front = front; state.back = back; state.pal = pal;
      if (key === state.key) return;
      state.key = key;
      paint(front, back, pal);
    },
    draw: function (o) {
      if (!ok) return;
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      var P = persp(FOV, aspect, 0.1, 100), V = trans(0, 0, -CAM_Z);
      var R = mul(rotZ(o.rz || 0), mul(rotY(o.ry || 0), rotX(o.rx || 0)));
      var M = mul(trans(o.x, o.y, o.z), mul(R, mul(scale(o.s), trans(0, -api.CENTER_Y, 0))));
      gl.uniformMatrix4fv(loc.uVP, false, mul(P, V));
      gl.uniformMatrix4fv(loc.uModel, false, M);
      gl.uniformMatrix3fv(loc.uNM, false, mat3of(R));
      gl.uniform3f(loc.uCam, 0, 0, CAM_Z);
      gl.uniform1f(loc.uDark, state.pal && state.pal.dark ? 1 : 0);
      gl.uniform1i(loc.uTex, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.pos); gl.enableVertexAttribArray(loc.aPos); gl.vertexAttribPointer(loc.aPos, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.nor); gl.enableVertexAttribArray(loc.aNor); gl.vertexAttribPointer(loc.aNor, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.uv); gl.enableVertexAttribArray(loc.aUv); gl.vertexAttribPointer(loc.aUv, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.ao); gl.enableVertexAttribArray(loc.aAo); gl.vertexAttribPointer(loc.aAo, 1, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.idx);
      gl.drawElements(gl.TRIANGLES, mesh.count, gl.UNSIGNED_SHORT, 0);
    }
  };

  window.Shirt3D = api;
})();
