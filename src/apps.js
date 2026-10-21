/* CRACK'D - the other applications: antivirus, file manager, notepad,
   setup wizard, ransom note, virus popups. */
window.Apps = (function () {
  const Pix = window.Pix;
  const C = Pix.C;
  const Data = window.Data;
  const Art = window.Art;
  const G = () => window.GAME;

  /* =====================================================================
     AntiVirus 2003 - the trial expired 14 days ago and never came back
     ===================================================================== */
  const AvApp = {
    title: 'AntiVirus 2003', icon: 'av', w: 300, h: 190, accent: '#2f8f4e',
    init(win) {
      win.state = { scanning: false, progress: 0, results: null, target: null, log: [] };
    },
    draw(ctx, win, r, t) {
      const st = win.state;
      Pix.rect(ctx, r.x, r.y, r.w, r.h, '#0e1a12');
      // header
      Pix.rect(ctx, r.x, r.y, r.w, 20, '#1d5c34');
      Pix.text(ctx, 'AntiVirus 2003', r.x + 6, r.y + 3, { color: '#dff5e4', font: Pix.FONT.bold });
      const exp = Math.floor(t / 600) % 2 === 0;
      Pix.text(ctx, 'TRIAL EXPIRED', r.x + r.w - 90, r.y + 3, { color: exp ? '#ff5f56' : '#ffc94d' });
      // main panel
      Pix.rect(ctx, r.x + 4, r.y + 24, r.w - 8, r.h - 30, '#08110b');
      Pix.frame(ctx, r.x + 4, r.y + 24, r.w - 8, r.h - 30, '#2a5c3c');

      if (G().state.avDisabled) {
        Pix.text(ctx, 'MODULE DISABLED BY USER', r.x + 14, r.y + 34, { color: '#ff5f56', font: Pix.FONT.bold });
        Pix.text(ctx, 'Real-time protection is off.', r.x + 14, r.y + 46, { color: '#cfcbd8' });
        Pix.text(ctx, 'Something you installed asked for this.', r.x + 14, r.y + 56, { color: '#cfcbd8' });
        return;
      }

      if (st.scanning) {
        // scanning animation
        Pix.text(ctx, 'Scanning...', r.x + 14, r.y + 34, { color: '#68dd72', font: Pix.FONT.bold });
        const bx = r.x + 14, by = r.y + 48, bw = r.w - 28, bh = 90;
        Pix.rect(ctx, bx, by, bw, bh, '#04120a');
        Pix.frame(ctx, bx, by, bw, bh, '#2a5c3c');
        // fake file tree
        for (let i = 0; i < 9; i++) {
          Pix.rect(ctx, bx + 6 + (i % 3) * 4, by + 6 + i * 9, 3, 3, '#3e8a5c');
          Pix.text(ctx, ['C:\\WINDOWS\\system32\\dll.dll', 'C:\\WINDOWS\\Temp\\tmp003.dat', 'Downloads\\PixelKnight3000_CRACKED.exe'][i % 3], bx + 12, by + 5 + i * 9, { color: '#4f9c72' });
        }
        const sy = by + ((t / 12) % bh);
        Pix.rect(ctx, bx + 1, sy | 0, bw - 2, 1, '#68dd72');
        Pix.text(ctx, Math.round(st.progress * 100) + '%', r.x + 14, by + bh + 6, { color: '#68dd72' });
        return;
      }

      if (!st.results) {
        Pix.text(ctx, 'No scan running.', r.x + 14, r.y + 34, { color: '#cfcbd8' });
        Pix.text(ctx, 'Select a file in My PC and press SCAN.', r.x + 14, r.y + 44, { color: '#7f8b7f' });
        Pix.text(ctx, 'Your database was last updated in 2004.', r.x + 14, r.y + 54, { color: '#7f8b7f' });
        Pix.text(ctx, 'It knows about 41,000 viruses. There are 400 million now.', r.x + 14, r.y + 64, { color: '#7f8b7f' });
        // upgrade button
        Pix.panel(ctx, r.x + 14, r.y + r.h - 34, 130, 14, '#1d5c34', '#68dd72', '#0a2a16');
        Pix.text(ctx, 'UPGRADE TO PREMIUM (R$ 49,90/yr)', r.x + 19, r.y + r.h - 31, { color: '#eafff0' });
        st._up = { x: r.x + 14, y: r.y + r.h - 34, w: 130, h: 14 };
        return;
      }

      const res = st.results;
      Pix.text(ctx, 'Scan complete.', r.x + 14, r.y + 34, { color: '#68dd72', font: Pix.FONT.bold });
      Pix.text(ctx, res.file, r.x + 14, r.y + 46, { color: '#cfcbd8' });
      let y = r.y + 60;
      if (!res.items.length) {
        Pix.text(ctx, '0 threats found.', r.x + 14, y, { color: '#68dd72' });
        Pix.text(ctx, 'Your file is clean.', r.x + 14, y + 11, { color: '#68dd72' });
        Pix.text(ctx, '(Probably.)', r.x + 14, y + 22, { color: '#7f8b7f' });
        y += 40;
      } else {
        for (const it of res.items) {
          Pix.rect(ctx, r.x + 12, y - 2, r.w - 24, 22, it.quarantined ? '#12301c' : '#2b1414');
          Pix.frame(ctx, r.x + 12, y - 2, r.w - 24, 22, it.quarantined ? '#2a5c3c' : '#6b2a2a');
          Pix.text(ctx, (it.quarantined ? '[ok] ' : '[!] ') + it.name, r.x + 16, y, { color: it.quarantined ? '#68dd72' : '#ff8a80' });
          Pix.text(ctx, it.note, r.x + 16, y + 10, { color: '#9aa89a' });
          if (!it.quarantined) {
            Pix.panel(ctx, r.x + r.w - 62, y + 1, 46, 9, '#2f3550', '#5a6088', '#12142a');
            Pix.text(ctx, 'REMOVE', r.x + r.w - 55, y + 1, { color: '#e9e7e2' });
            res['_rm_' + it.id] = { x: r.x + r.w - 62, y: y + 1, w: 46, h: 9 };
          }
          y += 25;
        }
      }
      if (y > r.y + r.h - 30) y = r.y + r.h - 30;
      Pix.panel(ctx, r.x + 14, r.y + r.h - 34, 130, 14, '#1d5c34', '#68dd72', '#0a2a16');
      Pix.text(ctx, 'UPGRADE TO PREMIUM (R$ 49,90/yr)', r.x + 19, r.y + r.h - 31, { color: '#eafff0' });
      st._up = { x: r.x + 14, y: r.y + r.h - 34, w: 130, h: 14 };
    },
    mouse(win, r, x, y, type) {
      if (type !== 'down') return;
      const st = win.state;
      if (st._up && x >= st._up.x && x <= st._up.x + st._up.w && y >= st._up.y && y <= st._up.y + st._up.h) {
        window.Sfx.click();
        G().openCheckout();
        return;
      }
      if (st.results) {
        for (const it of st.results.items) {
          const b = st.results['_rm_' + it.id];
          if (b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
            window.Sfx.click();
            it.quarantined = true;
            G().state.quarantined++;
            G().toast('Removed: ' + it.name);
          }
        }
      }
    },
    update(win, dt, t) {
      const st = win.state;
      if (!st.scanning) return;
      st.progress = Math.min(1, st.progress + dt * 0.55);
      if (st.progress >= 1) {
        st.scanning = false;
        st.results = G().scanFile(st.target);
        window.Sfx.select();
      }
    },
  };

  /* =====================================================================
     My PC - file explorer
     ===================================================================== */
  const PcApp = {
    title: 'My PC', icon: 'pc', w: 330, h: 200, accent: '#2b6fd4',
    init(win) {
      win.state = { folder: 'downloads', selected: null };
    },
    draw(ctx, win, r, t) {
      const st = win.state;
      Pix.rect(ctx, r.x, r.y, r.w, r.h, '#1b1f33');
      // toolbar
      Pix.rect(ctx, r.x, r.y, r.w, 14, '#20263c');
      Pix.text(ctx, 'Address:', r.x + 5, r.y + 3, { color: '#9b958c' });
      Pix.inset(ctx, r.x + 44, r.y + 2, 180, 11, '#0a0f1c', '#2a3350', '#48507a');
      const addr = st.folder === 'downloads' ? 'C:\\My Documents\\Downloads'
        : st.folder === 'programs' ? 'C:\\Program Files'
          : st.folder === 'docs' ? 'C:\\My Documents' : 'Desktop';
      Pix.text(ctx, addr, r.x + 48, r.y + 3, { color: '#cfe3ff' });
      // tree
      const tw = 96;
      Pix.rect(ctx, r.x + 2, r.y + 16, tw, r.h - 18, '#151a2c');
      Pix.frame(ctx, r.x + 2, r.y + 16, tw, r.h - 18, '#39405e');
      const tree = [
        { id: 'desktop', label: 'Desktop' },
        { id: 'docs', label: 'My Documents' },
        { id: 'downloads', label: 'Downloads' },
        { id: 'programs', label: 'Program Files' },
      ];
      tree.forEach((n, i) => {
        const y = r.y + 20 + i * 11;
        Art.draw(ctx, Art.ICONS.folder, r.x + 5, y - 1, false);
        Pix.text(ctx, n.label, r.x + 23, y, { color: st.folder === n.id ? '#ffc94d' : '#c3c6d4' });
        st['_t_' + n.id] = { x: r.x + 4, y: y - 2, w: tw - 4, h: 11 };
      });
      // file list
      const lx = r.x + tw + 4, lw = r.w - tw - 8;
      Pix.rect(ctx, lx, r.y + 16, lw, r.h - 18, '#12162a');
      Pix.frame(ctx, lx, r.y + 16, lw, r.h - 18, '#39405e');
      let y = r.y + 20;
      const files = this.filesFor(st.folder);
      if (!files.length) {
        Pix.text(ctx, 'This folder is empty.', lx + 8, y + 6, { color: '#6a655e' });
        Pix.text(ctx, 'Nothing to see here. Yet.', lx + 8, y + 18, { color: '#4a4f6b' });
      }
      files.forEach((f) => {
        const sel = st.selected === f.id;
        if (sel) Pix.rect(ctx, lx + 3, y - 1, lw - 6, 11, 'rgba(105,150,255,0.28)');
        Art.draw(ctx, Art.ICONS[f.icon], lx + 5, y - 1, false);
        Pix.text(ctx, f.name, lx + 23, y, { color: sel ? '#ffffff' : '#d5d8e6' });
        Pix.text(ctx, f.size, lx + lw - 6, y, { color: '#6a655e', align: 'right' });
        st['_f_' + f.id] = { x: lx + 3, y: y - 1, w: lw - 6, h: 11 };
        y += 12;
      });
      // details pane
      const dy = r.y + r.h - 46;
      Pix.rect(ctx, lx, dy, lw, 44, '#171c30');
      Pix.frame(ctx, lx, dy, lw, 44, '#39405e');
      const f = files.find((x) => x.id === st.selected);
      if (f) {
        Pix.text(ctx, f.name, lx + 6, dy + 4, { color: '#ffc94d', font: Pix.FONT.bold });
        Pix.text(ctx, 'type: ' + f.type, lx + 6, dy + 16, { color: '#9b958c' });
        Pix.text(ctx, 'size: ' + f.size, lx + 120, dy + 16, { color: '#9b958c' });
        if (f.md5) Pix.text(ctx, 'md5: ' + f.md5, lx + 6, dy + 26, { color: '#63b3ff' });
        if (f.md5) {
          const known = G().state.knowsHash;
          Pix.text(ctx, known ? (f.md5 === Data.GOOD_HASH ? 'community hash: MATCH' : 'community hash: no match') : 'community hash: unknown (read the forum)',
            lx + 6, dy + 35, { color: known ? (f.md5 === Data.GOOD_HASH ? '#68dd72' : '#ff5f56') : '#6a655e' });
        }
        if (f.actions) {
          let bx = lx + 6;
          for (const a of f.actions) {
            Pix.panel(ctx, bx, dy + 44 - 12, a.label.length * 4 + 12, 0, '#2f3550', '#5a6088', '#12142a');
            Pix.panel(ctx, bx, dy + 44 - 14, a.label.length * 4 + 12, 11, '#2f3550', '#5a6088', '#12142a');
            Pix.text(ctx, a.label, bx + 6, dy + 44 - 12, { color: '#e9e7e2' });
            st['_a_' + a.id] = { x: bx, y: dy + 44 - 14, w: a.label.length * 4 + 12, h: 11 };
            bx += a.label.length * 4 + 18;
          }
        }
      } else {
        Pix.text(ctx, 'Select a file to see its details.', lx + 6, dy + 6, { color: '#6a655e' });
      }
    },
    filesFor(folder) {
      const st = G().state;
      if (folder === 'downloads') {
        return st.downloads.map((d) => ({
          id: 'dl_' + d.id, name: d.name, size: d.size, icon: 'file', type: 'Application (pirated)',
          md5: d.actualMd5,
          actions: [
            { id: 'scan_' + d.id, label: 'SCAN' },
            { id: 'run_' + d.id, label: 'RUN' },
          ],
        }));
      }
      if (folder === 'programs') {
        return st.installed ? [{ id: 'prog', name: 'Pixel Knight 3000', size: '2.1 GB', icon: 'game', type: 'Application', actions: [{ id: 'play', label: 'PLAY' }] }] : [];
      }
      if (folder === 'docs') {
        return [{ id: 'doc1', name: 'todo.txt', size: '1 KB', icon: 'file', type: 'Text Document' }];
      }
      return [{ id: 'shortcut', name: 'WebCruiser 98', size: '2 MB', icon: 'browser', type: 'Shortcut' }];
    },
    mouse(win, r, x, y, type) {
      if (type !== 'down') return;
      const st = win.state;
      for (const k of ['desktop', 'docs', 'downloads', 'programs']) {
        const b = st['_t_' + k];
        if (b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
          window.Sfx.click();
          st.folder = k;
          st.selected = null;
          return;
        }
      }
      const files = this.filesFor(st.folder);
      for (const f of files) {
        const b = st['_f_' + f.id];
        if (b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
          window.Sfx.click();
          st.selected = f.id;
          return;
        }
        if (f.actions) {
          for (const a of f.actions) {
            const ab = st['_a_' + a.id];
            if (ab && x >= ab.x && x <= ab.x + ab.w && y >= ab.y && y <= ab.y + ab.h) {
              window.Sfx.click();
              G().fileAction(a.id);
              return;
            }
          }
        }
      }
    },
  };

  /* =====================================================================
     Notepad
     ===================================================================== */
  const NotesApp = {
    title: 'Notepad', icon: 'notes', w: 280, h: 190, accent: '#5a6290',
    init(win) {
      win.state = { file: 'todo', scroll: 0, scratch: '', caret: 0 };
    },
    draw(ctx, win, r, t) {
      const st = win.state;
      Pix.rect(ctx, r.x, r.y, r.w, r.h, '#e8e6e0');
      Pix.rect(ctx, r.x, r.y, r.w, 14, '#20263c');
      const files = [['todo', 'todo.txt'], ['scratch', 'scratch.txt']];
      let mx = r.x + 4;
      for (const f of files) {
        const w = Pix.measure(ctx, f[1], Pix.FONT.body) + 10;
        const on = st.file === f[0];
        Pix.panel(ctx, mx, r.y + 1, w, 12, on ? '#4a5070' : '#2f3550', '#5a6088', '#12142a');
        Pix.text(ctx, f[1], mx + 5, r.y + 3, { color: on ? '#ffffff' : '#b9b6c4' });
        st['_f_' + f[0]] = { x: mx, y: r.y + 1, w, h: 12 };
        mx += w + 3;
      }
      Pix.text(ctx, 'unsaved changes', r.x + r.w - 6, r.y + 3, { color: '#8b86a0', align: 'right' });
      const bx = r.x + 3, by = r.y + 17, bw = r.w - 6, bh = r.h - 21;
      Pix.rect(ctx, bx, by, bw, bh, '#ffffff');
      Pix.frame(ctx, bx, by, bw, bh, '#8b86a0');
      const lines = st.file === 'todo' ? [
        'TODO (sábado):',
        '',
        '  [x] abrir o fórum',
        '  [ ] achar um site confiável',
        '  [ ] baixar o jogo',
        '  [ ] NÃO baixar o keygen do site com',
        '      o keygen do site com o keygen',
        '  [ ] conferir o md5 antes de abrir',
        '  [ ] ...conferir o md5 depois de abrir',
        '      (tarde demais)',
        '',
        'COMPRAR O JOGO NO DIA SEGUINTE:',
        '  R$ 79,90 (o jogo original)',
        '  R$ 0,00 (o jogo pirata)',
        '  R$ 0,00 (o computador doido)',
        '',
        'obs: o md5 do post confiavel é o unico',
        'que importa. os selos de "100% seguro"',
        'são escritos pelo cara do virus.',
      ] : (st.scratch ? st.scratch.split('\n') : ['(clique aqui e digite alguma coisa)']);
      ctx.save();
      ctx.beginPath();
      ctx.rect(bx + 2, by + 2, bw - 4, bh - 4);
      ctx.clip();
      let y = by + 4;
      for (const ln of lines) {
        const isHash = ln.includes('md5');
        Pix.text(ctx, ln, bx + 5, y, { color: isHash ? '#0a5a2a' : '#1a1a1a' });
        y += 10;
      }
      if (st.file === 'scratch' && Math.floor(t / 400) % 2 === 0) {
        Pix.rect(ctx, bx + 5, y, 1, 8, '#1a1a1a');
      }
      ctx.restore();
    },
    mouse(win, r, x, y, type) {
      if (type !== 'down') return;
      const st = win.state;
      for (const k of ['todo', 'scratch']) {
        const b = st['_f_' + k];
        if (b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
          window.Sfx.click();
          st.file = k;
        }
      }
    },
    key(win, e) {
      const st = win.state;
      if (st.file !== 'scratch') return false;
      if (e.key === 'Backspace') { st.scratch = st.scratch.slice(0, -1); return true; }
      if (e.key === 'Enter') { st.scratch += '\n'; return true; }
      if (e.key.length === 1) { st.scratch += e.key; window.Sfx.type(); return true; }
      return false;
    },
  };

  /* =====================================================================
     Setup wizard
     ===================================================================== */
  const EULA = [
    'END USER LICENSE AGREEMENT',
    '',
    'IMPORTANT: READ THIS AGREEMENT CAREFULLY. IT IS 47 PAGES LONG',
    'AND THE IMPORTANT PART IS IN FONT SIZE 4 AT THE BOTTOM.',
    '',
    '1. You agree that this software is a "personal use license".',
    '2. You agree not to redistribute it, sell it, or show it to',
    '   your friends, because the keygen is a keygen.',
    '3. You agree that the company may not exist.',
    '4. You agree that the company may contact you. The company',
    '   is a gmail address.',
    '5. You agree that all sound effects are 8-bit.',
    '6. You agree that this agreement is not a contract, because',
    '   it is a text file on a download site.',
    '',
    'PAGE 47: BY CLICKING "NEXT" YOU AGREE TO EVERYTHING ABOVE,',
    'WHATEVER IT IS, INCLUDING THE PARTS YOU DID NOT READ.',
    'IF YOU DID NOT READ THIS, THAT IS FINE. NOBODY DOES.',
  ];

  const SetupApp = {
    title: 'PixelKnight3000 Setup', icon: 'game', w: 330, h: 210, accent: '#2f6f4e',
    init(win) {
      win.state = {
        step: 0, progress: 0, accepted: false, running: false, done: false,
        junk: { coupon: true, toolbar: true, wallpaper: true }, eulaScroll: 0, blocked: false,
      };
    },
    draw(ctx, win, r, t) {
      const st = win.state;
      const site = st.site, link = st.link;
      Pix.rect(ctx, r.x, r.y, r.w, r.h, '#ece9e2');
      Pix.rect(ctx, r.x, r.y, r.w, 16, '#2f6f4e');
      Pix.text(ctx, 'PIXEL KNIGHT 3000 - Setup Wizard', r.x + 6, r.y + 3, { color: '#ffffff', font: Pix.FONT.bold });
      const bx = r.x + 4, by = r.y + 20, bw = r.w - 8, bh = r.h - 24;
      Pix.rect(ctx, bx, by, bw, bh, '#ffffff');
      Pix.frame(ctx, bx, by, bw, bh, '#9a978f');

      if (st.blocked) {
        Pix.text(ctx, 'AntiVirus 2003 has blocked this program.', bx + 12, by + 12, { color: '#a01818', font: Pix.FONT.bold });
        Pix.text(ctx, 'Threat: HackTool.Win32.Keygen', bx + 12, by + 26, { color: '#333' });
        Pix.text(ctx, 'Risk: Medium   (it is a keygen. that is the job.)', bx + 12, by + 38, { color: '#555' });
        Pix.text(ctx, 'To continue you must disable real-time protection.', bx + 12, by + 56, { color: '#333' });
        Pix.panel(ctx, bx + 12, by + 72, 130, 14, '#a01818', '#e06060', '#500808');
        Pix.text(ctx, 'DISABLE ANTIVIRUS', bx + 20, by + 75, { color: '#ffffff' });
        st._dis = { x: bx + 12, y: by + 72, w: 130, h: 14 };
        Pix.panel(ctx, bx + 152, by + 72, 90, 14, '#d8d5ce', '#ffffff', '#8b887f');
        Pix.text(ctx, 'CANCEL', bx + 168, by + 75, { color: '#222' });
        st._can = { x: bx + 152, y: by + 72, w: 90, h: 14 };
        return;
      }

      if (st.step === 0) {
        Art.draw(ctx, Art.ICONS.game, bx + 12, by + 14, false);
        Pix.bigText(ctx, 'PIXEL KNIGHT 3000', bx + 36, by + 12, { scale: 1, color: '#2f6f4e' });
        Pix.text(ctx, 'Welcome to the Pixel Knight 3000 Setup Wizard.', bx + 36, by + 28, { color: '#333' });
        Pix.text(ctx, 'This wizard will install the game on your computer.', bx + 36, by + 40, { color: '#333' });
        Pix.text(ctx, 'It will also install whatever the site owner felt', bx + 12, by + 70, { color: '#777' });
        Pix.text(ctx, 'like adding to it. That part is not in the wizard.', bx + 12, by + 80, { color: '#777' });
      } else if (st.step === 1) {
        Pix.text(ctx, 'End-User License Agreement', bx + 8, by + 6, { color: '#2f6f4e', font: Pix.FONT.bold });
        Pix.rect(ctx, bx + 8, by + 18, bw - 16, bh - 60, '#f4f2ec');
        Pix.frame(ctx, bx + 8, by + 18, bw - 16, bh - 60, '#c0bdb4');
        ctx.save();
        ctx.beginPath();
        ctx.rect(bx + 9, by + 19, bw - 18, bh - 62);
        ctx.clip();
        let ey = by + 22 - st.eulaScroll;
        for (const ln of EULA) {
          Pix.text(ctx, ln, bx + 12, ey, { color: ln.startsWith('PAGE') ? '#a01818' : '#333' });
          ey += 10;
        }
        ctx.restore();
        Pix.text(ctx, 'scroll to read the 47 pages', bx + 12, by + bh - 38, { color: '#999' });
        st._scroll = { x: bx + 8, y: by + 18, w: bw - 16, h: bh - 60 };
        Pix.text(ctx, st.accepted ? '(o) I accept' : '( ) I accept', bx + 12, by + bh - 26, { color: '#333' });
        st._acc = { x: bx + 12, y: by + bh - 27, w: 70, h: 11 };
      } else if (st.step === 2) {
        Pix.text(ctx, 'Choose destination location', bx + 8, by + 8, { color: '#2f6f4e', font: Pix.FONT.bold });
        Pix.inset(ctx, bx + 8, by + 20, bw - 100, 12, '#ffffff', '#9a978f', '#ffffff');
        Pix.text(ctx, 'C:\\Program Files\\PixelKnight3000', bx + 12, by + 22, { color: '#333' });
        if (link && link.bundled) {
          Pix.text(ctx, 'Additional shortcuts to place:', bx + 8, by + 42, { color: '#2f6f4e', font: Pix.FONT.bold });
          const opts = [
            ['coupon', 'Also install Coupon Buddy (recommended)'],
            ['toolbar', 'Also install Browser Toolbar & Optimizer Pro'],
            ['wallpaper', 'Also install "Cool Wallpapers 2003"'],
          ];
          opts.forEach((o, i) => {
            const y = by + 56 + i * 12;
            Pix.text(ctx, st.junk[o[0]] ? '[x]' : '[ ]', bx + 12, y, { color: '#333' });
            Pix.text(ctx, o[1], bx + 28, y, { color: st.junk[o[0]] ? '#333' : '#777' });
            st['_o_' + o[0]] = { x: bx + 10, y: y - 1, w: bw - 40, h: 11 };
          });
          Pix.text(ctx, 'These are bundled by the download site. You can untick them.', bx + 12, by + 96, { color: '#a06000' });
          Pix.text(ctx, 'Most people do not untick them. Most people.', bx + 12, by + 106, { color: '#a06000' });
        } else {
          Pix.text(ctx, 'This installer is clean. It has no options.', bx + 12, by + 44, { color: '#3a7a3a' });
          Pix.text(ctx, 'Suspicious. But yes.', bx + 12, by + 56, { color: '#3a7a3a' });
        }
      } else if (st.step === 3) {
        Pix.text(ctx, 'Installing...', bx + 8, by + 8, { color: '#2f6f4e', font: Pix.FONT.bold });
        const files = [
          'PixelKnight3000.exe', 'PixelKnight3000_Data\\assets.pack', 'crack\\keygen.dll',
          'crack\\loader.exe', 'crack\\activator.sys', 'setup_helper.exe', 'couponbuddy_setup.exe',
        ];
        const shown = Math.floor(st.progress * files.length);
        for (let i = 0; i < shown; i++) {
          Pix.text(ctx, 'Copying file: ' + files[i], bx + 12, by + 24 + i * 10, { color: '#333' });
        }
        Pix.inset(ctx, bx + 8, by + bh - 40, bw - 16, 12, '#e4e1da', '#9a978f', '#ffffff');
        Pix.rect(ctx, bx + 9, by + bh - 39, Math.round((bw - 18) * st.progress), 10, '#2f6f4e');
        Pix.text(ctx, Math.round(st.progress * 100) + '%', bx + 12, by + bh - 22, { color: '#333' });
        if (st.progress > 0.75 && st.junk.coupon) {
          Pix.text(ctx, 'Copying file: couponbuddy_setup.exe', bx + 12, by + 24 + shown * 10, { color: '#a01818' });
        }
      } else if (st.step === 4) {
        Art.draw(ctx, Art.ICONS.game, bx + 12, by + 16, false);
        Pix.bigText(ctx, 'SETUP COMPLETE', bx + 40, by + 14, { scale: 1, color: '#2f6f4e' });
        Pix.text(ctx, 'The game has been installed to:', bx + 12, by + 44, { color: '#333' });
        Pix.text(ctx, 'C:\\Program Files\\PixelKnight3000', bx + 12, by + 56, { color: '#555' });
        Pix.text(ctx, 'We hope you enjoy playing PIXEL KNIGHT 3000!', bx + 12, by + 74, { color: '#333' });
        if (site && site.id === 'gamerz') {
          Pix.text(ctx, '(the keygen is in the folder. the keygen is the problem.)', bx + 12, by + 92, { color: '#a06000' });
        }
      }

      // buttons
      const byy = r.y + r.h - 22;
      if (st.step > 0 && st.step < 4) {
        Pix.panel(ctx, r.x + r.w - 100, byy, 42, 14, '#d8d5ce', '#ffffff', '#8b887f');
        Pix.text(ctx, '< Back', r.x + r.w - 95, byy + 3, { color: '#222' });
        st._back = { x: r.x + r.w - 100, y: byy, w: 42, h: 14 };
      }
      if (st.step === 0 || st.step === 2) {
        Pix.panel(ctx, r.x + r.w - 54, byy, 46, 14, '#2f6f4e', '#68dd72', '#0a2a16');
        Pix.text(ctx, 'Next >', r.x + r.w - 44, byy + 3, { color: '#ffffff' });
        st._next = { x: r.x + r.w - 54, y: byy, w: 46, h: 14 };
      } else if (st.step === 1) {
        Pix.panel(ctx, r.x + r.w - 54, byy, 46, 14, st.accepted ? '#2f6f4e' : '#d8d5ce', '#ffffff', '#8b887f');
        Pix.text(ctx, 'Next >', r.x + r.w - 44, byy + 3, { color: st.accepted ? '#ffffff' : '#999' });
        st._next = { x: r.x + r.w - 54, y: byy, w: 46, h: 14 };
      } else if (st.step === 4) {
        Pix.panel(ctx, r.x + r.w - 54, byy, 46, 14, '#2f6f4e', '#68dd72', '#0a2a16');
        Pix.text(ctx, 'Finish', r.x + r.w - 44, byy + 3, { color: '#ffffff' });
        st._next = { x: r.x + r.w - 54, y: byy, w: 46, h: 14 };
      }
      Pix.panel(ctx, r.x + r.w - 108, byy, 46, 14, '#d8d5ce', '#ffffff', '#8b887f');
      Pix.text(ctx, 'Cancel', r.x + r.w - 100, byy + 3, { color: '#222' });
      st._cancel = { x: r.x + r.w - 108, y: byy, w: 46, h: 14 };
    },
    mouse(win, r, x, y, type, btn) {
      if (type !== 'down') return;
      const st = win.state;
      const hit = (b) => b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
      if (st.blocked) {
        if (hit(st._dis)) {
          window.Sfx.click();
          G().state.avDisabled = true;
          st.blocked = false;
          G().toast('AntiVirus 2003 disabled. Permanently.', '#ff5f56');
        } else if (hit(st._can)) {
          window.Sfx.deny();
          G().closeWindow(win);
        }
        return;
      }
      if (st._acc && hit(st._acc)) { st.accepted = true; window.Sfx.click(); return; }
      for (const k of ['coupon', 'toolbar', 'wallpaper']) {
        if (st['_o_' + k] && hit(st['_o_' + k])) { st.junk[k] = !st.junk[k]; window.Sfx.click(); return; }
      }
      if (hit(st._cancel)) { window.Sfx.deny(); G().closeWindow(win); return; }
      if (hit(st._back)) { st.step--; window.Sfx.back(); return; }
      if (hit(st._next)) {
        if (st.step === 1 && !st.accepted) { window.Sfx.deny(); G().toast('You must accept the agreement.'); return; }
        window.Sfx.click();
        if (st.step === 0) { st.step = 1; G().advanceTime(1); return; }
        if (st.step === 1) { st.step = 2; G().advanceTime(1); return; }
        if (st.step === 2) { st.step = 3; st.progress = 0; window.Sfx.dial(); G().advanceTime(8); return; }
        if (st.step === 4) { G().finishInstall(win); return; }
      }
    },
    wheel(win, r, x, y, dy) {
      const st = win.state;
      if (st.step === 1) st.eulaScroll = Math.max(0, st.eulaScroll + dy * 14);
    },
    update(win, dt, t) {
      const st = win.state;
      if (st.step !== 3) return;
      st.progress = Math.min(1, st.progress + dt * 0.28);
      if (st.progress >= 1) {
        st.step = 4;
        window.Sfx.modemStop();
        window.Sfx.win();
      }
    },
  };

  /* =====================================================================
     Ransom note
     ===================================================================== */
  const RansomApp = {
    title: '!!! READ ME !!!', icon: 'skull', w: 300, h: 180, accent: '#a01818', modal: true,
    init(win) { win.state = { left: 600, paid: false }; },
    draw(ctx, win, r, t) {
      const st = win.state;
      Pix.rect(ctx, r.x, r.y, r.w, r.h, '#0a0a0a');
      for (let i = 0; i < 40; i++) {
        Pix.rect(ctx, r.x + (i * 37) % r.w, r.y + (i * 53) % r.h, 2, 2, '#2a0505');
      }
      Pix.text(ctx, 'YOUR FILES HAVE BEEN ENCRYPTED', r.x + 10, r.y + 8, { color: '#ff3b30', font: Pix.FONT.bold });
      Art.draw(ctx, Art.ICONS.skull, r.x + 10, r.y + 22, false);
      const lines = [
        'All your important files have been encrypted',
        'with a military grade algorithm (rot13).',
        '',
        'Photos. Documents. The game you never finished.',
        'Your 4 years of unsaved game saves.',
        '',
        'To restore them, send 0.05 BTC to:',
      ];
      lines.forEach((l, i) => Pix.text(ctx, l, r.x + 34, r.y + 22 + i * 9, { color: '#e8e6e3' }));
      Pix.rect(ctx, r.x + 34, r.y + 92, 120, 11, '#1a1a1a');
      Pix.frame(ctx, r.x + 34, r.y + 92, 120, 11, '#ff3b30');
      Pix.text(ctx, 'BC1Q_THE_SHARK_WALLET', r.x + 38, r.y + 93, { color: '#ff9d9d' });
      // fake QR
      const qx = r.x + 168, qy = r.y + 92;
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if ((i * 7 + j * 13) % 3 !== 1) Pix.rect(ctx, qx + i * 5, qy + j * 5, 5, 5, '#ffffff');
        }
      }
      Pix.frame(ctx, qx, qy, 40, 40, '#ff3b30');
      const mm = Math.floor(st.left / 60), ss = st.left % 60;
      Pix.text(ctx, 'TIME LEFT: ' + mm + ':' + (ss < 10 ? '0' : '') + ss, r.x + 10, r.y + r.h - 42, { color: '#ff3b30' });
      Pix.text(ctx, 'the price goes up every minute. it always does.', r.x + 10, r.y + r.h - 30, { color: '#8a6a6a' });
      Pix.panel(ctx, r.x + 10, r.y + r.h - 24, 120, 14, '#8a1010', '#ff5f56', '#300404');
      Pix.text(ctx, 'PAY NOW (PIX)', r.x + 40, r.y + r.h - 21, { color: '#ffffff', font: Pix.FONT.bold });
      st._pay = { x: r.x + 10, y: r.y + r.h - 24, w: 120, h: 14 };
      Pix.panel(ctx, r.x + 140, r.y + r.h - 24, 140, 14, '#1a1a1a', '#3a3a3a', '#000');
      Pix.text(ctx, 'I HAVE NO MONEY', r.x + 165, r.y + r.h - 21, { color: '#8a8a8a' });
      st._no = { x: r.x + 140, y: r.y + r.h - 24, w: 140, h: 14 };
    },
    mouse(win, r, x, y, type) {
      if (type !== 'down') return;
      const st = win.state;
      const hit = (b) => b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
      if (hit(st._pay)) {
        window.Sfx.error();
        G().toast('PIX refused: insufficient balance. It knows.', '#ff5f56');
        G().endGame('ransom');
      } else if (hit(st._no)) {
        window.Sfx.close();
        G().endGame('ransom');
      }
    },
    update(win, dt) {
      win.state.left = Math.max(0, win.state.left - dt);
    },
  };

  /* =====================================================================
     Virus pop-up
     ===================================================================== */
  const PopupApp = {
    title: '', icon: 'virus', w: 200, h: 120, accent: '#a01818', noTask: false,
    init(win) {
      const kind = win.state.kind || 'ad';
      win.state.nag = 0;
      win.state.kind = kind;
    },
    draw(ctx, win, r, t) {
      const st = win.state;
      Pix.rect(ctx, r.x, r.y, r.w, r.h, '#1a0000');
      Pix.frame(ctx, r.x, r.y, r.w, r.h, '#ff3b30');
      if (st.kind === 'ad') {
        Pix.text(ctx, '*** YOUR PC IS INFECTED! ***', r.x + 8, r.y + 26, { color: '#ff5f56', font: Pix.FONT.bold });
        Pix.text(ctx, 'We found 12 viruses! Click here to', r.x + 8, r.y + 42, { color: '#e8e6e3' });
        Pix.text(ctx, 'install the FIX now. Only R$ 19,90.', r.x + 8, r.y + 52, { color: '#e8e6e3' });
        Pix.panel(ctx, r.x + 8, r.y + 70, 80, 14, '#8a1010', '#ff5f56', '#300404');
        Pix.text(ctx, 'FIX IT NOW', r.x + 22, r.y + 73, { color: '#ffffff' });
        st._fix = { x: r.x + 8, y: r.y + 70, w: 80, h: 14 };
      } else if (st.kind === 'coupon') {
        Pix.text(ctx, 'CONGRATULATIONS!!', r.x + 8, r.y + 26, { color: '#ffe14d', font: Pix.FONT.bold });
        Pix.text(ctx, 'You are the 500,000th visitor!', r.x + 8, r.y + 42, { color: '#e8e6e3' });
        Pix.text(ctx, 'Claim your FREE coupon and save', r.x + 8, r.y + 52, { color: '#e8e6e3' });
        Pix.text(ctx, '50% on everything. Everything.', r.x + 8, r.y + 62, { color: '#e8e6e3' });
        Pix.panel(ctx, r.x + 8, r.y + 74, 60, 14, '#7a5a10', '#ffc94d', '#2a1c04');
        Pix.text(ctx, 'CLAIM', r.x + 22, r.y + 77, { color: '#201800' });
        st._fix = { x: r.x + 8, y: r.y + 74, w: 60, h: 14 };
      } else {
        Pix.text(ctx, 'HOT DEAL!! 90% OFF!!', r.x + 8, r.y + 30, { color: '#ff7eb6', font: Pix.FONT.bold });
        Pix.text(ctx, 'Only for you! Only today!', r.x + 8, r.y + 48, { color: '#e8e6e3' });
        Pix.text(ctx, '(it is always only today)', r.x + 8, r.y + 58, { color: '#8a6a8a' });
        Pix.panel(ctx, r.x + 8, r.y + 74, 60, 14, '#5a1a4a', '#ff7eb6', '#200818');
        Pix.text(ctx, 'BUY', r.x + 26, r.y + 77, { color: '#ffffff' });
        st._fix = { x: r.x + 8, y: r.y + 74, w: 60, h: 14 };
      }
      // broken close button
      Pix.panel(ctx, r.x + r.w - 13, r.y + 3, 9, 9, '#5a1010', '#a03030', '#200404');
      Pix.text(ctx, 'x', r.x + r.w - 9, r.y + 4, { color: '#ff9d9d' });
      st._x = { x: r.x + r.w - 13, y: r.y + 3, w: 9, h: 9 };
    },
    mouse(win, r, x, y, type) {
      if (type !== 'down') return;
      const st = win.state;
      const hit = (b) => b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
      if (hit(st._x)) {
        window.Sfx.error();
        st.nag++;
        G().toast('The X button does not work. Try again. It will not work again.');
        if (st.nag > 4) G().closeWindow(win);
        return;
      }
      if (hit(st._fix)) {
        window.Sfx.click();
        G().toast('Redirecting to a very safe website...', '#ffc94d');
        G().advanceTime(2);
        G().closeWindow(win);
      }
    },
  };

  /* =====================================================================
     Checkout (the fake store that steals your card)
     ===================================================================== */
  const CheckoutApp = {
    title: 'Secure Checkout', icon: 'av', w: 280, h: 170, accent: '#2f8f4e', modal: true,
    init(win) { win.state = { name: '', card: '', cvv: '', stage: 0 }; },
    draw(ctx, win, r, t) {
      const st = win.state;
      Pix.rect(ctx, r.x, r.y, r.w, r.h, '#f2f0ea');
      Pix.rect(ctx, r.x, r.y, r.w, 18, '#2f8f4e');
      Pix.text(ctx, 'AntiVirus PREMIUM 2004 - Secure Checkout', r.x + 6, r.y + 4, { color: '#ffffff', font: Pix.FONT.bold });
      if (st.stage === 0) {
        Pix.text(ctx, 'Everything you need to be safe online.', r.x + 12, r.y + 26, { color: '#333' });
        Pix.text(ctx, 'Annual subscription: R$ 49,90 / 12 months', r.x + 12, r.y + 38, { color: '#333' });
        const fields = [['name', 'name on card'], ['card', 'card number'], ['cvv', 'cvv']];
        fields.forEach((f, i) => {
          const y = r.y + 54 + i * 16;
          Pix.text(ctx, f[1], r.x + 12, y, { color: '#555' });
          Pix.inset(ctx, r.x + 100, y - 2, 160, 12, '#ffffff', '#9a978f', '#ffffff');
          Pix.text(ctx, st[f[0]], r.x + 104, y, { color: '#222' });
          st['_f_' + f[0]] = { x: r.x + 100, y: y - 2, w: 160, h: 12 };
        });
        Pix.panel(ctx, r.x + 12, r.y + r.h - 24, 90, 14, '#2f8f4e', '#68dd72', '#0a2a16');
        Pix.text(ctx, 'PAY R$ 49,90', r.x + 26, r.y + r.h - 21, { color: '#ffffff' });
        st._pay = { x: r.x + 12, y: r.y + r.h - 24, w: 90, h: 14 };
        Pix.text(ctx, 'cancel', r.x + 120, r.y + r.h - 20, { color: '#0000ee' });
        st._no = { x: r.x + 120, y: r.y + r.h - 24, w: 50, h: 14 };
      } else {
        Pix.text(ctx, 'PROCESSING PAYMENT...', r.x + 12, r.y + 40, { color: '#2f8f4e', font: Pix.FONT.bold });
        Pix.text(ctx, 'do not close this window', r.x + 12, r.y + 56, { color: '#555' });
      }
    },
    mouse(win, r, x, y, type) {
      if (type !== 'down' || win.state.stage === 1) return;
      const st = win.state;
      const hit = (b) => b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
      if (hit(st._pay)) {
        window.Sfx.click();
        st.stage = 1;
        G().state.moneyLost = 49.9;
        setTimeout(() => G().endGame('av'), 900);
        return;
      }
      if (hit(st._no)) { window.Sfx.deny(); G().closeWindow(win); return; }
      for (const k of ['name', 'card', 'cvv']) {
        const b = st['_f_' + k];
        if (b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) { st.focus = k; window.Sfx.click(); }
      }
    },
    key(win, e) {
      const st = win.state;
      if (!st.focus) return false;
      if (e.key === 'Backspace') { st[st.focus] = st[st.focus].slice(0, -1); return true; }
      if (e.key.length === 1) { st[st.focus] += e.key; window.Sfx.type(); return true; }
      return false;
    },
  };

  return { AvApp, PcApp, NotesApp, SetupApp, RansomApp, PopupApp, CheckoutApp, EULA };
})();
