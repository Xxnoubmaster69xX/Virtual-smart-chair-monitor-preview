import React from 'react';
import { Language } from '../types';
import { translations } from '../i18n';

interface CircuitDiagramProps {
  activeRow: number;
  activeCol: number;
  activeValue: number;
  lang?: Language;
}

export const CircuitDiagram: React.FC<CircuitDiagramProps> = ({ activeRow, activeCol, activeValue, lang = 'en' }) => {
  const t = translations[lang];
  // Helper to get binary string for mux
  const toBinary = (num: number) => num.toString(2).padStart(4, '0');
  const rowBin = toBinary(activeRow);
  const colBin = toBinary(activeCol);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 font-mono text-xs relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
        <svg width="200" height="200" viewBox="0 0 100 100">
           <path d="M0 0 L100 100 M100 0 L0 100" stroke="white" strokeWidth="0.5"/>
        </svg>
      </div>

      <h3 className="text-gray-400 mb-4 font-sans font-semibold uppercase tracking-wider">{t.modB}</h3>

      <div className="flex flex-col gap-6">
        
        {/* Arduino Block */}
        <div className="border-2 border-cyan-700 bg-cyan-950/30 p-3 rounded relative">
          <div className="absolute -top-3 left-4 bg-gray-900 px-2 text-cyan-500 font-bold">VIRTUAL ARDUINO UNO</div>
          
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <div className="text-gray-500 mb-1">LOOP STATE</div>
              <div className="text-green-400">void loop() {'{'}</div>
              <div className="pl-2 text-gray-300">currentRow = <span className="text-yellow-400">{activeRow}</span>;</div>
              <div className="pl-2 text-gray-300">currentCol = <span className="text-yellow-400">{activeCol}</span>;</div>
              <div className="pl-2 text-gray-300">val = analogRead(A0);</div>
              <div className="text-green-400">{'}'}</div>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center bg-black/40 p-1 rounded border border-gray-700">
                <span className="text-gray-400">ADC (A0)</span>
                <span className="text-xl font-bold text-white">{activeValue}</span>
              </div>
              <div className="flex gap-2">
                 <div className={`w-3 h-3 rounded-full ${activeValue > 0 ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-red-900'}`} title="TX LED"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_green]" title="Power LED"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Multiplexers */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* MUX A (ROWS) */}
          <div className="border border-yellow-700/50 bg-yellow-900/10 p-2 rounded">
             <div className="text-yellow-500 font-bold mb-2">74HC4067 (ROWS)</div>
             <div className="grid grid-cols-2 gap-x-2">
                <div className="text-gray-500">S0: <span className={rowBin[3] === '1' ? 'text-red-400 font-bold' : 'text-gray-600'}>{rowBin[3]}</span></div>
                <div className="text-gray-500">S1: <span className={rowBin[2] === '1' ? 'text-red-400 font-bold' : 'text-gray-600'}>{rowBin[2]}</span></div>
                <div className="text-gray-500">S2: <span className={rowBin[1] === '1' ? 'text-red-400 font-bold' : 'text-gray-600'}>{rowBin[1]}</span></div>
                <div className="text-gray-500">S3: <span className={rowBin[0] === '1' ? 'text-red-400 font-bold' : 'text-gray-600'}>{rowBin[0]}</span></div>
             </div>
             <div className="mt-2 text-center text-xs text-gray-400 border-t border-gray-700 pt-1">
               Channel Active: {activeRow}
             </div>
          </div>

          {/* MUX B (COLS) */}
          <div className="border border-purple-700/50 bg-purple-900/10 p-2 rounded">
             <div className="text-purple-400 font-bold mb-2">74HC4067 (COLS)</div>
             <div className="grid grid-cols-2 gap-x-2">
                <div className="text-gray-500">S0: <span className={colBin[3] === '1' ? 'text-red-400 font-bold' : 'text-gray-600'}>{colBin[3]}</span></div>
                <div className="text-gray-500">S1: <span className={colBin[2] === '1' ? 'text-red-400 font-bold' : 'text-gray-600'}>{colBin[2]}</span></div>
                <div className="text-gray-500">S2: <span className={colBin[1] === '1' ? 'text-red-400 font-bold' : 'text-gray-600'}>{colBin[1]}</span></div>
                <div className="text-gray-500">S3: <span className={colBin[0] === '1' ? 'text-red-400 font-bold' : 'text-gray-600'}>{colBin[0]}</span></div>
             </div>
             <div className="mt-2 text-center text-xs text-gray-400 border-t border-gray-700 pt-1">
               Channel Active: {activeCol}
             </div>
          </div>
        </div>

        {/* Resistor / Velostat Logic */}
        <div className="text-[10px] text-gray-500">
           Logic: V_out = V_in * (R_fixed / (R_fixed + R_velostat_matrix[{activeRow}][{activeCol}]))
        </div>

      </div>
    </div>
  );
};