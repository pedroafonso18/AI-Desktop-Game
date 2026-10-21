/* CRACK'D - core utilities: pixel text, drawing helpers, colors. */
window.Pix = (function () {
  const W = 480, H = 270;

  const FONT = {
    body: '8px Silkscreen',
    bold: '700 8px Silkscreen',
    title: '8px "PressStart2P"',
  };

  const C = {
    ink: '#e9e7e2',
    dim: '#9b958c',
    faint: '#6a655e',
    panel: '#262a40',
    panelHi: '#39405e',
    panelLo: '#171a2b',
    edge: '#0d0f1a',
    gold: '#ffc94d',
    amber: '#e39b3a',
    green: '#68dd72',
    red: '#ff5f56',
    pink: '#ff7eb6',
    blue: '#63b3ff',
    cyan: '#5fe3e3',
    purple: '#b18cff',
    brown: '#8a6244',
    white: '#ffffff',
    black: '#000000',
  };

  /* ---------- text ---------- */

  function fontOf(o) {
    if (!o) return FONT.body;
    if (typeof o === 'string') return o;
    return o.font || FONT.body;
  }

  function measure(ctx, str, font) {
    ctx.font = font || FONT.body;
    return ctx.measureText(str).width;
  }

  /** Draw a single line of text. Returns the width drawn. */
  function text(ctx, str, x, y, o) {
    if (o === undefined || o === null) o = {};
    else if (typeof o === 'string') o = { color: o };
    const font = fontOf(o);
    ctx.font = font;
    ctx.textBaseline = 'top';
    const w = ctx.measureText(str).width;
    let tx = x;
    if (o.align === 'center') tx = x - w / 2;
    else if (o.align === 'right') tx = x - w;
    tx = Math.round(tx);
    const ty = Math.round(y);
    if (o.shadow) {
      ctx.fillStyle = o.shadow;
      ctx.fillText(str, tx + (o.shadowDx || 1), ty + (o.shadowDy || 1));
    }
    ctx.fillStyle = o.color || C.ink;
    ctx.fillText(str, tx, ty);
    return w;
  }

  /** Wrap text into an array of lines. Breaks words longer than maxW. */
  function wrap(ctx, str, maxW, font) {
    font = font || FONT.body;
    ctx.font = font;
    const out = [];
    for (const para of String(str).split('\n')) {
      if (para === '') { out.push(''); continue; }
      let cur = '';
      for (const word of para.split(' ')) {
        const test = cur ? cur + ' ' + word : word;
        if (ctx.measureText(test).width <= maxW || !cur) {
          cur = test;
        } else {
          out.push(cur);
          cur = word;
          while (ctx.measureText(cur).width > maxW && cur.length > 1) {
            let cut = cur.length - 1;
            while (cut > 1 && ctx.measureText(cur.slice(0, cut)).width > maxW) cut--;
            out.push(cur.slice(0, cut));
            cur = cur.slice(cut);
          }
        }
      }
      out.push(cur);
    }
    return out;
  }

  /* Chunky upscaled text: render small, threshold to 1-bit, blit scaled. */
  const bigCache = new Map();
  function bigText(ctx, str, x, y, o) {
    o = o || {};
    const scale = o.scale || 3;
    const font = fontOf(o);
    const color = o.color || C.ink;
    const key = font + '|' + color + '|' + scale + '|' + str;
    let e = bigCache.get(key);
    if (!e) {
      const mc = document.createElement('canvas');
      const c2 = mc.getContext('2d');
      c2.font = font;
      const w = Math.max(1, Math.ceil(c2.measureText(str).width));
      const h = 12;
      mc.width = w; mc.height = h;
      c2.font = font;
      c2.textBaseline = 'top';
      c2.fillStyle = color;
      c2.fillText(str, 0, 1);
      try {
        const img = c2.getImageData(0, 0, w, h);
        const d = img.data;
        for (let i = 0; i < d.length; i += 4) d[i + 3] = d[i + 3] > 110 ? 255 : 0;
        c2.putImageData(img, 0, 0);
      } catch (e2) { /* tainted canvas, keep AA */ }
      e = { canvas: mc, w, h };
      bigCache.set(key, e);
    }
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(e.canvas, 0, 0, e.w, e.h, Math.round(x), Math.round(y), e.w * scale, e.h * scale);
    return e.w * scale;
  }

  function bigWidth(str, o) {
    const font = fontOf(o);
    const scale = (o && o.scale) || 3;
    const key = 'w|' + font + '|' + scale + '|' + str;
    if (bigCache.has(key)) return bigCache.get(key).w * scale;
    const c2 = document.createElement('canvas').getContext('2d');
    c2.font = font;
    return Math.ceil(c2.measureText(str).width) * scale;
  }

  /* ---------- shapes ---------- */

  function rect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
  }

  function frame(ctx, x, y, w, h, color) {
    rect(ctx, x, y, w, 1, color);
    rect(ctx, x, y + h - 1, w, 1, color);
    rect(ctx, x, y, 1, h, color);
    rect(ctx, x + w - 1, y, 1, h, color);
  }

  function shadowRect(ctx, x, y, w, h, color) {
    rect(ctx, x + 1, y + 1, w, h, color);
  }

  /** Dithered vertical gradient (pixel-art style, no smooth gradients). */
  function vgrad(ctx, x, y, w, h, stops) {
    for (let i = 0; i < h; i++) {
      const t = h <= 1 ? 0 : i / (h - 1);
      let c = stops[0][1];
      for (let s = 0; s < stops.length - 1; s++) {
        const a = stops[s], b = stops[s + 1];
        if (t >= a[0] && t <= b[0]) {
          const lt = b[0] === a[0] ? 0 : (t - a[0]) / (b[0] - a[0]);
          c = mix(a[1], b[1], lt);
          break;
        }
        if (t > stops[stops.length - 1][0]) c = stops[stops.length - 1][1];
      }
      rect(ctx, x, y + i, w, 1, c);
    }
  }

  function mix(a, b, t) {
    const pa = hex2rgb(a), pb = hex2rgb(b);
    const r = Math.round(pa[0] + (pb[0] - pa[0]) * t);
    const g = Math.round(pa[1] + (pb[1] - pa[1]) * t);
    const bl = Math.round(pa[2] + (pb[2] - pa[2]) * t);
    return rgb(r, g, bl);
  }

  function hex2rgb(h) {
    if (h[0] !== '#') h = '#' + h;
    const n = parseInt(h.slice(1), 16);
    if (h.length === 4) {
      const r = ((n >> 8) & 0xf) * 17, g = ((n >> 4) & 0xf) * 17, b = (n & 0xf) * 17;
      return [r, g, b];
    }
    return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
  }

  function rgb(r, g, b) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  /** Classic bevel panel used all over the OS. */
  function panel(ctx, x, y, w, h, face, light, dark) {
    face = face || C.panel; light = light || C.panelHi; dark = dark || C.panelLo;
    rect(ctx, x, y, w, h, face);
    rect(ctx, x, y, w, 1, light);
    rect(ctx, x, y, 1, h, light);
    rect(ctx, x, y + h - 1, w, 1, dark);
    rect(ctx, x + w - 1, y, 1, h, dark);
  }

  function inset(ctx, x, y, w, h, face, light, dark) {
    face = face || C.panelLo; light = light || C.dark || C.panelLo; dark = dark || C.panelHi;
    rect(ctx, x, y, w, h, face);
    rect(ctx, x, y, w, 1, dark);
    rect(ctx, x, y, 1, h, dark);
    rect(ctx, x, y + h - 1, w, 1, light);
    rect(ctx, x + w - 1, y, 1, h, light);
  }

  function btn(ctx, x, y, w, h, label, o) {
    o = o || {};
    const pressed = o.pressed;
    const face = o.face || (pressed ? C.panelLo : C.panel);
    panel(ctx, x, y, w, h, face, o.light || C.panelHi, o.dark || C.panelLo);
    const ty = y + Math.floor((h - 8) / 2);
    let tx = x + Math.floor((w - measure(ctx, label, o.font)) / 2);
    if (o.align === 'left') tx = x + 5;
    text(ctx, label, tx, ty, { color: o.color || (pressed ? C.gold : C.ink), font: o.font });
    if (o.hot) frame(ctx, x - 1, y - 1, w + 2, h + 2, C.gold);
  }

  function scrollbar(ctx, x, y, h, frac, view) {
    rect(ctx, x, y, 5, h, C.panelLo);
    frame(ctx, x, y, 5, h, C.edge);
    const th = Math.max(8, Math.round(h * frac));
    const ty = y + Math.round((h - th) * view);
    panel(ctx, x, ty, 5, th, C.panelHi, C.ink, C.panelLo);
  }

  function clipRect(ctx, x, y, w, h, fn) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    fn();
    ctx.restore();
  }

  return {
    W, H, FONT, C,
    text, measure, wrap, bigText, bigWidth,
    rect, frame, shadowRect, vgrad, mix, hex2rgb, rgb,
    panel, inset, btn, scrollbar, clipRect,
  };
})();
