/* CRACK'D - fake desktop OS: window manager, desktop, taskbar. */
window.OS = (function () {
  const Pix = window.Pix;
  const C = Pix.C;
  const W = 480, H = 270;
  const TITLE_H = 13;
  const TASK_H = 16;

  const WM = {
    wins: [],
    seq: 0,
    focusId: null,
    drag: null,
    icons: [],
    status: { clock: 'SAT 00:00', health: 100, note: '' },

    add(win) {
      win.id = ++this.seq;
      win.visible = true;
      win.minimized = false;
      win.state = win.state || {};
      this.wins.push(win);
      this.focus(win);
      if (win.app && win.app.init) win.app.init(win);
      return win;
    },

    get(id) { return this.wins.find((w) => w.id === id); },

    remove(win) {
      if (win.app && win.app.onClose) win.app.onClose(win);
      this.wins = this.wins.filter((w) => w !== win);
      if (this.focusId === win.id) {
        const top = this.wins.filter((w) => !w.minimized).pop();
        this.focusId = top ? top.id : null;
      }
    },

    focus(win) {
      if (!win) return;
      if (this.focusId !== win.id) {
        const old = this.get(this.focusId);
        if (old) old.focused = false;
        win.focused = true;
        this.focusId = win.id;
      }
      // raise
      const i = this.wins.indexOf(win);
      if (i >= 0 && i !== this.wins.length - 1) {
        this.wins.splice(i, 1);
        this.wins.push(win);
      }
    },

    focused() { return this.get(this.focusId); },

    /** Topmost visible window containing the point. */
    hit(x, y) {
      for (let i = this.wins.length - 1; i >= 0; i--) {
        const w = this.wins[i];
        if (!w.visible || w.minimized) continue;
        if (w.alwaysOnTop) {
          if (x >= w.x && x < w.x + w.w && y >= w.y && y < w.y + w.h) return w;
        }
      }
      for (let i = this.wins.length - 1; i >= 0; i--) {
        const w = this.wins[i];
        if (!w.visible || w.minimized) continue;
        if (x >= w.x && x < w.x + w.w && y >= w.y && y < w.y + w.h) return w;
      }
      return null;
    },

    clientRect(win) {
      return { x: win.x + 3, y: win.y + TITLE_H + 1, w: win.w - 6, h: win.h - TITLE_H - 4 };
    },

    /* ---------------- rendering ---------------- */

    draw(ctx, t) {
      // wallpaper
      if (this.status.wallpaper === 'infected') {
        window.Art.drawInfectedWallpaper(ctx, t);
      } else {
        window.Art.drawWallpaper(ctx, t);
      }
      this.drawIcons(ctx, t);
      for (const w of this.wins) {
        if (w.visible && !w.minimized) this.drawWindow(ctx, w, t);
      }
      this.drawTaskbar(ctx, t);
    },

    drawIcons(ctx, t) {
      const sel = this.status.selectedIcon;
      for (let i = 0; i < this.icons.length; i++) {
        const ic = this.icons[i];
        const col = i % 3, row = Math.floor(i / 3);
        const x = 10 + col * 64, y = 8 + row * 46;
        if (sel === ic.id) {
          Pix.rect(ctx, x - 3, y - 3, 22, 22, 'rgba(105,150,255,0.28)');
          Pix.frame(ctx, x - 3, y - 3, 22, 22, 'rgba(150,190,255,0.8)');
        }
        window.Art.draw(ctx, window.Art.ICONS[ic.icon], x, y, false);
        const words = Pix.wrap(ctx, ic.label, 56);
        words.slice(0, 2).forEach((w, k) => {
          Pix.text(ctx, w, x + 8, y + 20 + k * 8, { color: '#f2f0ea', align: 'center', shadow: '#000' });
        });
      }
    },

    drawWindow(ctx, win, t) {
      const x = win.x, y = win.y, w = win.w, h = win.h;
      const accent = win.accent || '#5a6290';
      // shadow
      Pix.rect(ctx, x + 2, y + 2, w, h, 'rgba(0,0,0,0.35)');
      // body
      Pix.rect(ctx, x, y, w, h, C.panel);
      Pix.frame(ctx, x, y, w, h, C.edge);
      Pix.rect(ctx, x + 1, y + 1, w - 2, 1, C.panelHi);
      // title bar
      Pix.vgrad(ctx, x + 1, y + 1, w - 2, TITLE_H - 2, [
        [0, win.focused ? accent : '#4a5070'],
        [1, win.focused ? '#2a2f4a' : '#333852'],
      ]);
      Pix.rect(ctx, x + 1, y + TITLE_H - 1, w - 2, 1, C.edge);
      if (win.icon && window.Art.ICONS[win.icon]) {
        window.Art.draw(ctx, window.Art.ICONS[win.icon], x + 3, y + 3, false);
      }
      Pix.text(ctx, win.title, x + 21, y + 4, {
        color: win.focused ? '#fff8e0' : '#b9b6c4', font: Pix.FONT.bold,
      });
      // buttons
      const bx = x + w - 10;
      this.titleBtn(ctx, bx, y + 3, 'x', win, 'close');
      this.titleBtn(ctx, bx - 10, y + 3, '_', win, 'min');
      this.titleBtn(ctx, bx - 20, y + 3, 'o', win, 'max');
      // client area
      const r = this.clientRect(win);
      ctx.save();
      ctx.beginPath();
      ctx.rect(r.x, r.y, r.w, r.h);
      ctx.clip();
      if (win.app && win.app.draw) win.app.draw(ctx, win, r, t);
      ctx.restore();
    },

    titleBtn(ctx, x, y, glyph, win, action) {
      Pix.panel(ctx, x, y, 9, 9, win.focused ? C.panelHi : '#454a66', '#8e93b0', C.panelLo);
      Pix.text(ctx, glyph, x + 4, y + 1, { color: '#e9e7e2' });
    },

    drawTaskbar(ctx, t) {
      const y = H - TASK_H;
      Pix.rect(ctx, 0, y, W, TASK_H, '#1b1f33');
      Pix.rect(ctx, 0, y, W, 1, '#454b6b');
      Pix.rect(ctx, 0, y + 1, W, 1, '#0f1120');

      // start button
      const focused = WM.focused();
      Pix.panel(ctx, 2, y + 2, 30, TASK_H - 4, '#2f3550', '#6d7590', '#141726');
      Pix.rect(ctx, 6, y + 6, 6, 6, '#68dd72');
      Pix.rect(ctx, 6, y + 6, 6, 2, '#e2554f');
      Pix.text(ctx, 'START', 14, y + 5, { color: '#e9e7e2', font: Pix.FONT.bold });

      // task buttons
      let bx = 36;
      for (const win of WM.wins) {
        if (win.noTask) continue;
        const label = win.title;
        const bw = Math.min(96, 22 + Pix.measure(ctx, label, Pix.FONT.body));
        if (bx + bw > W - 92) break;
        const isFocus = focused && focused.id === win.id;
        Pix.panel(ctx, bx, y + 2, bw, TASK_H - 4, isFocus ? '#39405e' : '#262b44', '#5a6088', '#12142a');
        if (isFocus) Pix.rect(ctx, bx + 1, y + 2, bw - 2, 1, accentOf(win));
        const tx = bx + 5;
        Pix.text(ctx, label.length > 14 ? label.slice(0, 13) + '.' : label, tx, y + 5, {
          color: win.minimized ? '#7c8199' : '#d8d6df',
        });
        win._taskX = bx;
        win._taskW = bw;
        bx += bw + 3;
      }

      // right side: health + clock
      const st = this.status;
      Pix.text(ctx, st.clock, W - 5, y + 5, { color: '#d8d6df', align: 'right' });
      if (st.health !== undefined && st.health < 100) {
        const bw = 34;
        const bx2 = W - 78;
        Pix.rect(ctx, bx2, y + 6, bw, 5, '#0f1120');
        Pix.frame(ctx, bx2, y + 6, bw, 5, '#3a3f5c');
        const fw = Math.round((bw - 2) * Math.max(0, st.health) / 100);
        Pix.rect(ctx, bx2 + 1, y + 7, fw, 3, st.health > 60 ? '#68dd72' : st.health > 30 ? '#ffc94d' : '#ff5f56');
      }
      if (st.note) Pix.text(ctx, st.note, W - 82, y + 5, { color: '#ffc94d', align: 'right' });
    },

    /* ---------------- input ---------------- */

    mouseDown(x, y, btn) {
      const win = this.hit(x, y);
      if (!win) {
        this.status.selectedIcon = null;
        this.onDesktopClick && this.onDesktopClick(x, y);
        return;
      }
      this.focus(win);
      // title bar buttons
      const bx = win.x + win.w - 10;
      if (y >= win.y + 2 && y <= win.y + 12 && x >= bx - 22 && x <= bx + 10) {
        if (x >= bx) { this.close(win); return; }
        if (x >= bx - 11) { win.minimized = true; window.Sfx.click(); return; }
        if (x >= bx - 21) { win.maximized = !win.maximized; window.Sfx.click(); return; }
      }
      if (y >= win.y && y < win.y + TITLE_H && x < win.x + win.w - 24) {
        this.drag = { win, dx: x - win.x, dy: y - win.y };
        return;
      }
      const r = this.clientRect(win);
      if (win.app && win.app.mouse) {
        win.app.mouse(win, r, x, y, 'down', btn);
      }
    },

    mouseUp(x, y, btn) {
      this.drag = null;
      const win = this.hit(x, y);
      if (win && win.app && win.app.mouse) {
        const r = this.clientRect(win);
        win.app.mouse(win, r, x, y, 'up', btn);
      }
    },

    mouseMove(x, y) {
      if (this.drag) {
        const win = this.drag.win;
        win.x = Math.max(-win.w + 40, Math.min(W - 20, x - this.drag.dx));
        win.y = Math.max(0, Math.min(H - TASK_H - 12, y - this.drag.dy));
        return;
      }
      const win = this.hit(x, y);
      if (win && win.app && win.app.mouse) {
        const r = this.clientRect(win);
        win.app.mouse(win, r, x, y, 'move', 0);
      }
    },

    wheel(x, y, dy) {
      const win = this.hit(x, y);
      if (win && win.app && win.app.wheel) {
        const r = this.clientRect(win);
        win.app.wheel(win, r, x, y, dy);
      }
    },

    key(e) {
      const win = this.focused();
      if (win && win.app && win.app.key && win.app.key(win, e)) return true;
      return false;
    },

    update(dt, t) {
      for (const win of this.wins) {
        if (win.visible && !win.minimized && win.app && win.app.update) win.app.update(win, dt, t);
      }
    },

    close(win) {
      window.Sfx.close();
      this.remove(win);
    },

    minimize(win) { win.minimized = true; },

    closeAll() { this.wins.length = 0; this.focusId = null; },
  };

  function accentOf(win) { return win.accent || '#5a6290'; }

  return { WM, TITLE_H, TASK_H };
})();
