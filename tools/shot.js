// Screenshot a page: node tools/shot.js <url> <out.png> [--eval "js"] [--wait ms]
const path = require('path');
const { CDP, sleep } = require('./cdp');

(async () => {
  const args = process.argv.slice(2);
  const url = path.resolve(args[0]);
  const out = path.resolve(args[1] || 'shot.png');
  const evalIdx = args.indexOf('--eval');
  const waitIdx = args.indexOf('--wait');
  const cdp = new CDP();
  try {
    await cdp.start();
    await cdp.newPage('about:blank');
    await cdp.goto('file://' + url, { wait: waitIdx > 0 ? +args[waitIdx + 1] : 1200 });
    if (evalIdx > 0) {
      const v = await cdp.eval(args[evalIdx + 1]);
      console.log('eval:', JSON.stringify(v));
      await sleep(400);
    }
    await cdp.screenshot(out);
    console.log('saved', out);
  } catch (e) {
    console.error('ERROR', e.message);
    process.exitCode = 1;
  } finally {
    await cdp.close();
  }
})();
