import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../i18n';

interface SchematicViewProps {
  activeRow: number;
  activeCol: number;
  lang?: Language;
}

export const SchematicView: React.FC<SchematicViewProps> = ({ activeRow, activeCol, lang = 'en' }) => {
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);
  const [lockedHighlight, setLockedHighlight] = useState<'row' | 'col' | null>(null);
  const t = translations[lang];

  // Helper to get bit state
  const getBit = (val: number, bit: number) => (val >> bit) & 1;

  // Visual constants
  const ON_COLOR = "#06b6d4"; // Cyan-500 (Digital High)
  const OFF_COLOR = "#374151"; // Gray-700
  const SIGNAL_COLOR = "#ef4444"; // Red-500 (Analog signal reading)
  const POWER_COLOR = "#22c55e"; // Green-500 (5V Source)

  // Calculate binary states
  const rowBits = [0, 1, 2, 3].map(b => getBit(activeRow, b));
  const colBits = [0, 1, 2, 3].map(b => getBit(activeCol, b));

  const isFocusMode = hoveredComponent !== null || lockedHighlight !== null;

  const checkVisibility = (tags: string[]) => {
      if (!isFocusMode) return { dim: false, highlight: false };

      const activeTags = new Set<string>();

      if (hoveredComponent === 'arduino') {
          ['ctrl-row', 'ctrl-col', 'power', 'signal'].forEach(t => activeTags.add(t));
      }
      if (hoveredComponent === 'mux-a' || lockedHighlight === 'row') {
          ['ctrl-row', 'power', 'bus-row'].forEach(t => activeTags.add(t));
      }
      if (hoveredComponent === 'mux-b' || lockedHighlight === 'col') {
          ['ctrl-col', 'signal', 'bus-col'].forEach(t => activeTags.add(t));
      }
      if (hoveredComponent === 'matrix') {
           ['bus-row', 'bus-col'].forEach(t => activeTags.add(t));
      }
      if (hoveredComponent === 'resistor') {
          ['signal'].forEach(t => activeTags.add(t));
      }

      const isMatch = tags.some(t => activeTags.has(t));
      return {
          dim: !isMatch,
          highlight: isMatch
      };
  };

  // Drawing helpers
  const Trace = ({ d, active, color = ON_COLOR, dashed = false, tags = [] }: { d: string, active: boolean, color?: string, dashed?: boolean, tags?: string[] }) => {
      const { dim, highlight } = checkVisibility(tags);
      
      let strokeOpacity = active ? 1 : 0.4;
      let strokeWidth = active ? 2.5 : 1;
      let strokeColor = active ? color : OFF_COLOR;

      if (isFocusMode) {
          if (dim) {
              strokeOpacity = 0.1;
          } else if (highlight) {
              strokeOpacity = 1;
              strokeWidth = active ? 3 : 1.5;
              strokeColor = active ? color : '#6b7280'; // Show structure even if inactive
          }
      }

    return (
      <path 
        d={d} 
        stroke={strokeColor} 
        strokeWidth={strokeWidth} 
        strokeDasharray={dashed ? "4 2" : "none"}
        fill="none" 
        className="transition-all duration-300"
        opacity={strokeOpacity}
      />
    );
  };

  const Pin = ({ x, y, label, active, align="right", tags=[] }: { x: number, y: number, label: string, active?: boolean, align?: "left"|"right", tags?: string[] }) => {
    const { dim } = checkVisibility(tags);
    const opacity = isFocusMode && dim ? 0.2 : 1;
    
    return (
        <g transform={`translate(${x},${y})`} opacity={opacity} className="transition-opacity duration-300">
        <circle r="3" fill="#1f2937" stroke={active ? ON_COLOR : "#4b5563"} strokeWidth="1.5" />
        <text 
            x={align === "right" ? -8 : 8} 
            y={3} 
            textAnchor={align === "right" ? "end" : "start"} 
            className={`text-[9px] font-mono ${active ? "fill-white" : "fill-gray-500"}`}
        >
            {label}
        </text>
        </g>
    );
  };

  const Chip = ({ x, y, w, h, label, sub, id }: { x: number, y: number, w: number, h: number, label: string, sub: string, id: string }) => {
    const isHovered = hoveredComponent === id;
    
    // Determine connection relevance for dimming
    let related = !isFocusMode;
    if (isFocusMode) {
       if (isHovered) related = true;
       // Relationship Map
       if (hoveredComponent === 'arduino' && ['mux-a', 'mux-b'].includes(id)) related = true;
       if (hoveredComponent === 'mux-a' && ['arduino', 'matrix'].includes(id)) related = true;
       if (hoveredComponent === 'mux-b' && ['arduino', 'matrix'].includes(id)) related = true;
       if (hoveredComponent === 'matrix' && ['mux-a', 'mux-b'].includes(id)) related = true;
       if (lockedHighlight === 'row' && ['arduino', 'mux-a', 'matrix'].includes(id)) related = true;
       if (lockedHighlight === 'col' && ['arduino', 'mux-b', 'matrix'].includes(id)) related = true;
    }

    const strokeColor = isHovered ? "#38bdf8" : "#374151";

    return (
        <g 
            transform={`translate(${x},${y})`} 
            className="cursor-pointer transition-all duration-300"
            onMouseEnter={() => setHoveredComponent(id)}
            onMouseLeave={() => setHoveredComponent(null)}
            opacity={related ? 1 : 0.2}
        >
        <rect width={w} height={h} rx="4" fill="#111827" stroke={strokeColor} strokeWidth={isHovered ? 3 : 2} />
        <text x={w/2} y={20} textAnchor="middle" className="text-sm font-bold fill-gray-200 pointer-events-none select-none">{label}</text>
        <text x={w/2} y={35} textAnchor="middle" className="text-[10px] fill-gray-500 uppercase pointer-events-none select-none">{sub}</text>
        </g>
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-950 p-6 rounded-xl border border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">{t.schematicTitle}</h2>
          <p className="text-gray-500 text-sm">{t.schematicDesc}</p>
        </div>
        <div className="flex gap-4 text-xs font-mono bg-black/20 p-2 rounded border border-gray-800">
           
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 bg-cyan-500 rounded-full shadow-[0_0_8px_cyan]"></div> {t.controlDig}
           </div>

           <button 
             onClick={() => setLockedHighlight(prev => prev === 'row' ? null : 'row')}
             className={`flex items-center gap-2 px-2 py-1 rounded transition-colors border ${
               lockedHighlight === 'row' ? 'bg-green-900/40 border-green-500 text-green-200' : 'border-transparent hover:bg-gray-800'
             }`}
           >
             <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_8px_green]"></div> 
             {lockedHighlight === 'row' ? t.rowsLock : t.rows5v}
           </button>

           <button 
             onClick={() => setLockedHighlight(prev => prev === 'col' ? null : 'col')}
             className={`flex items-center gap-2 px-2 py-1 rounded transition-colors border ${
               lockedHighlight === 'col' ? 'bg-red-900/40 border-red-500 text-red-200' : 'border-transparent hover:bg-gray-800'
             }`}
           >
             <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_8px_red]"></div> 
             {lockedHighlight === 'col' ? t.colsLock : t.colsSig}
           </button>
        </div>
      </div>

      <div className="flex-grow relative bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden flex items-center justify-center">
        <svg viewBox="0 0 900 550" className="w-full h-full max-w-5xl select-none">
          
          {/* --- COMPONENTS --- */}
          
          {/* Arduino */}
          <Chip x={50} y={100} w={140} h={350} label="Arduino Uno" sub="Microcontroller" id="arduino" />
          
          {/* MUX 1 (Rows - Power Source) */}
          <Chip x={320} y={40} w={100} h={200} label="74HC4067" sub="MUX A (Rows)" id="mux-a" />
          
          {/* MUX 2 (Cols - Sensor Read) */}
          <Chip x={320} y={290} w={100} h={200} label="74HC4067" sub="MUX B (Cols)" id="mux-b" />

          {/* Sensor Matrix */}
          <g 
            transform="translate(580, 130)"
            onMouseEnter={() => setHoveredComponent('matrix')}
            onMouseLeave={() => setHoveredComponent(null)}
            opacity={(isFocusMode && !['matrix', 'mux-a', 'mux-b', 'arduino'].includes(hoveredComponent || '') && !lockedHighlight) ? 0.2 : 1}
            className="transition-opacity duration-300 cursor-pointer"
          >
            {/* PCB/Base */}
            <rect x="-10" y="-10" width={170} height={170} rx="4" fill="#0f1115" stroke="#374151" />
            <text x={75} y={-20} textAnchor="middle" className="fill-gray-400 text-xs font-bold pointer-events-none">Velostat Matrix (15x15)</text>
            
            {/* Grid Lines */}
            {Array.from({length: 15}).map((_, i) => (
                <line 
                    key={`mat-row-${i}`} 
                    x1={0} y1={i*10 + 5} x2={150} y2={i*10 + 5} 
                    stroke={i === activeRow ? POWER_COLOR : "#1f2937"} 
                    strokeWidth={i === activeRow ? 2 : 1}
                />
            ))}
             {Array.from({length: 15}).map((_, i) => (
                <line 
                    key={`mat-col-${i}`} 
                    x1={i*10 + 5} y1={0} x2={i*10 + 5} y2={150} 
                    stroke={i === activeCol ? SIGNAL_COLOR : "#1f2937"} 
                    strokeWidth={i === activeCol ? 2 : 1}
                />
            ))}
            
            {/* Active Intersection */}
            <circle cx={activeCol * 10 + 5} cy={activeRow * 10 + 5} r="4" fill="white" className="animate-pulse shadow-[0_0_10px_white]" />
            
            {/* Ports */}
            {Array.from({length: 15}).map((_, i) => (
                <circle key={`port-r-${i}`} cx={0} cy={i*10+5} r="1.5" fill="#4b5563" />
            ))}
            {Array.from({length: 15}).map((_, i) => (
                <circle key={`port-c-${i}`} cx={i*10+5} cy={150} r="1.5" fill="#4b5563" />
            ))}
          </g>


          {/* --- WIRING BUSES --- */}

          {/* 1. MUX A OUTPUTS (C0-C14) -> MATRIX ROWS */}
          {Array.from({length: 16}).map((_, i) => {
             const isConnected = i < 15;
             const isActive = isConnected && i === activeRow;
             const startX = 420; // MUX Right
             const startY = 60 + i * 11; 
             const endX = 580; // Matrix Left
             const endY = 130 + i * 10 + 5; 

             if (!isConnected) {
                return <text key={`muxa-nc-${i}`} x={startX - 4} y={startY + 3} textAnchor="end" className="text-[7px] fill-gray-800 font-mono">C{i}</text>;
             }

             return (
                <g key={`bus-row-${i}`}>
                   <text x={startX - 4} y={startY + 3} textAnchor="end" className={`text-[8px] font-mono ${isActive ? "fill-white" : "fill-gray-600"}`}>C{i}</text>
                   <Trace 
                     d={`M ${startX} ${startY} C ${startX + 60} ${startY}, ${endX - 60} ${endY}, ${endX} ${endY}`}
                     active={isActive}
                     color={POWER_COLOR}
                     tags={['bus-row']}
                   />
                </g>
             );
          })}


          {/* 2. MATRIX COLS -> MUX B INPUTS (C0-C14) */}
          {Array.from({length: 16}).map((_, i) => {
             const isConnected = i < 15;
             const isActive = isConnected && i === activeCol;
             const startX = 580 + i * 10 + 5;
             const startY = 280; 
             const endX = 420; 
             const endY = 310 + i * 11; 

             if (!isConnected) {
                 return <text key={`muxb-nc-${i}`} x={endX - 4} y={endY + 3} textAnchor="end" className="text-[7px] fill-gray-800 font-mono">C{i}</text>;
             }

             return (
                <g key={`bus-col-${i}`}>
                   <text x={endX - 4} y={endY + 3} textAnchor="end" className={`text-[8px] font-mono ${isActive ? "fill-white" : "fill-gray-600"}`}>C{i}</text>
                   <Trace 
                     d={`
                        M ${startX} ${startY} 
                        L ${startX} ${startY + 20 + (i%3)*5} 
                        C ${startX} ${startY + 60}, ${endX + 60} ${endY}, ${endX} ${endY}
                     `}
                     active={isActive}
                     color={SIGNAL_COLOR}
                     tags={['bus-col']}
                   />
                </g>
             );
          })}


          {/* 3. ARDUINO -> MUX CONTROL LINES */}
          
          {/* MUX A Controls (D2-D5) */}
          {rowBits.map((bit, i) => (
             <React.Fragment key={`ctrl-row-${i}`}>
               <Pin x={190} y={150 + i*15} label={`D${2+i}`} active={!!bit} align="left" tags={['ctrl-row']} />
               <Trace 
                 d={`M 190 ${150 + i*15} L 240 ${150 + i*15} L 240 ${80 + i*15} L 320 ${80 + i*15}`} 
                 active={!!bit} 
                 tags={['ctrl-row']}
               />
               <text x={325} y={84 + i*15} className="text-[9px] fill-gray-500 font-mono" opacity={isFocusMode && checkVisibility(['ctrl-row']).dim ? 0.1 : 1}>S{i}</text>
             </React.Fragment>
          ))}

          {/* MUX B Controls (D6-D9) */}
          {colBits.map((bit, i) => (
             <React.Fragment key={`ctrl-col-${i}`}>
               <Pin x={190} y={230 + i*15} label={`D${6+i}`} active={!!bit} align="left" tags={['ctrl-col']} />
               <Trace 
                 d={`M 190 ${230 + i*15} L 240 ${230 + i*15} L 240 ${330 + i*15} L 320 ${330 + i*15}`} 
                 active={!!bit} 
                 tags={['ctrl-col']}
               />
               <text x={325} y={334 + i*15} className="text-[9px] fill-gray-500 font-mono" opacity={isFocusMode && checkVisibility(['ctrl-col']).dim ? 0.1 : 1}>S{i}</text>
             </React.Fragment>
          ))}


          {/* 4. MAIN SIGNAL PATHS */}
          
          {/* Power -> MUX A SIG */}
          <Pin x={190} y={380} label="5V" active={true} align="left" tags={['power']} />
          <Trace d="M 190 380 L 220 380 L 220 50 L 320 50" active={true} color={POWER_COLOR} tags={['power']} />
          <text x={325} y={54} className="text-[9px] fill-gray-500 font-mono" opacity={isFocusMode && checkVisibility(['power']).dim ? 0.1 : 1}>SIG</text>

          {/* MUX B SIG -> A0 */}
          <text x={325} y={304} className="text-[9px] fill-gray-500 font-mono" opacity={isFocusMode && checkVisibility(['signal']).dim ? 0.1 : 1}>SIG</text>
          <Trace d="M 320 300 L 280 300 L 280 410 L 190 410" active={true} color={SIGNAL_COLOR} tags={['signal']} />
          <Pin x={190} y={410} label="A0" active={true} align="left" tags={['signal']} />

          {/* Voltage Divider Resistor */}
           <g 
             transform="translate(260, 440)" 
             onMouseEnter={() => setHoveredComponent('resistor')}
             onMouseLeave={() => setHoveredComponent(null)}
             className="cursor-pointer"
             opacity={isFocusMode && checkVisibility(['signal']).dim ? 0.2 : 1}
           >
             <path d="M 20 -30 L 20 0 L 15 2 L 25 4 L 15 6 L 25 8 L 15 10 L 25 12 L 20 14 L 20 25" stroke="#9ca3af" fill="none" />
             <text x={30} y={10} className="text-[10px] fill-gray-500">10kΩ</text>
             <line x1={10} y1={25} x2={30} y2={25} stroke="#9ca3af" /> 
             <line x1={15} y1={28} x2={25} y2={28} stroke="#9ca3af" />
             <text x={35} y={30} className="text-[10px] fill-gray-500">GND</text>
             <circle cx={20} cy={-30} r="2" fill="#9ca3af" />
             <rect x="0" y="-35" width="50" height="70" fill="transparent" /> {/* Hitbox */}
          </g>

        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-gray-950/90 p-3 rounded border border-gray-800 text-xs font-mono">
            <div className="text-gray-500 mb-2 border-b border-gray-800 pb-1">{t.scanStatus}</div>
            <div className="flex justify-between gap-8 mb-1">
              <span className="text-gray-400">MUX A (Rows)</span>
              <span className="text-green-400">CH {activeRow}</span>
            </div>
            <div className="flex justify-between gap-8">
              <span className="text-gray-400">MUX B (Cols)</span>
              <span className="text-red-400">CH {activeCol}</span>
            </div>
        </div>

      </div>
    </div>
  );
};