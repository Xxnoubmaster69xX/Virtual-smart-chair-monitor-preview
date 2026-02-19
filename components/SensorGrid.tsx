import React, { useState, useRef } from 'react';
import { MATRIX_SIZE, MAX_PRESSURE, Language } from '../types';
import { translations } from '../i18n';

interface SensorGridProps {
  matrix: number[][];
  onUpdateMatrix: (newMatrix: number[][]) => void;
  activeRow: number;
  activeCol: number;
  isScanning: boolean;
  lang?: Language;
}

export const SensorGrid: React.FC<SensorGridProps> = ({ 
  matrix, 
  onUpdateMatrix, 
  activeRow, 
  activeCol,
  isScanning,
  lang = 'en'
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const gridRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  const handleInteraction = (r: number, c: number, buttons: number) => {
    // Check if left click (1) or if called from mouse enter while drawing
    if (buttons !== 1 && buttons !== 0) return; 

    const newMatrix = matrix.map(row => [...row]);
    
    // Brush physics: Add pressure in a small radius to simulate soft tissue
    const brushRadius = 1;
    const intensity = 200; // Pressure added per frame

    for (let i = -brushRadius; i <= brushRadius; i++) {
      for (let j = -brushRadius; j <= brushRadius; j++) {
        const nr = r + i;
        const nc = c + j;
        
        if (nr >= 0 && nr < MATRIX_SIZE && nc >= 0 && nc < MATRIX_SIZE) {
          const dist = Math.sqrt(i*i + j*j);
          if (dist <= brushRadius) {
            let val = newMatrix[nr][nc];
            if (mode === 'add') {
              val = Math.min(MAX_PRESSURE, val + intensity * (1 - dist/2));
            } else {
              val = Math.max(0, val - intensity);
            }
            newMatrix[nr][nc] = Math.round(val);
          }
        }
      }
    }
    
    onUpdateMatrix(newMatrix);
  };

  const handleMouseDown = (r: number, c: number, e: React.MouseEvent) => {
    setIsDrawing(true);
    setMode(e.button === 2 ? 'remove' : 'add'); // Right click to remove
    handleInteraction(r, c, 1);
  };

  const handleMouseEnter = (r: number, c: number) => {
    if (isDrawing) {
      handleInteraction(r, c, 1);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{t.modA}</h3>
        <div className="text-xs text-gray-500">
          <span className="mr-3">{t.clickAdd}</span>
          <span>{t.clickRemove}</span>
        </div>
      </div>
      
      <div 
        ref={gridRef}
        className="grid gap-[1px] bg-gray-800 border border-gray-700 p-1 rounded select-none shadow-inner"
        style={{ 
          gridTemplateColumns: `repeat(${MATRIX_SIZE}, minmax(0, 1fr))`,
          aspectRatio: '1/1'
        }}
        onMouseLeave={() => setIsDrawing(false)}
        onMouseUp={() => setIsDrawing(false)}
        onContextMenu={(e) => e.preventDefault()}
      >
        {matrix.map((row, r) => (
          row.map((val, c) => {
            // Visualizing the active scan
            const isScanned = isScanning && activeRow === r && activeCol === c;
            const isActiveRow = isScanning && activeRow === r;
            
            // Color mapping for input view (Greyscale for Velostat resistance feel)
            const opacity = val / MAX_PRESSURE;
            
            return (
              <div
                key={`${r}-${c}`}
                onMouseDown={(e) => handleMouseDown(r, c, e)}
                onMouseEnter={() => handleMouseEnter(r, c)}
                className={`
                  relative flex items-center justify-center
                  cursor-pointer transition-colors duration-75
                  ${isActiveRow ? 'ring-1 ring-blue-500/30 z-10' : ''}
                  ${isScanned ? 'ring-2 ring-cyan-400 z-20 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : ''}
                `}
                style={{
                  backgroundColor: `rgba(200, 200, 200, ${0.1 + opacity * 0.9})`
                }}
              >
                {/* Visual debug for copper strips */}
                {val > 50 && (
                  <div className="w-1 h-1 bg-black/50 rounded-full opacity-50"></div>
                )}
              </div>
            );
          })
        ))}
      </div>
      <div className="flex justify-center mt-2">
         <button 
           onClick={() => onUpdateMatrix(Array(MATRIX_SIZE).fill(0).map(() => Array(MATRIX_SIZE).fill(0)))}
           className="text-xs text-red-400 hover:text-red-300 border border-red-900/50 bg-red-900/20 px-3 py-1 rounded transition-colors"
         >
           {t.clearMatrix}
         </button>
      </div>
    </div>
  );
};