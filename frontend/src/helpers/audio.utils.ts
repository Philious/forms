import { delay } from './utils';

export type AudioSignal = {
  frequency?: number;
  frqType?: 'sine' | 'square' | 'sawtooth' | 'triangle' | 'custom';
  durationMs?: number;
  gainDb?: number;
  pan?: number;
  audioCtx?: AudioContext;
};

/**
 * TypeScript utilities for converting between electrical and acoustic quantities for headphones.
 *
 * Notes:
 * - Sensitivity commonly appears as "dB SPL @ 1 mW" (dB per 1 milliwatt). If so, use `sensitivityDbPer1mW`.
 * - Some manufacturers give sensitivity as "dB SPL @ 1 Vrms"; that path is supported too (use `sensitivityDbPer1Vrms`).
 * - Real-world SPL depends on frequency, ear coupling, distortion, and measurement method — results are approximate.
 */

/** Results returned by computeHeadphoneOutputs */
interface HeadphoneOutput {
  powerW: number; // electrical power delivered (watts)
  voltageRms: number; // RMS voltage across the headphone (volts)
  currentRms: number; // RMS current through the headphone (amps)
  powerDbm: number; // electrical power in dBm (dB relative to 1 mW)
  splFrom1mW?: number; // estimated SPL if sensitivity is given in dB SPL @ 1 mW
  splFrom1Vrms?: number; // estimated SPL if sensitivity is given in dB SPL @ 1 Vrms
}

/**
 * Compute headphone electrical and acoustic outputs.
 *
 * @param params.impedanceOhm - headphone impedance in ohms (Ω)
 * @param params.powerW? - delivered electrical power in watts (if known)
 * @param params.voltageRms? - delivered RMS voltage in volts (if known)
 * @param params.currentRms? - delivered RMS current in amps (if known)
 * @param params.sensitivityDbPer1mW? - optional sensitivity spec: dB SPL at 1 mW
 * @param params.sensitivityDbPer1Vrms? - optional sensitivity spec: dB SPL at 1 Vrms
 *
 * At least one of powerW, voltageRms, or currentRms **must** be provided.
 */
export function computeHeadphoneOutputs(params: {
  impedanceOhm: number;
  powerW?: number;
  voltageRms?: number;
  currentRms?: number;
  sensitivityDbPer1mW?: number;
  sensitivityDbPer1Vrms?: number;
}): HeadphoneOutput {
  const R = params.impedanceOhm;
  if (!(R > 0)) throw new Error('impedanceOhm must be > 0');

  // derive missing electrical quantities
  let powerW = params.powerW ?? NaN;
  let voltageRms = params.voltageRms ?? NaN;
  let currentRms = params.currentRms ?? NaN;

  // If voltage known -> compute power & current
  if (!Number.isFinite(powerW) && Number.isFinite(voltageRms)) {
    powerW = (voltageRms * voltageRms) / R;
    currentRms = voltageRms / R;
  }

  // If current known -> compute power & voltage
  if (!Number.isFinite(powerW) && Number.isFinite(currentRms)) {
    powerW = currentRms * currentRms * R;
    voltageRms = currentRms * R;
  }

  // If power known -> compute voltage & current
  if (Number.isFinite(powerW) && !Number.isFinite(voltageRms)) {
    voltageRms = Math.sqrt(powerW * R);
    currentRms = Math.sqrt(powerW / R);
  }

  if (!Number.isFinite(powerW) || !Number.isFinite(voltageRms) || !Number.isFinite(currentRms)) {
    throw new Error('Insufficient electrical info: provide at least one of powerW, voltageRms, or currentRms.');
  }

  // Electrical power in dBm: 10 * log10(P / 1mW)
  const powerDbm = 10 * Math.log10(powerW / 0.001);

  const out: HeadphoneOutput = {
    powerW,
    voltageRms,
    currentRms,
    powerDbm,
  };

  // If sensitivity is given as dB SPL @ 1 mW:
  // SPL = sensitivity_dB_per_1mW + 10*log10(P_actual / 0.001)
  if (typeof params.sensitivityDbPer1mW === 'number') {
    out.splFrom1mW = params.sensitivityDbPer1mW + 10 * Math.log10(powerW / 0.001);
  }

  // If sensitivity is given as dB SPL @ 1 Vrms:
  // First compute ratio of Vrms to 1 Vrms: SPL = sensitivity_at_1Vrms + 20*log10(V_actual / 1V)
  if (typeof params.sensitivityDbPer1Vrms === 'number') {
    out.splFrom1Vrms = params.sensitivityDbPer1Vrms + 20 * Math.log10(voltageRms / 1);
  }

  return out;
}

export function percentToDecibels(value: number, maxDb: number): number {
  const normalized = Math.max(0, Math.min(value, 100)) / 100;
  if (normalized <= 0) return -Infinity; // silence
  return 20 * Math.log10(normalized) + maxDb;
}

export function decibelsToValue(db: number, maxDb: number): number {
  const linear = Math.pow(10, (db - maxDb) / 20);
  return Math.max(0, Math.min(linear * 100, 100));
}

export function genSound(opt?: AudioSignal) {
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const panNode = ctx.createStereoPanner();
  let playing = false;
  oscillator.type = 'sine';
  oscillator.frequency.value = opt?.frequency ?? 440;
  panNode.pan.value = opt?.pan ?? 0;

  // Convert dB gain to linear
  const linearGain = Math.pow(10, opt?.gainDb ?? 1 / 20);
  function play() {
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(linearGain, ctx.currentTime + 0.05); // fade in'
    oscillator.start();
  }

  function stop(delay?: number, callback?: () => void) {
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + (delay ?? 0));
    oscillator.onended = ctx.close;
    callback?.();
  }

  if (opt?.durationMs) {
    play();
    stop();
  }
  function volume(v: number) {
    gainNode.gain.value = v;
  }
  function pan(v: number) {
    panNode.pan.value = v;
  }
  function frequency(v: number) {
    oscillator.frequency.value = v;
  }
  function suspend() {
    if (playing) {
      playing = false;
      ctx.suspend();
    }
  }
  function resume() {
    if (!playing) {
      playing = true;
      ctx.resume();
    }
  }
  return { play, stop, suspend, resume, volume, pan, frequency };
}

export async function playTone(
  frequency: number,
  durationMs: number,
  gainDb: number,
  pan: number,
  callback?: () => void,
  audioCtx?: AudioContext
): Promise<void> {
  const ctx = audioCtx ?? new AudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const panNode = ctx.createStereoPanner();

  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;

  // Convert dB gain to linear
  const linearGain = gainDb; // Math.pow(10, gainDb / 20);
  console.log(linearGain);
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(linearGain, ctx.currentTime + 0.05); // fade in

  delay(durationMs, () => {
    for (let i = 0; i < 10; i++) {
      const vol = (9 - i) / 10;
      gainNode.gain.linearRampToValueAtTime(vol * gainDb, ctx.currentTime + i / 200);
    }
  });

  panNode.pan.value = pan;

  oscillator.connect(gainNode).connect(panNode).connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + durationMs / 1000 + 0.05);

  return new Promise(resolve => {
    oscillator.onended = () => {
      callback?.();
      resolve();
    };
  });
}
