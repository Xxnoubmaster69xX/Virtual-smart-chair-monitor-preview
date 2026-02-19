import React from 'react';
import { MATRIX_SIZE, MAX_PRESSURE, Point, Language } from '../types';
import { translations } from '../i18n';

interface HeatmapDisplayProps {
  matrix: number[][];
  centerOfPressure: Point | null;
  lang?: Language;
}

export const HeatmapDisplay: React.FC<HeatmapDisplayProps> = ({ matrix, centerOfPressure, lang = 'en' }) => {
  const t = translations[lang];

  // Heatmap Color Logic:
  // Low (0-300): Black -> Blue
  // Mid (301-700): Blue -> Yellow
  // High (701-1023): Yellow -> Red -> White
  const getColor = (value: number) => {
    if (value === 0) return 'rgb(20, 20, 25)'; // Base seat color
    const normalized = value / MAX_PRESSURE;
    
    // Simple interpolation for "Thermography" look
    if (normalized < 0.2) {
       const intensity = normalized * 5; 
       return `rgb(0, 0, ${Math.floor(intensity * 150 + 50)})`;
    } else if (normalized < 0.5) {
       const intensity = (normalized - 0.2) * 3.33;
       return `rgb(0, ${Math.floor(intensity * 255)}, ${Math.floor(200 - intensity * 100)})`;
    } else if (normalized < 0.8) {
       const intensity = (normalized - 0.5) * 3.33;
       return `rgb(${Math.floor(intensity * 255)}, ${Math.floor(255 - intensity * 50)}, 0)`;
    } else {
       const intensity = (normalized - 0.8) * 5; 
       return `rgb(255, ${Math.floor(200 - intensity * 200)}, ${Math.floor(200 - intensity * 200)})`;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-2">
         <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{t.modC}</h3>
         <div className="flex gap-2 text-[10px]">
           <span className="flex items-center"><span className="w-2 h-2 bg-blue-900 mr-1"></span> Low</span>
           <span className="flex items-center"><span className="w-2 h-2 bg-yellow-500 mr-1"></span> Med</span>
           <span className="flex items-center"><span className="w-2 h-2 bg-red-600 mr-1"></span> High</span>
         </div>
      </div>

      <div className="relative bg-black border border-gray-700 rounded p-1 shadow-2xl flex-grow flex items-center justify-center">
        <div 
           className="grid gap-0 w-full aspect-square"
           style={{ gridTemplateColumns: `repeat(${MATRIX_SIZE}, 1fr)` }}
        >
          {matrix.map((row, r) => (
            row.map((val, c) => (
              <div 
                key={`h-${r}-${c}`}
                className="w-full h-full transition-colors duration-100"
                style={{ backgroundColor: getColor(val) }}
              />
            ))
          ))}
        </div>

        {/* Overlay Grid Lines (optional for aesthetic) */}
        <div className="absolute inset-0 grid pointer-events-none opacity-20"
             style={{ 
               gridTemplateColumns: `repeat(${MATRIX_SIZE}, 1fr)`,
               gridTemplateRows: `repeat(${MATRIX_SIZE}, 1fr)`
             }}>
           {Array.from({ length: MATRIX_SIZE * MATRIX_SIZE }).map((_, i) => (
             <div key={i} className="border-[0.5px] border-white/10"></div>
           ))}
        </div>

        {/* Center of Pressure Marker */}
        {centerOfPressure && (
          <div 
            className="absolute w-4 h-4 border-2 border-white rounded-full shadow-[0_0_10px_white] z-30 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
            style={{
              left: `${(centerOfPressure.col / (MATRIX_SIZE - 1)) * 100}%`,
              top: `${(centerOfPressure.row / (MATRIX_SIZE - 1)) * 100}%`,
            }}
          >
             <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
        )}
      </div>

      <div className="mt-4 bg-gray-900 p-2 rounded text-xs font-mono text-green-400 overflow-hidden whitespace-nowrap">
        <span className="text-gray-500 select-none">$ Serial Output &gt; </span>
        {`{"ts": ${Date.now()}, "cop": [${centerOfPressure?.row.toFixed(1) || 0}, ${centerOfPressure?.col.toFixed(1) || 0}], "max": ${Math.max(...matrix.flat())}}`}
      </div>
    </div>
  );
};