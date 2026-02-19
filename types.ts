export type Matrix15x15 = number[][]; // 0-1023 values

export interface Point {
  row: number;
  col: number;
}

export interface SimulationState {
  matrix: Matrix15x15;
  activeRow: number;
  activeCol: number;
  isScanning: boolean;
  pressureCenter: Point | null;
  lastScanTime: number;
}

export interface Alert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  message: string;
  timestamp: number;
}

export interface HistoricalFrame {
  timestamp: number;
  matrix: Matrix15x15;
  cop: Point | null; // Center of Pressure
}

export type Language = 'en' | 'es' | 'zh';

export const MATRIX_SIZE = 15;
export const MAX_PRESSURE = 1023; // 10-bit ADC
export const PRESSURE_THRESHOLD_WARNING = 700;
export const PRESSURE_THRESHOLD_CRITICAL = 900;
export const STATIC_PRESSURE_TIME_LIMIT = 5000; // 5 seconds for demo purposes (real world would be minutes)