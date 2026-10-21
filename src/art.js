/* CRACK'D - pixel art: sprites, icons, wallpaper, cursor. */
window.Art = (function () {
  const Pix = window.Pix;

  /* ---------- sprite format: {pal:{char:color}, rows:[strings]} ---------- */

  function draw(ctx, sp, x, y, flip, tint) {
    const pal = sp.pal;
    const rows = sp.rows;
    const h = rows.length;
    const w = rows[0].length;
    for (let ry = 0; ry < h; ry++) {
      const row = rows[ry];
      for (let rx = 0; rx < w; rx++) {
        const ch = row[rx];
        if (ch === '.' || ch === ' ') continue;
        const col = tint || pal[ch];
        if (!col) continue;
        ctx.fillStyle = col;
        const px = flip ? x + (w - 1 - rx) : x + rx;
        ctx.fillRect(px | 0, (y + ry) | 0, 1, 1);
      }
    }
  }

  /* ---------- knight (the hero of the pirated game) ---------- */
  const KNIGHT_PAL = {
    k: '#20202f',
    a: '#e2eaf8',
    b: '#9fb2d6',
    c: '#6c7ea8',
    r: '#e2554f',
    s: '#f0c89c',
    e: '#2b2438',
    y: '#ffcc55',
  };
  const KNIGHT = [
    {
      pal: KNIGHT_PAL,
      rows: [
        '....rrrr....',
        '...rrrrrr...',
        '....aaaa....',
        '...aabbaa...',
        '..aaabbbaa..',
        '..aassssaa..',
        '..aasseesaa.',
        '...aaaaaa...',
        '..aaaaaaa...',
        '.aabbbbbbaa.',
        '.aabbbbbbaa.',
        '..aaaaaaaa..',
        '...bbbbbb...',
        '...bb..bb...',
        '...bb..bb...',
        '..kkk..kkk..',
      ],
    },
    {
      pal: KNIGHT_PAL,
      rows: [
        '....rrrr....',
        '...rrrrrr...',
        '....aaaa....',
        '...aabbaa...',
        '..aaabbbaa..',
        '..aassssaa..',
        '..aasseesaa.',
        '...aaaaaa...',
        '..aaaaaaa...',
        '.aabbbbbbaa.',
        '.aabbbbbbaa.',
        '..aaaaaaaa..',
        '..bbbbbbbb..',
        '..bb...bb...',
        '.bb.....bb..',
        'kkk.....kkk.',
      ],
    },
  ];

  /* ---------- 16x16 desktop icons ---------- */
  const ICONS = {
    browser: {
      pal: { '.': null, w: '#e9e7e2', l: '#63b3ff', b: '#2b6fd4', d: '#173d80', g: '#68dd72' },
      rows: [
        '.....wwwwww.....',
        '...wwllllllww...',
        '..wllbbbbbllw...',
        '.wllbbbbbbbllw..',
        '.wlbbbbwwbbbwl..',
        'wllbbbwwwwbbblw.',
        'wlbbbwwwwwwwbblw',
        'wlbbbwwwwwwwbblw',
        'wlbbbwwwwwwwbblw',
        'wllbbbwwwwbbblw.',
        '.wlbbbbwwbbbwl..',
        '.wllbbbbbbbllw..',
        '..wllbbbbbllw...',
        '...wwllllllww...',
        '.....wwwwww.....',
        '................',
      ],
    },
    pc: {
      pal: { '.': null, c: '#c9cbd6', d: '#6b6f85', m: '#2b6fd4', l: '#8fd0ff', k: '#20202f' },
      rows: [
        '................',
        '..kkkkkkkkkkkk..',
        '..kccccccccck..',
        '..kcmlmmmmmlck..',
        '..kcmlmmmmmlck..',
        '..kcmlmmmmmlck..',
        '..kcmmmmmmmmck..',
        '..kcmmmmmmmmck..',
        '..kccccccccck..',
        '..kkkkkkkkkkkk..',
        '.....dddddd.....',
        '....dddddddd....',
        '...dddddddddd...',
        '...kkkkkkkkkk...',
        '................',
        '................',
      ],
    },
    av: {
      pal: { '.': null, b: '#2f8f4e', l: '#68dd72', d: '#1c5c33', w: '#e9e7e2', r: '#e2554f' },
      rows: [
        '................',
        '.....bbbbbb.....',
        '....bbllllbb....',
        '...bllwwwwllb...',
        '..bllwrrwwrllb..',
        '..blwwwwwwwwlb..',
        '..blwwwwwwwwlb..',
        '..blwwwwwwwwlb..',
        '...bwwwwwwwwb...',
        '...bbwwwwwwbb...',
        '....bbwwwwbb....',
        '.....bbwwbb.....',
        '......bbbb......',
        '.......bb.......',
        '................',
        '................',
      ],
    },
    notes: {
      pal: { '.': null, w: '#e9e7e2', l: '#cfcbd8', b: '#63b3ff', d: '#6b6f85', y: '#ffcc55' },
      rows: [
        '................',
        '..dddddddddddd..',
        '..dwwwwwwwwwwd..',
        '..dwlllllllllld.',
        '..dwlbbbbbbbld..',
        '..dwlbbbbbbbld..',
        '..dwlbbbbbbbld..',
        '..dwlbbbbbbbld..',
        '..dwlbbbbbbbld..',
        '..dwlbbbbbbbld..',
        '..dwlbbbbbbbld..',
        '..dwlbbbbbbbld..',
        '..dwlbbbbbbbld..',
        '..dwwwwwwwwwwd..',
        '..dddddddddddd..',
        '................',
      ],
    },
    bin: {
      pal: { '.': null, l: '#c9cbd6', d: '#6b6f85', g: '#68dd72', t: '#8a6244' },
      rows: [
        '................',
        '.....dddddd.....',
        '....dllllll d...'.replace(' ', 'd'),
        '...dllllllllld..',
        '...dlgglgglgl...',
        '...dlgglgglgl...',
        '...dlgglgglgl...',
        '...dlgglgglgl...',
        '...dlgglgglgl...',
        '...dllllllllld..',
        '....dllllllld...',
        '....dllllllld...',
        '.....dddddd.....',
        '................',
        '................',
        '................',
      ],
    },
    power: {
      pal: { '.': null, r: '#e2554f', d: '#7a2f2c', w: '#e9e7e2' },
      rows: [
        '.......rr.......',
        '.......rr.......',
        '......rrrr......',
        '.....r....r.....',
        '....r......r....',
        '...r..wwww..r...',
        '...r.wwwwww.r...',
        '..r..wwwwww..r..',
        '..r..wwwwww..r..',
        '..r..wwwwww..r..',
        '...r.wwwwww.r...',
        '...r..wwww..r...',
        '....r......r....',
        '.....r....r.....',
        '......rrrr......',
        '................',
      ],
    },
    game: {
      pal: { '.': null, c: '#9fb2d6', a: '#e2eaf8', r: '#e2554f', d: '#6c7ea8', k: '#20202f', y: '#ffcc55' },
      rows: [
        '................',
        '......kkkk......',
        '.....krrrrk.....',
        '....kraaaark....',
        '...kraaaaaark...',
        '..kraayyyaark...',
        '..kraaaaaaark...',
        '..kraaaaaaark...',
        '...kraaaaark....',
        '....kraaark.....',
        '.....krrrk......',
        '....kc.c.ck.....',
        '...kc...c.ck....',
        '..kk.....kk.....',
        '................',
        '................',
      ],
    },
    folder: {
      pal: { '.': null, d: '#a8792f', l: '#ffcc55', s: '#8a5f22' },
      rows: [
        '................',
        '................',
        '..dddd..........',
        '.dllldddddddddd.',
        '.dllllllllllllld',
        '.dllllllllllllld',
        '.dllllllllllllld',
        '.dllllllllllllld',
        '.dllllllllllllld',
        '.dllllllllllllld',
        '.dllllllllllllld',
        '.dllllllllllllld',
        '.dllllllllllllld',
        '.dsssssssssssssd',
        '................',
        '................',
      ],
    },
    file: {
      pal: { '.': null, w: '#e9e7e2', d: '#6b6f85', l: '#cfcbd8', b: '#63b3ff' },
      rows: [
        '................',
        '....ddddddd.....',
        '....dwwwwwd.....',
        '....dwlllwd.....',
        '....dwlllwd.....',
        '....dwllbwd.....',
        '....dwllbwd.....',
        '....dwlllwd.....',
        '....dwlllwd.....',
        '....dwlllwd.....',
        '....dwlllwd.....',
        '....dwwwwwd.....',
        '....ddddddd.....',
        '................',
        '................',
        '................',
      ],
    },
    virus: {
      pal: { '.': null, g: '#68dd72', d: '#1c5c33', e: '#e2554f', k: '#20202f' },
      rows: [
        '................',
        '..k..........k..',
        '..kgk......kgk..',
        '...kgk....kgk...',
        '....kkggggggkk...',
        '...kgggggggggk..',
        '..kgggegggegggk.',
        '..kgggegggegggk.',
        '..kgggggggggggk.',
        '...kgggggggggk..',
        '....kkggggggkk...',
        '...kgk....kgk...',
        '..kgk......kgk..',
        '..k..........k..',
        '................',
        '................',
      ],
    },
    skull: {
      pal: { '.': null, w: '#e9e7e2', d: '#b8b4c0', e: '#20202f', r: '#e2554f' },
      rows: [
        '................',
        '................',
        '....wwwwwwww....',
        '...wwwwwwwwww...',
        '..wwwwwwwwwwww..',
        '..wwwweewweeew..',
        '..wwwweewweeew..',
        '..wwwwwwwwwwww..',
        '..wwwwwwwwwwww..',
        '...wwwrrwwrrww..',
        '...wwwwwwwwww...',
        '..ddwddwwddwwdd..',
        '..ddwddwwddwwdd..',
        '...ddddddddd....',
        '................',
        '................',
      ],
    },
  };

  /* ---------- wallpaper ---------- */

  function rnd(seed) {
    let s = seed;
    return function () {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };
  }

  function drawWallpaper(ctx, t, opts) {
    opts = opts || {};
    const W = 480, H = 270;
    const horizon = 176;

    Pix.vgrad(ctx, 0, 0, W, horizon, [
      [0, '#120c26'],
      [0.35, '#2b1445'],
      [0.6, '#5c2050'],
      [0.8, '#a83b45'],
      [1, '#e8823c'],
    ]);

    // stars
    const r = rnd(1337);
    for (let i = 0; i < 70; i++) {
      const x = Math.floor(r() * W);
      const y = Math.floor(r() * (horizon * 0.62));
      const tw = (Math.sin(t * 0.002 + i) + 1) / 2;
      if (r() < 0.35 + tw * 0.4) Pix.rect(ctx, x, y, 1, 1, tw > 0.6 ? '#ffffff' : '#b9b3e6');
    }

    // sun
    const sunX = 352, sunY = 108;
    for (let dy = -30; dy <= 30; dy++) {
      const dx = Math.floor(Math.sqrt(Math.max(0, 900 - dy * dy)));
      let col = '#ffd479';
      if (dy > 6 && dy < 14) col = '#ffb257';
      if (dy >= 14) col = '#f08a4b';
      if (dy > 20) col = '#d96a3f';
      Pix.rect(ctx, sunX - dx, sunY + dy, dx * 2, 1, col);
    }
    // sun scanline cuts (retro dither)
    for (let i = 0; i < 8; i++) {
      const yy = sunY + 8 + i * 3;
      const dx = Math.floor(Math.sqrt(Math.max(0, 900 - (yy - sunY) * (yy - sunY))));
      Pix.rect(ctx, sunX - dx, yy, dx * 2, 1, 'rgba(20,8,20,0.45)');
    }

    // far ridge
    const r2 = rnd(77);
    let y = horizon - 6;
    for (let x = 0; x < W; x++) {
      const step = r2() < 0.12 ? 3 + Math.floor(r2() * 4) : 0;
      y = Math.max(horizon - 52, Math.min(horizon - 6, y + step - (r2() < 0.5 ? 1 : 0)));
      Pix.rect(ctx, x, y, 1, horizon - y, '#3a1c4d');
    }
    // near ridge
    const r3 = rnd(4242);
    let y2 = horizon + 4;
    for (let x = 0; x < W; x++) {
      const step = r3() < 0.1 ? 3 + Math.floor(r3() * 5) : 0;
      y2 = Math.max(horizon - 26, Math.min(horizon + 6, y2 + step - (r3() < 0.5 ? 1 : 0)));
      Pix.rect(ctx, x, y2, 1, horizon + 40 - y2, '#1d1030');
    }

    // ground
    Pix.vgrad(ctx, 0, horizon + 6, W, H - horizon - 6, [
      [0, '#191227'],
      [1, '#0d0a17'],
    ]);
    // ground grid lines (retro synthwave)
    for (let i = 0; i < 10; i++) {
      const gy = horizon + 10 + i * i * 1.1;
      if (gy > H) break;
      Pix.rect(ctx, 0, gy | 0, W, 1, i % 2 ? '#241a3a' : '#2c2046');
    }
    for (let i = -6; i <= 6; i++) {
      const gx = 240 + i * 46;
      for (let yy = horizon + 8; yy < H; yy += 3) {
        Pix.rect(ctx, (gx + (yy - horizon) * i * 0.35) | 0, yy, 1, 1, '#2c2046');
      }
    }

    // the knight standing on the hill, watching the sunset
    const kx = 404, ky = horizon - 26;
    draw(ctx, KNIGHT[0], kx, ky, false);
    // his reflection/shadow
    Pix.rect(ctx, kx + 1, ky + 16, 10, 1, '#0a0813');

    // poster on the "wall" (top right, above the knight)
    const px = 406, py = 24, pw = 62, ph = 84;
    Pix.rect(ctx, px, py, pw, ph, '#241a2e');
    Pix.frame(ctx, px, py, pw, ph, '#0a0813');
    Pix.frame(ctx, px + 1, py + 1, pw - 2, ph - 2, '#3d2c4c');
    Pix.text(ctx, 'WANTED', px + 7, py + 6, { color: '#ffcc55' });
    Pix.text(ctx, 'FOR PIRACY', px + 5, py + 15, { color: '#e2554f' });
    draw(ctx, KNIGHT[0], px + 25, py + 28, false, '#c9a0d8');
    Pix.text(ctx, 'REWARD', px + 14, py + 48, { color: '#cfcbd8' });
    Pix.text(ctx, 'R$ 0,00', px + 15, py + 58, { color: '#68dd72' });
    Pix.text(ctx, '(honest work', px + 8, py + 68, { color: '#8b86a0' });
    Pix.text(ctx, '  is free)', px + 12, py + 76, { color: '#8b86a0' });
  }

  function drawInfectedWallpaper(ctx, t) {
    const W = 480, H = 270;
    const flash = Math.floor(t / 180) % 2 === 0;
    Pix.vgrad(ctx, 0, 0, W, H, [
      [0, flash ? '#ff2f6d' : '#c2185b'],
      [0.5, '#6a1b9a'],
      [1, '#2b0b3d'],
    ]);
    const r = rnd(9);
    for (let i = 0; i < 40; i++) {
      const x = Math.floor(r() * W), y = Math.floor(r() * H);
      const w = 30 + Math.floor(r() * 50), h = 10;
      Pix.rect(ctx, x, y, w, h, 'rgba(0,0,0,0.25)');
      Pix.text(ctx, 'FREE COUPON!!', x + 2, y + 1, { color: '#ffe14d' });
    }
    for (let i = 0; i < 18; i++) {
      const x = Math.floor(r() * W), y = Math.floor(r() * H);
      draw(ctx, ICONS.virus, x, y, false, '#ffe14d');
    }
    Pix.rect(ctx, 0, 110, W, 30, 'rgba(0,0,0,0.65)');
    Pix.bigText(ctx, 'YOUR PC IS INFECTED', 12, 116, { scale: 2, color: '#ff5f56' });
  }

  /* ---------- cursor ---------- */
  const CURSOR = {
    pal: { k: '#20202f', w: '#ffffff' },
    rows: [
      'k........',
      'kw.......',
      'kww......',
      'kwww.....',
      'kwwww....',
      'kwwwww...',
      'kwwwwww..',
      'kwwwwwww.',
      'kwwwwwwwk',
      'kwwwwwkk.',
      'kwwwwk...',
      'kwwk.....',
      'kkk......',
      'k........',
    ],
  };

  return { draw, ICONS, KNIGHT, drawWallpaper, drawInfectedWallpaper, CURSOR, rnd };
})();
