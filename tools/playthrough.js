// Full playthrough with real clicks: forum -> md5 -> download -> install -> play -> win.
const path = require('path');
const fs = require('fs');
const { CDP, sleep } = require('./cdp');

const ROOT = path.resolve(__dirname, '..');
const OUT = '/tmp/opencode/shots2';
fs.mkdirSync(OUT, { recursive: true });

async function main() {
  const errors = [];
  const cdp = new CDP({ width: 1440, height: 810 });
  await cdp.start();
  await cdp.newPage('about:blank');
  cdp.on('Runtime.consoleAPICalled', (p) => {
    if (p.type === 'error') errors.push('[console] ' + p.args.map((a) => a.value || a.description).join(' '));
  });
  cdp.on('Runtime.exceptionThrown', (p) => {
    errors.push('[exception] ' + (p.exceptionDetails.exception && p.exceptionDetails.exception.description || p.exceptionDetails.text));
  });
  await cdp.goto('file://' + path.join(ROOT, 'index.html'), { wait: 1000 });

  const rect = await cdp.eval(`const r=document.getElementById('screen').getBoundingClientRect(); return {l:r.left,t:r.top,w:r.width};`);
  const scale = rect.w / 480;
  const click = async (x, y) => cdp.click(rect.l + x * scale, rect.t + y * scale);
  const move = async (x, y) => cdp.move(rect.l + x * scale, rect.t + y * scale);
  const wheel = async (x, y, dy) => {
    await cdp.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: rect.l + x * scale, y: rect.t + y * scale, deltaX: 0, deltaY: dy * 120 });
    await sleep(120);
  };
  const key = async (k, code, vk) => cdp.key(k, code || k, vk || 0);
  const shot = async (n) => { await sleep(120); await cdp.screenshot(path.join(OUT, n + '.png')); console.log('  shot', n); };
  const ev = (code) => cdp.eval(code);

  await sleep(3500);
  await key('Enter', 'Enter', 13);
  await sleep(400);

  // 1. open the browser
  await click(20, 18);
  await sleep(500);

  // 2. go to the forum via the homepage link
  await click(60, 108);
  await sleep(400);
  console.log('page:', await ev(`const w=window.GAME.findWindow(window.BrowserApp); return window.BrowserApp.page(w).type;`));

  // 3. scroll down to the reply that contains the hash, then click it
  await move(240, 160);
  for (let i = 0; i < 8; i++) await wheel(240, 160, 1);
  await sleep(300);
  await shot('01-forum-truth');
  const pagePos = async (expr) => cdp.eval(`
    const w = window.GAME.findWindow(window.BrowserApp);
    const r = window.OS.WM.clientRect(w);
    const p = window.BrowserApp.page(w);
    const b = ${expr};
    if (!b) return null;
    return {x: r.x + b.x, y: r.y + window.BrowserApp.TOOL_H + b.y - p.scroll};
  `);
  const hashPos = await pagePos('p._hashRect');
  console.log('hash rect:', JSON.stringify(hashPos));
  if (hashPos) {
    await click(hashPos.x + 4, hashPos.y + 4);
    await sleep(300);
  }
  console.log('knowsHash:', await ev(`return window.GAME.state.knowsHash;`));
  await shot('02-hash-copied');

  // 4. open the safe site from the forum reply link
  await ev(`
    const w = window.GAME.findWindow(window.BrowserApp);
    window.GAME.browser.go(w, 'site:vault');
    return 1;
  `);
  await sleep(400);
  await shot('03-site');

  // 5. press VERIFY on the first link
  const vpos = await pagePos("p['_vf_vg-main']");
  await click(vpos.x + 10, vpos.y + 4);
  await sleep(300);
  console.log('verify:', await ev(`return window.GAME.state.verify['vg-main'];`));
  await shot('04-verified');

  // 6. download it
  const dpos = await pagePos("p['_dl_vg-main']");
  await click(dpos.x + 10, dpos.y + 6);
  await sleep(800);
  await shot('05-downloading');
  console.log('page now:', await ev(`const w=window.GAME.findWindow(window.BrowserApp); return window.BrowserApp.page(w).type;`));

  // wait for the download to finish
  for (let i = 0; i < 70; i++) {
    const done = await ev(`const w=window.GAME.findWindow(window.BrowserApp); const p=window.BrowserApp.page(w); return p.type==='download' && p.done;`);
    if (done) break;
    await sleep(500);
  }
  await shot('06-download-done');
  const openPos = await pagePos('p._open');
  console.log('open button:', JSON.stringify(openPos));
  await click(openPos.x + 20, openPos.y + 6);
  await sleep(600);
  await shot('07-installer');
  console.log('installer open:', await ev(`return !!window.GAME.findWindow(window.Apps.SetupApp);`));

  // 7. walk the wizard
  const clickSetup = async (which) => {
    const p = await ev(`
      const w = window.GAME.findWindow(window.Apps.SetupApp);
      if (!w) return null;
      const b = w.state['_' + ${JSON.stringify(which)}];
      return b ? {x: b.x, y: b.y} : null;
    `);
    if (!p) { console.log('  missing button', which); return false; }
    await click(p.x + 6, p.y + 6);
    await sleep(350);
    return true;
  };
  await clickSetup('next');            // welcome -> eula
  await shot('08-eula');
  await clickSetup('acc');             // accept
  await clickSetup('next');            // eula -> options
  await shot('09-options');
  await clickSetup('next');            // options -> progress
  await shot('10-progress');
  await sleep(3500);
  await shot('11-done');
  await clickSetup('next');            // finish
  await sleep(600);
  await shot('12-after-install');
  console.log('installed:', await ev(`return window.GAME.state.installed;`));
  console.log('infections:', await ev(`return window.GAME.state.infections.map(i=>i.id);`));

  // 8. run the game from My PC
  await ev(`window.GAME.openApp('pc'); return 1;`);
  await sleep(400);
  await shot('13-my-pc');
  await ev(`
    const w = window.GAME.findWindow(window.Apps.PcApp);
    w.state.folder = 'programs';
    w.state.selected = 'prog';
    return 1;
  `);
  await sleep(300);
  const playPos = await ev(`
    const w = window.GAME.findWindow(window.Apps.PcApp);
    const b = w.state['_a_play'];
    return b ? {x: b.x + 8, y: b.y + 5} : null;
  `);
  console.log('play button:', JSON.stringify(playPos));
  await click(playPos.x, playPos.y);
  await sleep(800);
  await shot('14-minigame');
  console.log('phase:', await ev(`return window.GAME.state.phase;`));

  // 9. play the minigame: jump when an obstacle is close
  let dead = false;
  for (let i = 0; i < 400; i++) {
    const s = await ev(`
      const g = window.MiniGame.G;
      const obs = window.Data.LEVEL.obstacles;
      let next = null;
      for (const o of obs) { if (o.x > g.x - 30) { next = o; break; } }
      return {x: g.x, dead: g.dead, won: g.won, next: next ? next.x : null, onGround: g.y >= 190, phase: window.GAME.state.phase};
    `);
    if (s.phase !== 'mini') break;
    if (s.dead) {
      dead = true;
      await key(' ', 'Space', 32);
      await sleep(300);
      continue;
    }
    if (s.next !== null && s.next - s.x < 46 && s.onGround) {
      await key(' ', 'Space', 32);
    }
    await sleep(60);
  }
  await shot('15-minigame-end');
  console.log('died:', dead, 'phase:', await ev(`return window.GAME.state.phase;`));
  console.log('ending:', await ev(`return window.GAME.state.endingId;`));
  console.log('stats:', JSON.stringify(await ev(`return window.GAME.state.stats;`)));

  console.log('\n--- errors ---');
  console.log(errors.length ? errors.slice(0, 10).join('\n') : '(none)');
  await cdp.close();
}

main().catch((e) => { console.error('FATAL', e); process.exit(1); });
