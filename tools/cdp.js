// Minimal zero-dependency Chrome DevTools Protocol driver (Node >= 22 global WebSocket).
// Used to screenshot + drive the game during development.
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const CHROME = process.env.CHROME_BIN || '/usr/bin/google-chrome';

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

class CDP {
  constructor({ port = 9333, width = 1440, height = 810 } = {}) {
    this.port = port;
    this.width = width;
    this.height = height;
    this.id = 0;
    this.pending = new Map();
    this.handlers = new Map();
  }

  async start() {
    this.profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cdp-profile-'));
    this.proc = spawn(CHROME, [
      '--headless=new',
      `--remote-debugging-port=${this.port}`,
      `--user-data-dir=${this.profile}`,
      `--window-size=${this.width},${this.height}`,
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--allow-file-access-from-files',
      '--autoplay-policy=no-user-gesture-required',
      '--mute-audio',
      'about:blank',
    ], { stdio: ['ignore', 'ignore', 'pipe'] });
    this.proc.stderr.on('data', () => {});

    let info = null;
    for (let i = 0; i < 120; i++) {
      try {
        const r = await fetch(`http://127.0.0.1:${this.port}/json/version`);
        if (r.ok) { info = await r.json(); break; }
      } catch (_) { /* not up yet */ }
      await sleep(120);
    }
    if (!info) throw new Error('chrome did not start');
    return info;
  }

  async newPage(url = 'about:blank') {
    const r = await fetch(`http://127.0.0.1:${this.port}/json/new?${encodeURIComponent(url)}`, { method: 'PUT' });
    const target = await r.json();
    this.ws = new WebSocket(target.webSocketDebuggerUrl);
    this.targetId = target.id;
    await new Promise((res, rej) => {
      this.ws.onopen = res;
      this.ws.onerror = rej;
    });
    this.ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { res, rej } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) rej(new Error(msg.method + ' ' + JSON.stringify(msg.error)));
        else res(msg.result);
      } else if (msg.method) {
        const hs = this.handlers.get(msg.method) || [];
        for (const h of hs) h(msg.params);
      }
    };
    await this.send('Page.enable');
    await this.send('Runtime.enable');
    return this;
  }

  on(method, fn) {
    if (!this.handlers.has(method)) this.handlers.set(method, []);
    this.handlers.get(method).push(fn);
  }

  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((res, rej) => {
      this.pending.set(id, { res, rej });
      this.ws.send(JSON.stringify({ id, method, params }));
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          rej(new Error('timeout ' + method));
        }
      }, 30000);
    });
  }

  async goto(url, { wait = 900 } = {}) {
    const loaded = new Promise((res) => {
      const h = () => res();
      this.on('Page.loadEventFired', h);
    });
    await this.send('Page.navigate', { url });
    await Promise.race([loaded, sleep(8000)]);
    await sleep(wait);
  }

  async eval(expr) {
    const r = await this.send('Runtime.evaluate', {
      expression: `(function(){${expr}})()`,
      returnByValue: true,
      awaitPromise: true,
    });
    if (r.exceptionDetails) {
      throw new Error('eval error: ' + JSON.stringify(r.exceptionDetails.exception || r.exceptionDetails));
    }
    return r.result.value;
  }

  // Coordinates are in CSS pixels of the viewport.
  async click(x, y, { button = 'left' } = {}) {
    await this.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, button: 'none', buttons: 0 });
    await sleep(30);
    await this.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button, buttons: 1, clickCount: 1 });
    await sleep(40);
    await this.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button, buttons: 0, clickCount: 1 });
    await sleep(120);
  }

  async move(x, y) {
    await this.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, button: 'none', buttons: 0 });
    await sleep(40);
  }

  async drag(x1, y1, x2, y2, steps = 8) {
    await this.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: x1, y: y1, button: 'none', buttons: 0 });
    await this.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: x1, y: y1, button: 'left', buttons: 1, clickCount: 1 });
    for (let i = 1; i <= steps; i++) {
      await this.send('Input.dispatchMouseEvent', {
        type: 'mouseMoved', x: x1 + ((x2 - x1) * i) / steps, y: y1 + ((y2 - y1) * i) / steps,
        button: 'left', buttons: 1,
      });
      await sleep(16);
    }
    await this.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: x2, y: y2, button: 'left', buttons: 0, clickCount: 1 });
    await sleep(120);
  }

  async key(key, code, keyCode) {
    await this.send('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode: keyCode, nativeVirtualKeyCode: keyCode });
    await sleep(30);
    await this.send('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: keyCode, nativeVirtualKeyCode: keyCode });
    await sleep(80);
  }

  async type(text) {
    for (const ch of text) {
      await this.send('Input.dispatchKeyEvent', { type: 'keyDown', text: ch, key: ch });
      await this.send('Input.dispatchKeyEvent', { type: 'keyUp', key: ch });
      await sleep(12);
    }
  }

  async screenshot(file) {
    const r = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(file, Buffer.from(r.data, 'base64'));
    return file;
  }

  async consoleLogs() {
    return this.eval('return (window.__LOGS || []).slice(-50)');
  }

  async close() {
    try { this.ws && this.ws.close(); } catch (_) {}
    try { this.proc && this.proc.kill('SIGKILL'); } catch (_) {}
    try { fs.rmSync(this.profile, { recursive: true, force: true }); } catch (_) {}
  }
}

module.exports = { CDP, sleep };
