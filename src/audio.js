/* CRACK'D - tiny WebAudio synth. No audio files, all generated. */
window.Sfx = (function () {
  let ac = null;
  let muted = false;
  let modemNode = null;

  function ctx() {
    if (!ac) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ac = new AC();
    }
    if (ac.state === 'suspended') ac.resume();
    return ac;
  }

  function env(node, t0, a, d, peak) {
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t0 + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + a + d);
    node.connect(g);
    g.connect(ac.destination);
    return g;
  }

  function tone(freq, dur, type, vol, slideTo, delay) {
    const a = ctx();
    if (!a || muted) return;
    const t0 = a.currentTime + (delay || 0);
    const o = a.createOscillator();
    o.type = type || 'square';
    o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t0 + dur);
    env(o, t0, 0.008, dur, vol === undefined ? 0.08 : vol);
    o.start(t0);
    o.stop(t0 + dur + 0.05);
  }

  function noise(dur, vol, filterFreq, delay) {
    const a = ctx();
    if (!a || muted) return;
    const t0 = a.currentTime + (delay || 0);
    const len = Math.floor(a.sampleRate * dur);
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = a.createBufferSource();
    src.buffer = buf;
    const f = a.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = filterFreq || 1200;
    f.Q.value = 1.2;
    src.connect(f);
    env(f, t0, 0.005, dur, vol === undefined ? 0.05 : vol);
    src.start(t0);
  }

  const S = {
    setMuted(v) { muted = v; },
    get muted() { return muted; },
    unlock() { ctx(); },

    click() { tone(760, 0.035, 'square', 0.05); },
    select() { tone(520, 0.05, 'square', 0.045); tone(880, 0.04, 'square', 0.035, null, 0.04); },
    back() { tone(520, 0.05, 'square', 0.045); tone(330, 0.05, 'square', 0.035, null, 0.04); },
    error() { tone(180, 0.18, 'sawtooth', 0.07, 90); },
    deny() { tone(140, 0.1, 'square', 0.06); tone(120, 0.14, 'square', 0.06, null, 0.1); },
    open() { tone(520, 0.05, 'triangle', 0.05); tone(780, 0.06, 'triangle', 0.05, null, 0.05); tone(1040, 0.08, 'triangle', 0.04, null, 0.1); },
    close() { tone(700, 0.05, 'triangle', 0.04, 300); },
    type() { tone(1200 + Math.random() * 300, 0.012, 'square', 0.02); },
    coin() { tone(988, 0.06, 'square', 0.06); tone(1319, 0.1, 'square', 0.06, null, 0.06); },
    jump() { tone(320, 0.12, 'square', 0.06, 620); },
    die() { tone(300, 0.4, 'sawtooth', 0.08, 60); noise(0.3, 0.05, 500); },
    virus() {
      tone(90, 0.7, 'sawtooth', 0.09, 60);
      tone(93, 0.7, 'sawtooth', 0.07, 58);
      noise(0.5, 0.06, 300);
      tone(1400, 0.09, 'square', 0.05, 200);
    },
    win() {
      const n = [523, 659, 784, 1046];
      n.forEach((f, i) => tone(f, 0.16, 'square', 0.06, null, i * 0.11));
    },
    lose() {
      const n = [392, 349, 294, 196];
      n.forEach((f, i) => tone(f, 0.22, 'sawtooth', 0.06, null, i * 0.16));
    },
    bsod() {
      tone(70, 1.4, 'square', 0.09);
      tone(140, 1.4, 'sawtooth', 0.05);
      noise(0.8, 0.05, 200);
    },
    dial() {
      // the sacred dial-up handshake
      tone(2100, 0.25, 'sine', 0.035); tone(1750, 0.25, 'sine', 0.035, null, 0.25);
      tone(2100, 0.25, 'sine', 0.035, null, 0.5);
      tone(980, 0.4, 'sine', 0.035, null, 0.75);
      noise(0.6, 0.028, 2400, 1.1);
      tone(1200, 0.3, 'sine', 0.03, null, 1.7);
      tone(400, 0.9, 'sine', 0.03, 300, 2.0);
    },
    modemStart() {
      if (modemNode) return;
      const a = ctx();
      if (!a || muted) return;
      const t0 = a.currentTime;
      const o = a.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(2100, t0);
      o.frequency.linearRampToValueAtTime(1200, t0 + 1.6);
      const lfo = a.createOscillator();
      lfo.frequency.value = 7;
      const lg = a.createGain();
      lg.gain.value = 220;
      lfo.connect(lg);
      lg.connect(o.frequency);
      const g = a.createGain();
      g.gain.value = 0.022;
      o.connect(g);
      g.connect(a.destination);
      o.start(t0);
      lfo.start(t0);
      modemNode = { o, lfo, g };
    },
    modemStop() {
      if (!modemNode) return;
      try {
        modemNode.o.stop();
        modemNode.lfo.stop();
      } catch (e) { /* already stopped */ }
      modemNode = null;
    },
  };

  return S;
})();
