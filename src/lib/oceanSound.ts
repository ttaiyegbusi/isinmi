// Self-contained synthesized ocean ambience (no audio file needed).
// Brown noise -> lowpass filter -> slow LFO-modulated gain to mimic the
// swell of waves. Swap this out for an <audio> element later if you want a
// real recording; the public API (toggleOcean / isOceanOn) stays the same.

type Ocean = {
  ctx: AudioContext;
  master: GainNode;
  on: boolean;
};

let instance: Ocean | null = null;

function build(): Ocean {
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AudioCtx();

  // brown noise buffer (2s, looped)
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.2;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 600;

  // wave swell: an LFO modulates the gain so it rises and falls like surf
  const waveGain = ctx.createGain();
  waveGain.gain.value = 0.55;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.11;
  const lfoDepth = ctx.createGain();
  lfoDepth.gain.value = 0.4;
  lfo.connect(lfoDepth).connect(waveGain.gain);

  const master = ctx.createGain();
  master.gain.value = 0;

  noise.connect(lowpass).connect(waveGain).connect(master).connect(ctx.destination);
  noise.start();
  lfo.start();

  return { ctx, master, on: false };
}

export function toggleOcean(): boolean {
  if (!instance) instance = build();
  const { ctx, master } = instance;
  if (ctx.state === "suspended") ctx.resume();

  instance.on = !instance.on;
  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(instance.on ? 0.22 : 0, now + 0.7);
  return instance.on;
}

export function isOceanOn(): boolean {
  return instance?.on ?? false;
}

// Short UI feedback cue played on toggle: a gentle rising tone when turning
// sound on, a softer falling tone when turning it off.
export function playToggleCue(on: boolean) {
  if (!instance) instance = build();
  const { ctx } = instance;
  if (ctx.state === "suspended") ctx.resume();

  const now = ctx.currentTime;
  const notes = on ? [587.33, 880] : [587.33, 440]; // D5->A5 up, D5->A4 down

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;

    const t = now + i * 0.09;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.14, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.2);
  });
}
