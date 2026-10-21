// Drives the game in headless Chrome: captures console errors and screenshots.
// Usage: node tools/play.js [scenario]
const path = require('path');
const fs = require('fs');
const { CDP, sleep } = require('./cdp');

const ROOT = path.resolve(__dirname, '..');
const OUT = '/tmp/opencode/shots';
fs.mkdirSync(OUT, { recursive: true });

const errors = [];

async function main() {
  const cdp = new CDP({ width: 1440, height: 810 });
  await cdp.start();
  await cdp.newPage('about:blank');
  cdp.on('Runtime.consoleAPICalled', (p) => {
    if (p.type === 'error' || p.type === 'warning') {
      errors.push('[console.' + p.type + '] ' + p.args.map((a) => a.value || a.description || a.type).join(' '));
    }
  });
  cdp.on('Runtime.exceptionThrown', (p) => {
    errors.push('[exception] ' + (p.exceptionDetails.exception && p.exceptionDetails.exception.description || p.exceptionDetails.text));
  });
  await cdp.goto('file://' + path.join(ROOT, 'index.html'), { wait: 1000 });

  const shot = async (name) => {
    await sleep(150);
    await cdp.screenshot(path.join(OUT, name + '.png'));
    console.log('  shot:', name);
  };

  // internal (480x270) -> screen coordinates
  const rect = await cdp.eval(`
    const c = document.getElementById('screen');
    const r = c.getBoundingClientRect();
    return {left: r.left, top: r.top, w: r.width, h: r.height};
  `);
  const scale = rect.w / 480;
  const click = async (x, y) => {
    await cdp.click(rect.left + x * scale, rect.top + y * scale);
  };
  const move = async (x, y) => cdp.move(rect.left + x * scale, rect.top + y * scale);
  const wheel = async (x, y, dy) => {
    await cdp.send('Input.dispatchMouseEvent', {
      type: 'mouseWheel', x: rect.left + x * scale, y: rect.top + y * scale, deltaX: 0, deltaY: dy * scale,
    });
    await sleep(150);
  };
  const key = async (k) => { await cdp.key(k, k, k === 'Enter' ? 13 : 0); };

  const steps = process.argv[2] || 'all';

  console.log('boot...');
  await sleep(700);
  await shot('01-boot');
  await sleep(3200);
  await shot('02-title');

  console.log('start...');
  await key('Enter');
  await sleep(500);
  await shot('03-desktop');

  console.log('open browser...');
  await click(20, 20);   // WebCruiser icon
  await sleep(600);
  await shot('04-browser-home');

  console.log('forum...');
  await click(60, 108);  // first link on the homepage
  await sleep(500);
  await shot('05-forum-top');
  await move(240, 160);
  await wheel(240, 160, 3);
  await sleep(200);
  await wheel(240, 160, 3);
  await sleep(300);
  await shot('06-forum-scrolled');
  await wheel(240, 160, 5);
  await sleep(300);
  await shot('07-forum-scrolled2');

  console.log('site page...');
  await cdp.eval(`window.GAME.browser.go(window.GAME.findWindow(window.BrowserApp), 'site:vault'); return 1;`);
  await sleep(500);
  await shot('08-site-vault');
  await cdp.eval(`window.GAME.browser.go(window.GAME.findWindow(window.BrowserApp), 'site:pixeldungeon'); return 1;`);
  await sleep(500);
  await shot('09-site-modern');
  await cdp.eval(`window.GAME.browser.go(window.GAME.findWindow(window.BrowserApp), 'site:vxtreme'); return 1;`);
  await sleep(500);
  await shot('10-site-loud');
  await cdp.eval(`window.GAME.browser.go(window.GAME.findWindow(window.BrowserApp), 'site:megapix'); return 1;`);
  await sleep(500);
  await shot('11-site-br');
  await cdp.eval(`window.GAME.browser.go(window.GAME.findWindow(window.BrowserApp), 'jabber'); return 1;`);
  await sleep(400);
  await shot('12-jabber');
  await cdp.eval(`window.GAME.browser.go(window.GAME.findWindow(window.BrowserApp), 'checker'); return 1;`);
  await sleep(400);
  await shot('13-checker');
  await cdp.eval(`window.GAME.browser.go(window.GAME.findWindow(window.BrowserApp), 'ad'); return 1;`);
  await sleep(400);
  await shot('14-ad');

  console.log('download...');
  await cdp.eval(`
    const w = window.GAME.findWindow(window.BrowserApp);
    window.GAME.browser.go(w, 'site:vault');
    return 1;
  `);
  await sleep(400);
  await cdp.eval(`
    const w = window.GAME.findWindow(window.BrowserApp);
    window.GAME.reallyDownload(w, window.Data.SITES.find(s=>s.id==='vault'), window.Data.SITES.find(s=>s.id==='vault').links[0]);
    return 1;
  `);
  await sleep(1500);
  await shot('15-download');
  await sleep(9000);
  await shot('16-download-done');

  console.log('installer...');
  await cdp.eval(`
    const w = window.GAME.findWindow(window.BrowserApp);
    const site = window.Data.SITES.find(s=>s.id==='vault');
    window.GAME.openInstaller(site, site.links[0]);
    return 1;
  `);
  await sleep(500);
  await shot('17-installer-welcome');
  await cdp.eval(`
    const w = window.GAME.findWindow(window.Apps.SetupApp);
    w.state.step = 1; return 1;
  `);
  await sleep(300);
  await shot('18-installer-eula');
  await cdp.eval(`
    const w = window.GAME.findWindow(window.Apps.SetupApp);
    w.state.accepted = true; w.state.step = 2; return 1;
  `);
  await sleep(300);
  await shot('19-installer-options');
  await cdp.eval(`
    const w = window.GAME.findWindow(window.Apps.SetupApp);
    w.state.step = 3; w.state.progress = 0.5; return 1;
  `);
  await sleep(300);
  await shot('20-installer-progress');
  await cdp.eval(`
    const w = window.GAME.findWindow(window.Apps.SetupApp);
    w.state.step = 4; return 1;
  `);
  await sleep(300);
  await shot('21-installer-done');

  console.log('other apps...');
  await cdp.eval(`window.GAME.openApp('av'); return 1;`);
  await sleep(300);
  await shot('22-antivirus');
  await cdp.eval(`window.GAME.openApp('pc'); return 1;`);
  await sleep(300);
  await shot('23-my-pc');
  await cdp.eval(`window.GAME.openApp('notes'); return 1;`);
  await sleep(300);
  await shot('24-notepad');

  console.log('minigame...');
  await cdp.eval(`
    window.GAME.state.phase = 'mini';
    window.MiniGame.reset();
    return 1;
  `);
  await sleep(1200);
  await shot('25-minigame');
  await sleep(2500);
  await shot('26-minigame2');

  console.log('ending...');
  await cdp.eval(`window.GAME.endGame('clean'); return 1;`);
  await sleep(600);
  await shot('27-ending');

  console.log('infected ending...');
  await cdp.eval(`
    window.GAME.restart();
    window.GAME.state.infections.push({id:'keylog',name:'x',sev:26,desc:'',icon:'virus'});
    window.GAME.endGame('keylog');
    return 1;
  `);
  await sleep(600);
  await shot('28-ending-keylog');

  const runtimeErrors = await cdp.eval('return (window.__ERRORS||[]).slice(0,10)');
  console.log('\n--- page errors ---');
  console.log(runtimeErrors.length ? runtimeErrors.join('\n') : '(none)');
  console.log('\n--- console errors ---');
  console.log(errors.length ? errors.slice(0, 20).join('\n') : '(none)');

  await cdp.close();
}

main().catch((e) => { console.error('FATAL', e); process.exit(1); });
