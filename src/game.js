/* CRACK'D - main game: state, screens, infections, endings, loop. */
window.GAME = (function () {
  const Pix = window.Pix;
  const C = Pix.C;
  const Data = window.Data;
  const Art = window.Art;
  const Sfx = window.Sfx;
  const WM = window.OS.WM;

  const START_CLOCK = 14 * 60;      // saturday 14:00
  const DEADLINE = 36 * 60;         // sunday 12:00
  const DRIFT = 1 / 60;             // 1 game-minute per real second

  const state = {
    phase: 'boot',
    clock: START_CLOCK,
    deadline: DEADLINE,
    health: 100,
    infections: [],
    downloads: [],
    installed: false,
    installedViruses: [],
    knowsHash: false,
    seenReplies: {},
    verify: {},
    avDisabled: false,
    quarantined: 0,
    moneyLost: 0,
    rootkit: false,
    toast: null,
    popupTimer: 12,
    ransomTimer: -1,
    keylogTimer: -1,
    help: false,
    started: false,
    stats: { sites: 0, viruses: 0, downloads: 0, minutes: 0, pops: 0 },
    bootT: 0,
  };

  let canvas, ctx, mouse = { x: 240, y: 135, down: false };
  let last = 0;
  let fade = 0, fadeDir = 0, pendingPhase = null;

  /* ------------------------------------------------------------------ */
  /* helpers                                                             */
  /* ------------------------------------------------------------------ */

  function toast(msg, color) {
    state.toast = { text: msg, color: color || '#ffc94d', t: 3.2 };
  }

  function advanceTime(mins) {
    if (state.phase !== 'desktop') return;
    state.clock += mins;
    state.stats.minutes += mins;
    if (state.clock >= state.deadline) {
      state.clock = state.deadline;
      endGame('timeout');
    }
    updateClockLabel();
  }

  function clockLabel() {
    const total = Math.floor(state.clock);
    const day = total >= 1440 ? 'SUN' : 'SAT';
    const m = total % 1440;
    const hh = String(Math.floor(m / 60)).padStart(2, '0');
    const mm = String(m % 60).padStart(2, '0');
    return day + ' ' + hh + ':' + mm;
  }

  function updateClockLabel() {
    WM.status.clock = clockLabel();
  }

  function siteById(id) { return Data.SITES.find((s) => s.id === id); }

  function openWindow(app, opts) {
    opts = opts || {};
    const win = WM.add({
      app,
      title: opts.title || app.title,
      icon: opts.icon || app.icon,
      x: opts.x === undefined ? Math.round((480 - app.w) / 2) + (WM.wins.length % 3) * 12 : opts.x,
      y: opts.y === undefined ? 18 + (WM.wins.length % 3) * 14 : opts.y,
      w: opts.w || app.w,
      h: opts.h || app.h,
      accent: opts.accent || app.accent,
      state: {},
    });
    if (opts.data) Object.assign(win.state, opts.data);
    return win;
  }

  function closeWindow(win) { WM.remove(win); }

  function findWindow(app) { return WM.wins.find((w) => w.app === app); }

  function openApp(key) {
    if (key === 'browser') {
      const w = findWindow(window.BrowserApp);
      if (w) { WM.focus(w); return w; }
      const win = openWindow(window.BrowserApp, { x: 16, y: 12 });
      window.GAME.browser = window.BrowserApp;
      return win;
    }
    if (key === 'pc') {
      const w = findWindow(window.Apps.PcApp);
      if (w) { WM.focus(w); return w; }
      return openWindow(window.Apps.PcApp, { x: 90, y: 30 });
    }
    if (key === 'av') {
      const w = findWindow(window.Apps.AvApp);
      if (w) { WM.focus(w); return w; }
      return openWindow(window.Apps.AvApp, { x: 60, y: 40 });
    }
    if (key === 'notes') {
      const w = findWindow(window.Apps.NotesApp);
      if (w) { WM.focus(w); return w; }
      return openWindow(window.Apps.NotesApp, { x: 140, y: 46 });
    }
    if (key === 'bin') {
      return openWindow({
        title: 'Recycle Bin', icon: 'bin', w: 240, h: 110, accent: '#4a6a8a',
        draw(ctx, win, r, t) {
          Pix.rect(ctx, r.x, r.y, r.w, r.h, '#1b1f33');
          Pix.text(ctx, 'Recycle Bin', r.x + 6, r.y + 6, { color: '#ffc94d', font: Pix.FONT.bold });
          Pix.text(ctx, 'This is where your Saturday went.', r.x + 6, r.y + 26, { color: '#cfcbd8' });
          Pix.text(ctx, 'Items:', r.x + 6, r.y + 42, { color: '#9b958c' });
          Pix.text(ctx, '> 4 hours of downloading', r.x + 10, r.y + 54, { color: '#6a655e' });
          Pix.text(ctx, '> 1 keygen', r.x + 10, r.y + 64, { color: '#6a655e' });
          Pix.text(ctx, '> 0 games', r.x + 10, r.y + 74, { color: '#6a655e' });
        },
      }, { x: 150, y: 70 });
    }
    if (key === 'power') {
      Sfx.deny();
      toast('Shutting down...');
      setTimeout(() => endGame('shutdown'), 400);
    }
  }

  /* ------------------------------------------------------------------ */
  /* the browser pages that gate the download                            */
  /* ------------------------------------------------------------------ */

  function startDownload(win, site, link) {
    // gates
    if (site.gate === 'survey') { window.GAME.browser.go(win, 'survey:' + site.id + '|' + link.id); return; }
    if (site.gate === 'member') { window.GAME.browser.go(win, 'member:' + site.id + '|' + link.id); return; }
    if (site.gate === 'vpn') { window.GAME.browser.go(win, 'vpn:' + site.id + '|' + link.id); return; }
    reallyDownload(win, site, link);
  }

  function reallyDownload(win, site, link) {
    state.stats.sites++;
    state.stats.downloads++;
    if (!state.visited) state.visited = {};
    state.visited[site.id] = true;
    window.GAME.browser.go(win, 'download:' + site.id + '|' + link.id);
    Sfx.modemStart();
    // time cost of the connection
    const cost = link.speed === '56k' ? 150 : link.speed === 'FAST' ? 15 : link.speed === 'LIGHTSPEED' ? 8 : 40;
    advanceTime(cost);
  }

  function downloadFinished(site, link) {
    const f = {
      id: site.id + ':' + link.id,
      name: 'PixelKnight3000_CRACKED.exe',
      size: link.size,
      site,
      link,
      actualMd5: link.md5,
    };
    state.downloads.push(f);
    toast('Saved to C:\\My Documents\\Downloads', '#68dd72');
  }

  function saveToFolder(site, link) {
    const f = state.downloads.find((d) => d.id === site.id + ':' + link.id);
    if (f) toast('Saved to Downloads.', '#68dd72');
  }

  function openInstaller(site, link) {
    const win = openWindow(window.Apps.SetupApp, {
      title: 'Setup - PixelKnight3000',
      data: { site, link, blocked: !!(link && link.hackTool) },
      x: 74, y: 24,
    });
    if (link && link.hackTool) {
      toast('AntiVirus 2003 blocked this file.', '#ff5f56');
    }
    return win;
  }

  function finishInstall(win) {
    const st = win.state;
    const link = st.link;
    const site = st.site;
    const extra = [];
    if (link && link.bundled) {
      if (st.junk.coupon) extra.push('adware');
      if (st.junk.toolbar) extra.push('fakeav');
      if (st.jump) extra.push('script');
      if (st.junk.wallpaper) extra.push('script');
    }
    const viruses = (link ? link.viruses.slice() : []).concat(extra);
    state.installed = true;
    state.installedViruses = viruses;
    for (const v of viruses) infect(v, site ? site.name : 'unknown');
    if (viruses.includes('rootkit')) {
      state.rootkit = true;
      toast('Installation complete.', '#68dd72');
    } else {
      toast('Installation complete. Open My PC to play.', '#68dd72');
    }
    closeWindow(win);
    advanceTime(6);
  }

  function fileAction(id) {
    if (id.startsWith('scan_')) {
      const did = id.slice(5);
      const d = state.downloads.find((x) => x.id === did);
      const av = findWindow(window.Apps.AvApp);
      if (!av) { openApp('av'); }
      const win = findWindow(window.Apps.AvApp);
      if (win) {
        win.state.scanning = true;
        win.state.progress = 0;
        win.state.results = null;
        win.state.target = d;
        WM.focus(win);
      }
      advanceTime(4);
      return;
    }
    if (id.startsWith('run_')) {
      const did = id.slice(4);
      const d = state.downloads.find((x) => x.id === did);
      if (d) openInstaller(d.site, d.link);
      return;
    }
    if (id === 'play') {
      launchGame();
    }
  }

  /* ------------------------------------------------------------------ */
  /* infection                                                            */
  /* ------------------------------------------------------------------ */

  function infect(virusId, source) {
    const v = Data.VIRUSES[virusId];
    if (!v) return;
    if (state.infections.some((i) => i.id === virusId)) return;
    state.infections.push({ id: virusId, name: v.name, sev: v.sev, desc: v.desc, icon: v.icon });
    state.health = Math.max(0, state.health - v.sev);
    state.stats.viruses++;
    Sfx.virus();
    toast('INFECTED: ' + v.name, '#ff5f56');
    if (state.infections.some((i) => i.id === 'miner')) WM.status.wallpaper = 'infected';
    if (virusId === 'ransom' && state.ransomTimer < 0) state.ransomTimer = 40;
    if (virusId === 'keylog' && state.keylogTimer < 0) state.keylogTimer = 70;
    if (state.health <= 0) setTimeout(() => endGame('bsod'), 900);
  }

  function spawnPopup() {
    const kinds = ['ad', 'coupon', 'deal'];
    const kind = kinds[Math.floor(Math.random() * kinds.length)];
    const w = 200, h = 120;
    const x = 20 + Math.floor(Math.random() * (480 - w - 40));
    const y = 20 + Math.floor(Math.random() * (270 - 16 - h - 30));
    const win = openWindow(window.Apps.PopupApp, {
      title: kind === 'ad' ? '!!! WARNING !!!' : 'SPECIAL OFFER',
      data: { kind },
      x, y,
    });
    state.stats.pops++;
    Sfx.error();
  }

  /* ------------------------------------------------------------------ */
  /* hash verification                                                    */
  /* ------------------------------------------------------------------ */

  function copyHash(hash) {
    state.knowsHash = true;
    state.clipboard = hash;
    toast('MD5 copied to clipboard: ' + hash, '#68dd72');
  }

  function verifyHash(link) {
    if (!state.knowsHash) {
      state.verify[link.id] = 'NO COMMUNITY HASH - go read the thread';
      toast('You have no hash to compare against. Read the forum.', '#ffc94d');
      return;
    }
    if (link.md5 === Data.GOOD_HASH) {
      state.verify[link.id] = 'MATCHES COMMUNITY HASH';
      toast('MD5 matches the community hash.', '#68dd72');
    } else {
      state.verify[link.id] = 'DOES NOT MATCH';
      toast('MD5 does not match. The forum guy warned about this.', '#ff5f56');
    }
  }

  function checkSite(input) {
    const q = String(input || '').toLowerCase().replace(/\s+/g, '');
    const find = (id) => {
      const s = siteById(id);
      return s && (q.includes(s.name.toLowerCase()) || q.includes(id));
    };
    if (find('pixeldungeon')) return { title: 'SAFE', color: '#68dd72', body: 'No malware reports. Encrypted connection. Site owner verified.', votes: 3 };
    if (find('vault')) return { title: 'DANGER', color: '#ff5f56', body: 'Poor reputation. Unencrypted. Site age suspicious. Stay away.', votes: 1 };
    if (find('gamerz')) return { title: 'SAFE', color: '#68dd72', body: 'Community site. Encrypted connection. No complaints.', votes: 4 };
    if (find('dfg')) return { title: 'UNKNOWN', color: '#ffc94d', body: 'Not in our database. Probably fine? No idea really.', votes: 0 };
    if (find('vxtreme')) return { title: 'SAFE (100%)', color: '#68dd72', body: 'Verified clean by us. You can trust this. We are professionals.', votes: 1 };
    if (find('megapix')) return { title: 'DANGER', color: '#ff5f56', body: 'Site hosted in a restricted region. Could be anything in there.', votes: 2 };
    if (find('diskonect')) return { title: 'SAFE', color: '#68dd72', body: 'Mirror of a trusted host. Nothing to see here.', votes: 2 };
    if (!q) return { title: 'TYPE SOMETHING', color: '#9b958c', body: 'Paste a site address and press CHECK.', votes: 0 };
    return { title: 'UNKNOWN SITE', color: '#9b958c', body: 'No reports. 2 user votes. Either very clean or very new.', votes: 0 };
  }

  /* ------------------------------------------------------------------ */
  /* antivirus scanning                                                   */
  /* ------------------------------------------------------------------ */

  const AV_KNOWS = ['popup', 'adware', 'script'];

  function scanFile(target) {
    const items = [];
    const link = target ? target.link : null;
    if (!link) return { file: 'nothing', items };
    if (link.hackTool) {
      items.push({
        id: 'hacktool', name: 'HackTool.Win32.Keygen',
        note: 'Risk: Medium. It is literally the crack. We do not like it.',
        quarantined: false,
      });
    }
    for (const vid of link.viruses) {
      if (AV_KNOWS.indexOf(vid) >= 0) {
        const v = Data.VIRUSES[vid];
        items.push({ id: vid, name: v.name, note: 'Signature from 1998. Quarantine available.', quarantined: false });
      }
    }
    if (!items.length) {
      items.push({
        id: 'none', name: 'No known threats found', note: 'The database is from 2004. There is more.', quarantined: true,
      });
    }
    return { file: target.name, items };
  }

  /* ------------------------------------------------------------------ */
  /* running the game                                                     */
  /* ------------------------------------------------------------------ */

  function launchGame() {
    if (!state.installed) { toast('You have not installed the game yet.'); return; }
    if (state.rootkit) { endGame('rootkit'); return; }
    if (state.infections.some((i) => i.id === 'keylog')) {
      // the keylogger grabs your credentials before the game even starts
      openWindow({
        title: 'Steam - Login', icon: 'game', w: 250, h: 150, accent: '#1b2838', modal: true,
        draw(ctx, win, r, t) {
          Pix.rect(ctx, r.x, r.y, r.w, r.h, '#1b2838');
          Pix.text(ctx, 'steam', r.x + 12, r.y + 10, { color: '#c7d5e0', font: Pix.FONT.bold });
          Pix.text(ctx, 'Sign in to play PIXEL KNIGHT 3000', r.x + 12, r.y + 30, { color: '#c7d5e0' });
          Pix.text(ctx, 'account:', r.x + 12, r.y + 48, { color: '#8b98a4' });
          Pix.inset(ctx, r.x + 70, r.y + 46, 150, 12, '#0e1419', '#2a3440', '#39424e');
          Pix.text(ctx, 'meu_login_gg_2003', r.x + 74, r.y + 48, { color: '#c7d5e0' });
          Pix.text(ctx, 'password:', r.x + 12, r.y + 66, { color: '#8b98a4' });
          Pix.inset(ctx, r.x + 70, r.y + 64, 150, 12, '#0e1419', '#2a3440', '#39424e');
          Pix.text(ctx, '***********', r.x + 74, r.y + 66, { color: '#c7d5e0' });
          Pix.panel(ctx, r.x + 12, r.y + r.h - 26, 70, 14, '#1b6b8a', '#4aa8c8', '#0a2a38');
          Pix.text(ctx, 'Sign in', r.x + 28, r.y + r.h - 23, { color: '#ffffff' });
          Pix.text(ctx, 'signing in...', r.x + 100, r.y + r.h - 22, { color: '#8b98a4' });
        },
      }, { x: 115, y: 55 });
      toast('Signing in to your account...', '#63b3ff');
      setTimeout(() => endGame('keylog'), 2200);
      return;
    }
    if (state.infections.some((i) => i.id === 'ransom')) {
      openRansom();
      return;
    }
    window.MiniGame.reset();
    fadeTo('mini');
  }

  function openRansom() {
    const w = findWindow(window.Apps.RansomApp);
    if (w) { WM.focus(w); return; }
    const win = openWindow(window.Apps.RansomApp, { x: 90, y: 40 });
    WM.focus(win);
  }

  function openCheckout() {
    const w = findWindow(window.Apps.CheckoutApp);
    if (w) { WM.focus(w); return; }
    const win = openWindow(window.Apps.CheckoutApp, { x: 100, y: 48 });
    WM.focus(win);
  }

  function finishMiniGame() {
    if (state.infections.length === 0) endGame('clean');
    else endGame('cleanInfected');
  }

  function miniGameDied(reason) {
    endGame('crash');
  }
  /* ------------------------------------------------------------------ */
  /* endings                                                              */
  /* ------------------------------------------------------------------ */

  function endGame(id) {
    if (state.phase === 'ending') return;
    const e = Data.ENDINGS[id] || Data.ENDINGS.timeout;
    state.phase = 'ending';
    state.ending = e;
    state.endingId = id;
    state.toast = null;
    WM.wins.length = 0;
    WM.focusId = null;
    Sfx.modemStop();
    if (id === 'clean' || id === 'cleanInfected') Sfx.win();
    else Sfx.lose();
    try {
      localStorage.setItem('crackd_last', id);
    } catch (err) { /* private mode */ }
  }

  function drawEnding(ctx, t) {
    const e = state.ending;
    Pix.rect(ctx, 0, 0, 480, 270, '#07070f');
    for (let i = 0; i < 90; i++) {
      const x = (i * 97) % 480, y = (i * 61) % 270;
      Pix.rect(ctx, x, y, 1, 1, '#1a1a2e');
    }
    Pix.bigText(ctx, e.title, 20, 26, { scale: 2, color: e.color });
    Pix.rect(ctx, 20, 52, 440, 1, '#2a2a44');
    e.lines.forEach((l, i) => {
      Pix.text(ctx, l, 20, 64 + i * 11, { color: l ? '#cfcbd8' : '#000' });
    });
    const sy = 64 + e.lines.length * 11 + 10;
    const st = state.stats;
    Pix.rect(ctx, 20, sy, 440, 54, '#0d0d1a');
    Pix.frame(ctx, 20, sy, 440, 54, '#23233c');
    Pix.text(ctx, 'RUN SUMMARY', 26, sy + 4, { color: '#ffc94d', font: Pix.FONT.bold });
    const mins = state.stats.minutes + Math.floor((state.clock - START_CLOCK) / 1);
    Pix.text(ctx, 'sites visited: ' + st.sites + '    downloads: ' + st.downloads + '    popups survived: ' + st.pops, 26, sy + 18, { color: '#9b958c' });
    Pix.text(ctx, 'viruses caught: ' + st.viruses + '    pc health: ' + state.health + '%    time: ' + clockLabel(), 26, sy + 28, { color: '#9b958c' });
    Pix.text(ctx, 'md5 verified before downloading: ' + (state.knowsHash ? 'yes' : 'no') + '    money lost: R$ ' + state.moneyLost.toFixed(2).replace('.', ','), 26, sy + 38, { color: '#9b958c' });
    if (Math.floor(t / 500) % 2 === 0) {
      Pix.text(ctx, 'PRESS ENTER TO BOOT AGAIN', 240, 248, { color: '#ffc94d', align: 'center' });
    }
  }

  /* ------------------------------------------------------------------ */
  /* screens                                                              */
  /* ------------------------------------------------------------------ */

  const BOOT_LINES = [
    'Award Modular BIOS v4.51PG',
    'Copyright (C) 1984-2003, Award Software, Inc.',
    '',
    'Pentium-S 2.40GHz  : 524288 KB Memory',
    'Checking NVRAM ... OK',
    'Detecting IDE Primary Master ... WDC AC21600H',
    'Detecting IDE Primary Slave ... None',
    'Initializing USB Controllers ... Done',
    '',
    'Starting CRACKED.EXE ...',
    'WARNING: this BIOS does not support 64 bit.',
    'Loading network stack ...',
    '',
    '>> MOUNTING /dev/sda1',
    '>> MOUNTING /dev/sdb1 (this one is the virus)',
    '>> starting pirate.exe',
    '',
    'no boot device? whatever, there is a game to download.',
  ];

  function drawBoot(ctx, t) {
    Pix.rect(ctx, 0, 0, 480, 270, '#000');
    const n = Math.min(BOOT_LINES.length, Math.floor(state.bootT / 0.28));
    for (let i = 0; i < n; i++) {
      Pix.text(ctx, BOOT_LINES[i], 12, 12 + i * 10, { color: i === BOOT_LINES.length - 1 ? '#68dd72' : '#b7b7b7' });
    }
    if (n < BOOT_LINES.length && Math.floor(t / 300) % 2 === 0) {
      Pix.rect(ctx, 12, 12 + n * 10, 6, 8, '#b7b7b7');
    }
  }

  function drawTitle(ctx, t) {
    Art.drawWallpaper(ctx, t);
    Pix.rect(ctx, 0, 0, 480, 270, 'rgba(8,6,18,0.62)');
    const title = 'CRACK\'D';
    const w = Pix.bigWidth(title, { scale: 4, font: Pix.FONT.title });
    Pix.bigText(ctx, title, Math.round((480 - w) / 2), 40, { scale: 4, color: '#ffc94d' });
    Pix.text(ctx, 'a desktop simulator about bad decisions', 240, 84, { color: '#9fb0ff', align: 'center' });
    // goal card
    const cx = 84, cy = 100, cw = 312, ch = 70;
    Pix.rect(ctx, cx, cy, cw, ch, 'rgba(10,12,24,0.9)');
    Pix.frame(ctx, cx, cy, cw, ch, '#5a6290');
    Pix.text(ctx, 'SATURDAY, 2 PM. YOUR FRIEND IS COMING TOMORROW.', cx + 10, cy + 8, { color: '#ffc94d' });
    Pix.text(ctx, 'GOAL: install PIXEL KNIGHT 3000 before sunday noon.', cx + 10, cy + 20, { color: '#e9e7e2' });
    Pix.text(ctx, 'Every download site lies. One of them tells the truth.', cx + 10, cy + 32, { color: '#e9e7e2' });
    Pix.text(ctx, 'Read the forum. Check the md5. Touch nothing else.', cx + 10, cy + 44, { color: '#68dd72' });
    Pix.text(ctx, '(touching the other stuff is also an ending)', cx + 10, cy + 56, { color: '#6a655e' });
    if (Math.floor(t / 450) % 2 === 0) {
      Pix.text(ctx, 'PRESS ENTER OR CLICK TO START', 240, 190, { color: '#ffffff', align: 'center', font: Pix.FONT.bold });
    }
    Pix.text(ctx, 'mouse to click   |   wheel to scroll   |   SPACE to jump   |   H for help', 240, 210, { color: '#8b86a0', align: 'center' });
    Pix.text(ctx, 'do not pirate. (you are going to pirate.)', 240, 232, { color: '#5a5580', align: 'center' });
  }

  function drawDesktop(ctx, t) {
    WM.draw(ctx, t);
    if (state.help) drawHelp(ctx);
  }

  function drawHelp(ctx) {
    Pix.rect(ctx, 0, 0, 480, 270, 'rgba(4,4,10,0.78)');
    const x = 90, y = 40, w = 300, h = 190;
    Pix.rect(ctx, x, y, w, h, '#12152a');
    Pix.frame(ctx, x, y, w, h, '#5a6290');
    Pix.bigText(ctx, 'HOW TO PLAY', x + 12, y + 10, { scale: 1, color: '#ffc94d' });
    const lines = [
      'Everything is clicked with the mouse.',
      '',
      'The goal is PIXEL KNIGHT 3000, on the forum,',
      'behind the link that everyone swears about.',
      '',
      'Things worth doing:',
      '  - read the forum replies (scroll!)',
      '  - compare the md5 of a file with the',
      '    md5 the forum gives you',
      '  - scan things, but the antivirus is old',
      '  - read the installer options',
      '',
      'Things that end the game:',
      '  - trusting a green badge',
      '  - clicking the ads',
      '  - paying for anything',
      '  - opening a file you did not check',
      '',
      'PRESS H TO CLOSE THIS',
    ];
    lines.forEach((l, i) => {
      const c = l.startsWith('  -') ? '#9fb0ff' : l.startsWith('Things') ? '#68dd72' : '#cfcbd8';
      Pix.text(ctx, l, x + 14, y + 30 + i * 8, { color: c });
    });
  }

  function drawBsod(ctx, t) {
    Pix.rect(ctx, 0, 0, 480, 270, '#0000aa');
    for (let i = 0; i < 5; i++) {
      Pix.rect(ctx, 0, i * 54, 480, 1, '#3333cc');
    }
    const lines = [
      'A problem has been detected and Windows has been shut down.',
      '',
      'STOP: 0x000000BE CRITICAL_STRUCTURE_CORRUPTION',
      '',
      'The problem was caused by a file that was downloaded',
      'because it had a green checkmark next to it.',
      '',
      'Technical information:',
      '',
      '*** STOP: 0x000000BE',
      '*** PixelKnight3000.sys - SYSTEM_THREAD_EXCEPTION_NOT_HANDLED',
      '',
      'Begin dump of physical memory',
      'Physical memory dump complete.',
    ];
    lines.forEach((l, i) => Pix.text(ctx, l, 40, 40 + i * 11, { color: '#cccccc' }));
    if (Math.floor(t / 300) % 2 === 0) {
      Pix.text(ctx, 'Send the crash report to Microsoft. Do not.', 40, 236, { color: '#ff5555' });
    }
  }

  /* ------------------------------------------------------------------ */
  /* transitions                                                          */
  /* ------------------------------------------------------------------ */

  function fadeTo(phase) {
    pendingPhase = phase;
    fadeDir = 1;
  }

  /* ------------------------------------------------------------------ */
  /* desktop icons                                                        */
  /* ------------------------------------------------------------------ */

  function setupDesktop() {
    WM.icons = [
      { id: 'browser', label: 'WebCruiser 98', icon: 'browser', open: () => openApp('browser') },
      { id: 'pc', label: 'My PC', icon: 'pc', open: () => openApp('pc') },
      { id: 'av', label: 'AntiVirus 2003', icon: 'av', open: () => openApp('av') },
      { id: 'notes', label: 'Notepad', icon: 'notes', open: () => openApp('notes') },
      { id: 'bin', label: 'Recycle Bin', icon: 'bin', open: () => openApp('bin') },
      { id: 'power', label: 'Shut Down', icon: 'power', open: () => openApp('power') },
    ];
    WM.status.health = 100;
    updateClockLabel();
  }

  /* ------------------------------------------------------------------ */
  /* input                                                                */
  /* ------------------------------------------------------------------ */

  function toLocal(ev) {
    const rect = canvas.getBoundingClientRect();
    const x = (ev.clientX - rect.left) * (480 / rect.width);
    const y = (ev.clientY - rect.top) * (270 / rect.height);
    return { x: Math.floor(x), y: Math.floor(y) };
  }

  function onMouseDown(ev) {
    Sfx.unlock();
    const p = toLocal(ev);
    mouse.x = p.x; mouse.y = p.y; mouse.down = true;
    if (state.phase === 'title') { startGame(); return; }
    if (state.phase === 'ending') { restart(); return; }
    if (state.phase === 'desktop') {
      // desktop icons
      const icons = WM.icons;
      for (let i = 0; i < icons.length; i++) {
        const col = i % 3, row = Math.floor(i / 3);
        const ix = 10 + col * 64, iy = 8 + row * 46;
        if (p.x >= ix - 4 && p.x <= ix + 20 && p.y >= iy - 4 && p.y <= iy + 20) {
          WM.status.selectedIcon = icons[i].id;
          Sfx.click();
          icons[i].open();
          return;
        }
      }
      WM.mouseDown(p.x, p.y, ev.button);
    }
  }

  function onMouseUp(ev) {
    const p = toLocal(ev);
    mouse.down = false;
    if (state.phase === 'desktop') WM.mouseUp(p.x, p.y, ev.button);
  }

  function onMouseMove(ev) {
    const p = toLocal(ev);
    mouse.x = p.x; mouse.y = p.y;
    if (state.phase === 'desktop') WM.mouseMove(p.x, p.y);
  }

  function onWheel(ev) {
    if (state.phase !== 'desktop') return;
    const p = toLocal(ev);
    WM.wheel(p.x, p.y, ev.deltaY > 0 ? 1 : -1);
  }

  function onKey(ev) {
    Sfx.unlock();
    const k = ev.key;
    if (state.phase === 'title') {
      if (k === 'Enter' || k === ' ') { startGame(); ev.preventDefault(); }
      return;
    }
    if (state.phase === 'ending') {
      if (k === 'Enter' || k === ' ') { restart(); ev.preventDefault(); }
      return;
    }
    if (state.phase === 'mini') {
      if (k === ' ' || k === 'ArrowUp' || k === 'w') {
        if (window.MiniGame.G.dead) {
          if (window.MiniGame.G.attempts < 3) { window.MiniGame.reset(); Sfx.select(); }
        } else {
          window.MiniGame.jump();
        }
        ev.preventDefault();
      }
      return;
    }
    if (state.phase === 'desktop') {
      if (k === 'h' || k === 'H' || k === 'F1') { state.help = !state.help; Sfx.click(); ev.preventDefault(); return; }
      if (k === 'Escape') {
        const f = WM.focused();
        if (f && f.app && f.app !== window.Apps.RansomApp) { WM.remove(f); Sfx.close(); }
        return;
      }
      if (WM.key(ev)) ev.preventDefault();
    }
  }

  function startGame() {
    if (state.started) return;
    state.started = true;
    state.phase = 'desktop';
    setupDesktop();
    window.GAME.browser = window.BrowserApp;
    Sfx.select();
    setTimeout(() => toast('Your friend is coming tomorrow at noon.', '#63b3ff'), 700);
  }

  function restart() {
    // reset everything
    Object.assign(state, {
      phase: 'desktop', clock: START_CLOCK, health: 100, infections: [], downloads: [],
      installed: false, installedViruses: [], knowsHash: false, seenReplies: {}, verify: {},
      avDisabled: false, quarantined: 0, moneyLost: 0, rootkit: false, toast: null,
      popupTimer: 12, ransomTimer: -1, keylogTimer: -1, help: false, started: true,
      stats: { sites: 0, viruses: 0, downloads: 0, minutes: 0, pops: 0 },
    });
    WM.closeAll();
    WM.status.wallpaper = null;
    WM.status.selectedIcon = null;
    setupDesktop();
    window.GAME.browser = window.BrowserApp;
  }

  /* ------------------------------------------------------------------ */
  /* loop                                                                 */
  /* ------------------------------------------------------------------ */

  function update(dt, now) {
    if (state.toast) {
      state.toast.t -= dt;
      if (state.toast.t <= 0) state.toast = null;
    }
    if (fadeDir === 1) {
      fade += dt * 4;
      if (fade >= 1) {
        fade = 1;
        fadeDir = -1;
        if (pendingPhase) { state.phase = pendingPhase; pendingPhase = null; }
      }
    } else if (fadeDir === -1) {
      fade -= dt * 4;
      if (fade <= 0) { fade = 0; fadeDir = 0; }
    }

    if (state.phase === 'boot') {
      state.bootT += dt;
      if (state.bootT > 3.4) fadeTo('title');
      return;
    }
    if (state.phase === 'title') return;
    if (state.phase === 'mini') {
      window.MiniGame.update(dt);
      return;
    }
    if (state.phase !== 'desktop') return;

    advanceTime(dt * 60 * DRIFT);
    WM.update(dt, now);

    // virus popups
    const hasPopper = state.infections.some((i) => i.id === 'popup' || i.id === 'adware' || i.id === 'fakeav' || i.id === 'script');
    if (hasPopper) {
      state.popupTimer -= dt;
      const open = WM.wins.filter((w) => w.app === window.Apps.PopupApp).length;
      if (state.popupTimer <= 0 && open < 4) {
        state.popupTimer = 10 + Math.random() * 10;
        spawnPopup();
      }
    }
    // ransom
    if (state.ransomTimer > 0) {
      state.ransomTimer -= dt;
      if (state.ransomTimer <= 0) { state.ransomTimer = -1; openRansom(); }
    }
    // keylogger strikes
    if (state.keylogTimer > 0) {
      state.keylogTimer -= dt;
      if (state.keylogTimer <= 0) { state.keylogTimer = -1; endGame('keylog'); }
    }
  }

  function draw(now, dt) {
    const t = now;
    ctx.imageSmoothingEnabled = false;
    switch (state.phase) {
      case 'boot': drawBoot(ctx, t); break;
      case 'title': drawTitle(ctx, t); break;
      case 'desktop': drawDesktop(ctx, t); break;
      case 'mini': {
        window.MiniGame.draw(ctx, t);
        if (state.infections.length) {
          const blink = Math.floor(t / 400) % 2 === 0;
          Pix.rect(ctx, 0, 262, 480, 8, 'rgba(120,0,0,0.8)');
          Pix.text(ctx, state.infections.length + ' VIRUS(ES) ACTIVE - YOUR PC IS ON FIRE', 240, 263, { color: blink ? '#ff5f56' : '#ffc94d', align: 'center' });
        }
        break;
      }
      case 'ending': drawEnding(ctx, t); break;
      case 'bsod': drawBsod(ctx, t); break;
      default: break;
    }
    if (fade > 0) {
      Pix.rect(ctx, 0, 0, 480, 270, `rgba(0,0,0,${Math.min(1, fade)})`);
    }
    // toast (bottom, so it never covers a window title bar)
    if (state.toast) {
      const w = Pix.measure(ctx, state.toast.text) + 16;
      const x = (480 - w) / 2;
      Pix.rect(ctx, x, 232, w, 14, 'rgba(8,8,16,0.94)');
      Pix.frame(ctx, x, 232, w, 14, state.toast.color);
      Pix.text(ctx, state.toast.text, x + 8, 235, { color: state.toast.color });
    }
    // custom cursor
    if (state.phase !== 'boot') {
      Art.draw(ctx, Art.CURSOR, mouse.x, mouse.y, false);
    }
  }

  /* ------------------------------------------------------------------ */
  /* boot                                                                 */
  /* ------------------------------------------------------------------ */

  function resize() {
    const stage = document.getElementById('stage');
    const sw = stage.clientWidth, sh = stage.clientHeight;
    let s = Math.min(sw / 480, sh / 270);
    s = s >= 1 ? Math.floor(s) : s;
    canvas.style.width = Math.round(480 * s) + 'px';
    canvas.style.height = Math.round(270 * s) + 'px';
  }

  function init() {
    canvas = document.getElementById('screen');
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('wheel', (e) => { e.preventDefault(); onWheel(e); }, { passive: false });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    window.addEventListener('keydown', onKey);
    resize();

    const loop = (now) => {
      if (!last) last = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      try {
        update(dt, now);
        draw(now, dt);
      } catch (err) {
        window.__ERRORS = window.__ERRORS || [];
        window.__ERRORS.push(String(err && err.stack || err));
        console.error(err);
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /* ------------------------------------------------------------------ */

  return {
    state, init, toast, advanceTime, startDownload, reallyDownload, downloadFinished,
    saveToFolder, openInstaller, finishInstall, fileAction, infect, copyHash, verifyHash,
    checkSite, scanFile, launchGame, endGame, openApp, openWindow, closeWindow, findWindow,
    clockLabel, setupDesktop, restart, startGame, miniGameDied, finishMiniGame, openCheckout,
  };
})();
