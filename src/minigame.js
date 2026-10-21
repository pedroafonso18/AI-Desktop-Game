/* CRACK'D - PIXEL KNIGHT 3000: the thing you pirated. */
window.MiniGame = (function () {
  const Pix = window.Pix;
  const Art = window.Art;
  const Data = window.Data;

  const GROUND = 208;
  const G = {
    active: false,
    x: 40, y: GROUND - 16, vy: 0,
    speed: 170,
    coins: 0, frame: 0, dead: false, won: false,
    t: 0, jumps: 0, deathReason: '',
    cam: 0,
  };

  function reset() {
    G.active = true;
    G.x = 40; G.y = GROUND - 16; G.vy = 0;
    G.speed = 165; G.coins = 0; G.frame = 0;
    G.dead = false; G.won = false; G.t = 0; G.jumps = 0;
    G.deathReason = ''; G.cam = 0;
    G.taken = {};
  }

  function jump() {
    if (G.dead || G.won) return;
    if (G.y >= GROUND - 17) {
      G.vy = -340;
      G.jumps++;
      window.Sfx.jump();
    }
  }

  function update(dt) {
    if (!G.active) return;
    G.t += dt;
    if (G.dead) {
      G.vy += 900 * dt;
      G.y += G.vy * dt;
      return;
    }
    G.x += G.speed * dt;
    G.vy += 900 * dt;
    G.y += G.vy * dt;
    // the ground only exists where there is ground
    let overGap = false;
    for (const o of Data.LEVEL.obstacles) {
      if (o.type === 'gap' && G.x + 8 > o.x && G.x - 4 < o.x + o.len * 16) { overGap = true; break; }
    }
    if (!overGap && G.y >= GROUND - 16) { G.y = GROUND - 16; G.vy = 0; }
    G.frame += dt * (G.speed / 22);
    G.cam = G.x - 60;
    G.speed = Math.min(300, 165 + G.t * 4.5);

    // spikes
    for (const o of Data.LEVEL.obstacles) {
      if (o.type === 'spike') {
        if (G.x + 8 > o.x && G.x - 4 < o.x + 14 && G.y + 16 > GROUND - 9) {
          die('you hit a spike');
          return;
        }
      } else {
        const gx = o.x, gw = o.len * 16;
        if (G.x + 8 > gx && G.x - 4 < gx + gw && G.y + 16 > GROUND) {
          die('you fell in the hole');
          return;
        }
      }
    }
    // coins
    for (let i = 0; i < Data.LEVEL.coins.length; i++) {
      const c = Data.LEVEL.coins[i];
      if (!G.taken) G.taken = {};
      if (!G.taken[i] && Math.abs(G.x - c) < 12 && Math.abs(G.y + 8 - (GROUND - 40)) < 26) {
        G.taken[i] = true;
        G.coins++;
        window.Sfx.coin();
      }
    }    if (G.x >= Data.LEVEL.finish) {
      G.won = true;
      G.active = false;
      window.Sfx.win();
      window.GAME.finishMiniGame();
    }
  }

  function die(reason) {
    if (G.dead) return;
    G.dead = true;
    G.deathReason = reason;
    G.attempts++;
    window.Sfx.die();
    if (G.attempts >= 3) {
      setTimeout(() => window.GAME.miniGameDied(reason), 800);
    }
  }

  function draw(ctx, t) {
    // sky
    Pix.vgrad(ctx, 0, 0, 480, GROUND, [[0, '#241a4a'], [0.6, '#4a2a5e'], [1, '#8a4a52']]);
    // parallax mountains
    for (let layer = 0; layer < 2; layer++) {
      const sp = layer ? 0.4 : 0.2;
      const off = (G.cam * sp) % 240;
      const base = GROUND - (layer ? 26 : 46);
      for (let i = -1; i < 3; i++) {
        const x = i * 240 - off;
        for (let k = 0; k < 60; k++) {
          const h = Math.round(30 * Math.sin((i * 240 + k) * 0.07) + 30);
          Pix.rect(ctx, x + k, base - h, 1, h, layer ? '#3a2050' : '#2a1740');
        }
      }
    }
    // ground
    const gStart = Math.floor(G.cam / 16) * 16;
    Pix.rect(ctx, 0, GROUND, 480, 270 - GROUND, '#2a2036');
    Pix.rect(ctx, 0, GROUND, 480, 3, '#4a3a5e');
    // gaps
    for (const o of Data.LEVEL.obstacles) {
      if (o.type !== 'gap') continue;
      const gx = Math.round(o.x - G.cam);
      Pix.rect(ctx, gx, GROUND, o.len * 16, 270 - GROUND, '#120c1c');
    }
    // ground tiles
    for (let i = 0; i < 32; i++) {
      const tx = i * 16 - (G.cam % 16);
      let inGap = false;
      for (const o of Data.LEVEL.obstacles) {
        if (o.type === 'gap' && tx + 16 > o.x - G.cam && tx < o.x - G.cam + o.len * 16) inGap = true;
      }
      if (!inGap) {
        Pix.rect(ctx, tx, GROUND + 6, 1, 4, '#3a2c4a');
        Pix.rect(ctx, tx + 8, GROUND + 14, 1, 4, '#3a2c4a');
      }
    }
    // spikes
    for (const o of Data.LEVEL.obstacles) {
      if (o.type !== 'spike') continue;
      const sx = Math.round(o.x - G.cam);
      if (sx < -20 || sx > 500) continue;
      for (let i = 0; i < 14; i++) {
        const h = 9 - Math.abs(7 - i);
        Pix.rect(ctx, sx + i, GROUND - h, 1, h, '#c94f4f');
        Pix.rect(ctx, sx + i, GROUND - h, 1, 1, '#f08a8a');
      }
    }
    // coins
    for (let i = 0; i < Data.LEVEL.coins.length; i++) {
      if (G.taken && G.taken[i]) continue;
      const cx = Math.round(Data.LEVEL.coins[i] - G.cam);
      if (cx < -20 || cx > 500) continue;
      const bob = Math.sin(G.t * 4 + i) * 2;
      Pix.text(ctx, 'o', cx, GROUND - 44 + bob, { color: '#ffd75e' });
      Pix.text(ctx, 'o', cx + 1, GROUND - 44 + bob, { color: '#ffd75e' });
    }
    // knight
    const frame = Art.KNIGHT[Math.floor(G.frame) % 2];
    const sx = 60;
    const sy = Math.round(G.y);
    if (G.dead) {
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(Math.min(1.4, G.t * 3));
      Art.draw(ctx, frame, -6, 0, false);
      ctx.restore();
    } else {
      Art.draw(ctx, frame, sx, sy, false);
    }
    // hud
    Pix.rect(ctx, 0, 0, 480, 12, 'rgba(0,0,0,0.45)');
    Pix.text(ctx, 'PIXEL KNIGHT 3000', 4, 2, { color: '#ffe14d' });
    Pix.text(ctx, 'x ' + G.coins, 130, 2, { color: '#ffd75e' });
    Pix.text(ctx, 'DIST ' + Math.round(G.x) + ' / ' + Data.LEVEL.finish, 200, 2, { color: '#cfcbd8' });
    // finish flag
    const fx = Math.round(Data.LEVEL.finish - G.cam);
    if (fx > -20 && fx < 500) {
      Pix.rect(ctx, fx, GROUND - 40, 2, 40, '#d8d6df');
      Pix.rect(ctx, fx + 2, GROUND - 40, 14, 10, '#e2554f');
      Pix.text(ctx, 'END', fx + 2, GROUND - 38, { color: '#fff' });
    }
    if (G.dead) {
      Pix.rect(ctx, 0, 0, 480, 270, 'rgba(4,4,10,0.68)');
      Pix.bigText(ctx, 'GAME CRASHED', 146, 96, { scale: 2, color: '#ff5f56' });
      Pix.text(ctx, 'PIXEL KNIGHT 3000 has crashed (' + G.deathReason + ')', 240, 132, { color: '#e9e7e2', align: 'center' });
      if (G.attempts < 3) {
        if (Math.floor(t / 400) % 2 === 0) {
          Pix.text(ctx, 'PRESS SPACE TO TRY AGAIN   (' + G.attempts + '/3)', 240, 150, { color: '#ffc94d', align: 'center' });
        }
      } else {
        Pix.text(ctx, 'the crash dialog is loading the crash dialog...', 240, 150, { color: '#6a655e', align: 'center' });
      }
    }
  }

  return { G, reset, update, draw, jump, die };
})();
