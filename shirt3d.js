/* A Banca — camiseta 3D em WebGL puro (sem bibliotecas).
 *
 * A camiseta é uma malha "inflada" a partir da silhueta: frente e costas
 * são duas superfícies que se encontram na borda, com volume maior no
 * tronco e menor nas mangas. As estampas são desenhadas numa textura de
 * tecido para cada lado.
 *
 * API: Shirt3D.init(canvas) → bool
 *      Shirt3D.setLook(frontLook, backLook, palette)
 *      Shirt3D.draw({ x, y, z, rx, ry, rz, s })   (unidades de mundo)
 *      Shirt3D.resize(w, h)
 *      Shirt3D.VIEW_H  (altura visível em z = 0)
 */
(function () {
  'use strict';

  // Oversized tee silhouette in a 200 × 212 box (drop shoulders, boxy body).
  var SHAPE = 'M72 10 Q100 19 128 10 L163 21 Q184 40 199 72 L175 113 L152 101 L153 204 Q100 210 47 204 L48 101 L25 113 L1 72 Q16 40 37 21 Z';
  var SW = 200, SH = 212;
  var GW = 161, GH = 171;              // mesh grid
  var TEX_W = 1024, TEX_H = Math.round(1024 * SH / SW);
  var CAM_Z = 8, FOV = 30 * Math.PI / 180;
  var VIEW_H = 2 * CAM_Z * Math.tan(FOV / 2);

  var gl, prog, loc = {}, sides = [], texCanvas = [], aspect = 1, ok = false;
  var shapePath;

  // ---------- tiny matrix helpers (column-major) ----------
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

  // ---------- geometry ----------
  function buildHeights() {
    var c = document.createElement('canvas');
    c.width = GW; c.height = GH;
    var x = c.getContext('2d');
    x.scale((GW - 1) / SW, (GH - 1) / SH);
    x.fill(shapePath);
    var a = x.getImageData(0, 0, GW, GH).data;
    var N = GW * GH, inside = new Uint8Array(N), d = new Float32Array(N);
    for (var i = 0; i < N; i++) { inside[i] = a[i * 4 + 3] > 127 ? 1 : 0; d[i] = inside[i] ? 1e9 : 0; }
    // chamfer distance transform (3-4)
    var W = GW, H = GH, k;
    for (var y = 0; y < H; y++) for (var xx = 0; xx < W; xx++) {
      k = y * W + xx; if (!d[k]) continue;
      if (xx > 0) d[k] = Math.min(d[k], d[k - 1] + 3);
      if (y > 0) {
        d[k] = Math.min(d[k], d[k - W] + 3);
        if (xx > 0) d[k] = Math.min(d[k], d[k - W - 1] + 4);
        if (xx < W - 1) d[k] = Math.min(d[k], d[k - W + 1] + 4);
      }
    }
    for (y = H - 1; y >= 0; y--) for (xx = W - 1; xx >= 0; xx--) {
      k = y * W + xx; if (!d[k]) continue;
      if (xx < W - 1) d[k] = Math.min(d[k], d[k + 1] + 3);
      if (y < H - 1) {
        d[k] = Math.min(d[k], d[k + W] + 3);
        if (xx < W - 1) d[k] = Math.min(d[k], d[k + W + 1] + 4);
        if (xx > 0) d[k] = Math.min(d[k], d[k + W - 1] + 4);
      }
    }
    var unit = (SW / (GW - 1)) / 100 / 3; // chamfer step → mesh units (shirt half-width = 1)
    var h = new Float32Array(N);
    var T = 0.24, D = 0.5;
    for (y = 0; y < H; y++) for (xx = 0; xx < W; xx++) {
      k = y * W + xx;
      var t = Math.min(1, d[k] * unit / D);
      var mx = (xx / (W - 1)) * 2 - 1, my = 1.06 - (y / (H - 1)) * 2.12;
      var base = T * Math.sqrt(t) * (2 - t) / 1.0;
      // soft folds: under the arms, at the waist and a hem ripple
      var fold = 0;
      fold += 0.018 * Math.exp(-((Math.abs(mx) - 0.5) * (Math.abs(mx) - 0.5) + (my - 0.15) * (my - 0.15)) / 0.05) * Math.sin(26 * (Math.abs(mx) * 0.8 - my));
      fold += 0.010 * Math.sin(9 * mx + 2.1) * Math.exp(-(my + 0.95) * (my + 0.95) / 0.02);
      fold += 0.008 * Math.sin(14 * my + 5 * mx) * t;
      h[k] = inside[k] ? base + fold * t : 0;
    }
    // light blur so the surface is smooth
    var h2 = new Float32Array(N);
    for (var pass = 0; pass < 2; pass++) {
      for (y = 0; y < H; y++) for (xx = 0; xx < W; xx++) {
        k = y * W + xx;
        if (!inside[k]) { h2[k] = 0; continue; }
        var s = 0, n = 0;
        for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
          var yy = y + dy, x2 = xx + dx;
          if (yy < 0 || yy >= H || x2 < 0 || x2 >= W) continue;
          s += h[yy * W + x2]; n++;
        }
        h2[k] = s / n;
      }
      h.set(h2);
    }
    return { h: h, inside: inside };
  }

  function buildSide(geo, back) {
    var W = GW, H = GH, N = W * H;
    var pos = new Float32Array(N * 3), nor = new Float32Array(N * 3), uv = new Float32Array(N * 2);
    var dxu = 2 / (W - 1), dyu = 2.12 / (H - 1), sgn = back ? -1 : 1;
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
      var k = y * W + x;
      var mx = (x / (W - 1)) * 2 - 1, my = 1.06 - (y / (H - 1)) * 2.12;
      var hh = geo.h[k];
      pos[k * 3] = mx; pos[k * 3 + 1] = my; pos[k * 3 + 2] = sgn * hh;
      var hl = geo.h[y * W + Math.max(0, x - 1)], hr = geo.h[y * W + Math.min(W - 1, x + 1)];
      var hu = geo.h[Math.max(0, y - 1) * W + x], hd = geo.h[Math.min(H - 1, y + 1) * W + x];
      var gx = (hr - hl) / (2 * dxu), gy = (hu - hd) / (2 * dyu); // d/dmx, d/dmy (my grows upward)
      var nx = -gx, ny = -gy, nz = sgn, l = Math.sqrt(nx * nx + ny * ny + nz * nz);
      nor[k * 3] = nx / l; nor[k * 3 + 1] = ny / l; nor[k * 3 + 2] = nz / l;
      uv[k * 2] = back ? 1 - x / (W - 1) : x / (W - 1);
      uv[k * 2 + 1] = y / (H - 1);
    }
    var idx = [];
    for (y = 0; y < H - 1; y++) for (x = 0; x < W - 1; x++) {
      var a = y * W + x, b = a + 1, c = a + W, e = c + 1;
      if (geo.inside[a] || geo.inside[b] || geo.inside[c] || geo.inside[e]) idx.push(a, c, b, b, c, e);
    }
    function buf(data, target) { var bo = gl.createBuffer(); gl.bindBuffer(target || gl.ARRAY_BUFFER, bo); gl.bufferData(target || gl.ARRAY_BUFFER, data, gl.STATIC_DRAW); return bo; }
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
    return { pos: buf(pos), nor: buf(nor), uv: buf(uv), idx: buf(new Uint16Array(idx), gl.ELEMENT_ARRAY_BUFFER), count: idx.length, tex: tex };
  }

  // ---------- shaders ----------
  var VS = [
    'attribute vec3 aPos; attribute vec3 aNor; attribute vec2 aUv;',
    'uniform mat4 uModel; uniform mat4 uVP; uniform mat3 uNM;',
    'varying vec3 vN; varying vec2 vUv; varying vec3 vW;',
    'void main(){ vec4 w = uModel * vec4(aPos, 1.0); vW = w.xyz; vN = uNM * aNor; vUv = aUv; gl_Position = uVP * w; }'
  ].join('\n');
  var FS = [
    'precision mediump float;',
    'uniform sampler2D uTex; uniform vec3 uCam; uniform float uDark;',
    'varying vec3 vN; varying vec2 vUv; varying vec3 vW;',
    'void main(){',
    '  vec4 t = texture2D(uTex, vUv);',
    '  if (t.a < 0.5) discard;',
    '  vec3 base = pow(t.rgb, vec3(2.2));',
    '  vec3 n = normalize(vN);',
    '  vec3 v = normalize(uCam - vW);',
    '  vec3 L1 = normalize(vec3(-0.55, 0.65, 0.75));',   // warm key, front-top-left
    '  vec3 L2 = normalize(vec3(0.75, 0.15, 0.45));',    // soft fill right
    '  vec3 L3 = normalize(vec3(0.3, 0.5, -0.8));',      // rim from behind
    '  float d1 = max(dot(n, L1), 0.0);',
    '  float d2 = max(dot(n, L2), 0.0);',
    '  float d3 = pow(max(dot(n, L3), 0.0), 2.0);',
    '  float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);',
    '  float spec = pow(max(dot(n, normalize(L1 + v)), 0.0), 18.0);',
    '  vec3 amb = mix(vec3(0.16, 0.14, 0.13), vec3(0.30, 0.28, 0.27), uDark);',
    '  vec3 col = base * (amb + vec3(1.05, 0.95, 0.84) * d1 + vec3(0.45, 0.48, 0.55) * d2);',
    '  col += vec3(1.0, 0.82, 0.62) * (d3 * 0.28 + fres * mix(0.10, 0.22, uDark));',
    '  col += vec3(1.0) * spec * mix(0.04, 0.07, uDark);',
    '  col = col / (col + vec3(0.85)) * 1.6;',          // soft tonemap
    '  gl_FragColor = vec4(pow(col, vec3(1.0 / 2.2)), 1.0);',
    '}'
  ].join('\n');

  function compile(type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }

  // ---------- textures ----------
  var grain;
  function makeGrain() {
    var c = document.createElement('canvas'); c.width = c.height = 256;
    var x = c.getContext('2d'), im = x.createImageData(256, 256);
    for (var i = 0; i < im.data.length; i += 4) {
      var v = 110 + Math.random() * 40 + Math.sin(i * 0.013) * 6;
      im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255;
    }
    x.putImageData(im, 0, 0);
    return c;
  }

  var imgCache = {};
  function getImg(src, cb) {
    if (imgCache[src]) { if (imgCache[src].complete && imgCache[src].naturalWidth) return imgCache[src]; return null; }
    var im = new Image(); im.onload = cb; im.src = src; imgCache[src] = im; return null;
  }

  function paintSide(i, look, pal, back) {
    var c = texCanvas[i], x = c.getContext('2d');
    x.setTransform(1, 0, 0, 1, 0, 0);
    x.clearRect(0, 0, c.width, c.height);
    x.setTransform(TEX_W / SW, 0, 0, TEX_H / SH, 0, 0);
    x.save();
    x.clip(shapePath);
    x.fillStyle = pal.fab; x.fillRect(0, 0, SW, SH);
    // knit grain
    x.globalAlpha = 0.07; x.globalCompositeOperation = 'overlay';
    x.fillStyle = x.createPattern(grain, 'repeat'); x.save(); x.scale(0.12, 0.12); x.fillRect(0, 0, SW / 0.12, SH / 0.12); x.restore();
    x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1;
    // seams & rib
    x.lineCap = 'round';
    x.strokeStyle = pal.seam; x.lineWidth = 0.9;
    x.beginPath();
    x.moveTo(40, 23); x.quadraticCurveTo(46, 60, 48, 100);   // left drop-shoulder seam
    x.moveTo(160, 23); x.quadraticCurveTo(154, 60, 152, 100); // right
    x.moveTo(6, 74); x.lineTo(28, 109);                       // sleeve hems
    x.moveTo(194, 74); x.lineTo(172, 109);
    x.moveTo(48, 197); x.quadraticCurveTo(100, 203, 152, 197); // body hem
    x.stroke();
    if (!back) {
      // inside of the back collar, seen through the front neckline
      x.fillStyle = pal.inner;
      x.beginPath(); x.moveTo(70, 9); x.quadraticCurveTo(100, 19, 130, 9); x.lineTo(130, 10); x.quadraticCurveTo(100, 34, 70, 10); x.closePath(); x.fill();
      x.lineWidth = 2.2; x.strokeStyle = pal.rib;
      x.beginPath(); x.moveTo(72, 11); x.quadraticCurveTo(100, 22, 128, 11); x.stroke();
    }
    x.lineWidth = back ? 4.5 : 6; x.strokeStyle = pal.rib;
    x.beginPath(); x.moveTo(71, back ? 11 : 11); x.quadraticCurveTo(100, back ? 22 : 35, 129, back ? 11 : 11); x.stroke();
    x.lineWidth = 0.6; x.strokeStyle = pal.seam;
    x.beginPath(); x.moveTo(68, back ? 15 : 15); x.quadraticCurveTo(100, back ? 27 : 40, 132, back ? 15 : 15); x.stroke();
    // print
    if (look && look.src) {
      var im = getImg(look.src, function () { api.setLook(state.front, state.back, state.pal); if (api.onChange) api.onChange(); });
      if (im) {
        var w = look.w / 100 * SW, h = w * im.naturalHeight / im.naturalWidth;
        x.drawImage(im, look.x / 100 * SW - w / 2, look.y / 100 * SH, w, h);
      }
    }
    x.restore();
    gl.bindTexture(gl.TEXTURE_2D, sides[i].tex);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  var state = { front: null, back: null, pal: null, key: '' };

  var api = {
    VIEW_H: VIEW_H,
    onChange: null,
    init: function (canvas) {
      try {
        gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: true });
        if (!gl) return false;
        shapePath = new Path2D(SHAPE);
        prog = gl.createProgram();
        gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
        gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
        gl.useProgram(prog);
        ['aPos', 'aNor', 'aUv'].forEach(function (n) { loc[n] = gl.getAttribLocation(prog, n); });
        ['uModel', 'uVP', 'uNM', 'uTex', 'uCam', 'uDark'].forEach(function (n) { loc[n] = gl.getUniformLocation(prog, n); });
        var geo = buildHeights();
        sides = [buildSide(geo, false), buildSide(geo, true)];
        texCanvas = [0, 1].map(function () { var c = document.createElement('canvas'); c.width = TEX_W; c.height = TEX_H; return c; });
        grain = makeGrain();
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
      var key = front.src + '|' + back.src + '|' + pal.fab;
      var isLoaded = function (src) { return !src || (imgCache[src] && imgCache[src].naturalWidth) ? 1 : 0; };
      var loaded = isLoaded(front.src) + isLoaded(back.src);
      key += '|' + loaded;
      state.front = front; state.back = back; state.pal = pal;
      if (key === state.key) return;
      state.key = key;
      paintSide(0, front, pal, false);
      paintSide(1, back, pal, true);
    },
    draw: function (o) {
      if (!ok) return;
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      var P = persp(FOV, aspect, 0.1, 100), V = trans(0, 0, -CAM_Z);
      var R = mul(rotZ(o.rz || 0), mul(rotY(o.ry || 0), rotX(o.rx || 0)));
      var M = mul(trans(o.x, o.y, o.z), mul(R, scale(o.s)));
      gl.uniformMatrix4fv(loc.uVP, false, mul(P, V));
      gl.uniformMatrix4fv(loc.uModel, false, M);
      gl.uniformMatrix3fv(loc.uNM, false, mat3of(R));
      gl.uniform3f(loc.uCam, 0, 0, CAM_Z);
      gl.uniform1f(loc.uDark, state.pal && state.pal.dark ? 1 : 0);
      gl.uniform1i(loc.uTex, 0);
      gl.activeTexture(gl.TEXTURE0);
      sides.forEach(function (sd) {
        gl.bindBuffer(gl.ARRAY_BUFFER, sd.pos); gl.enableVertexAttribArray(loc.aPos); gl.vertexAttribPointer(loc.aPos, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, sd.nor); gl.enableVertexAttribArray(loc.aNor); gl.vertexAttribPointer(loc.aNor, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, sd.uv); gl.enableVertexAttribArray(loc.aUv); gl.vertexAttribPointer(loc.aUv, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sd.idx);
        gl.bindTexture(gl.TEXTURE_2D, sd.tex);
        gl.drawElements(gl.TRIANGLES, sd.count, gl.UNSIGNED_SHORT, 0);
      });
    }
  };

  window.Shirt3D = api;
})();
