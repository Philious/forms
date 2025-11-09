#!/usr/bin/env ts-node

// ---------- Types ----------
export type WaveformType = 'sine' | 'square' | 'triangle' | 'custom';

export interface HeadphoneOutput {
  powerW: number;
  voltageRms: number;
  currentRms: number;
  powerDbm: number;
  splFrom1mW?: number;
  splFrom1Vrms?: number;
}

export interface HeadphoneParams {
  impedanceOhm: number;
  powerW?: number;
  voltageRms?: number;
  currentRms?: number;
  sensitivityDbPer1mW?: number;
  sensitivityDbPer1Vrms?: number;
}

// ---------- RMS Conversion ----------
/**
 * Converts peak or peak-to-peak voltage to RMS for a given waveform.
 * @param value - Measured voltage value.
 * @param type - "peak" or "p2p" to specify measurement reference.
 * @param waveform - The waveform type.
 * @returns RMS voltage.
 */
export function toRmsVoltage(value: number, type: 'peak' | 'p2p', waveform: WaveformType = 'sine'): number {
  const peak = type === 'p2p' ? value / 2 : value;

  switch (waveform) {
    case 'sine':
      return peak / Math.SQRT2;
    case 'square':
      return peak; // RMS = peak for square
    case 'triangle':
      return peak / Math.sqrt(3);
    default:
      throw new Error('Unsupported waveform type for RMS conversion.');
  }
}

// ---------- Headphone Output Calculation ----------
export function computeHeadphoneOutputs(params: HeadphoneParams): HeadphoneOutput {
  const R = params.impedanceOhm;
  if (!(R > 0)) throw new Error('impedanceOhm must be > 0');

  let { powerW, voltageRms, currentRms } = params;

  // Derive missing quantities
  if (voltageRms && !powerW) {
    powerW = voltageRms ** 2 / R;
    currentRms = voltageRms / R;
  } else if (currentRms && !powerW) {
    powerW = currentRms ** 2 * R;
    voltageRms = currentRms * R;
  } else if (powerW && !voltageRms) {
    voltageRms = Math.sqrt(powerW * R);
    currentRms = Math.sqrt(powerW / R);
  }

  if (!powerW || !voltageRms || !currentRms) throw new Error('Provide at least one of powerW, voltageRms, or currentRms.');

  const powerDbm = 10 * Math.log10(powerW / 0.001);

  const result: HeadphoneOutput = { powerW, voltageRms, currentRms, powerDbm };

  // Compute SPL from 1 mW sensitivity
  if (typeof params.sensitivityDbPer1mW === 'number') {
    result.splFrom1mW = params.sensitivityDbPer1mW + 10 * Math.log10(powerW / 0.001);
  }

  // Compute SPL from 1 Vrms sensitivity
  if (typeof params.sensitivityDbPer1Vrms === 'number') {
    result.splFrom1Vrms = params.sensitivityDbPer1Vrms + 20 * Math.log10(voltageRms / 1);
  }

  return result;
}

// ---------- CLI Helper ----------
if (require.main === module) {
  // Example CLI run
  const impedance = 32; // ohms
  const measuredP2P = 2.0; // volts peak-to-peak
  const waveform: WaveformType = 'sine';
  const sensitivityDbPer1mW = 100; // dB SPL @ 1 mW

  const voltageRms = toRmsVoltage(measuredP2P, 'p2p', waveform);

  const result = computeHeadphoneOutputs({
    impedanceOhm: impedance,
    voltageRms,
    sensitivityDbPer1mW,
  });

  console.log('🎧 Headphone Output Report');
  console.log('----------------------------');
  console.log(`Impedance: ${impedance} Ω`);
  console.log(`Waveform: ${waveform}`);
  console.log(`Measured Voltage (p-p): ${measuredP2P.toFixed(3)} V`);
  console.log(`Derived RMS Voltage: ${voltageRms.toFixed(3)} V`);
  console.log(`Power Delivered: ${(result.powerW * 1000).toFixed(3)} mW`);
  console.log(`Electrical Power: ${result.powerDbm.toFixed(2)} dBm`);
  if (result.splFrom1mW) console.log(`Estimated SPL (from 1mW spec): ${result.splFrom1mW.toFixed(2)} dB SPL`);
  console.log('----------------------------');
  console.log('⚠️  This SPL is approximate; real measurements vary with fit, frequency, and distortion.');
}
