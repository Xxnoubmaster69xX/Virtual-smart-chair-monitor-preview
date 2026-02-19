import React, { useState, useRef, useEffect } from 'react';
import { Matrix15x15, Language } from '../types';
import { translations } from '../i18n';
import { Download, Disc, StopCircle, FolderOpen } from 'lucide-react';

interface DataRecorderProps {
  matrix: Matrix15x15;
  lang?: Language;
}

interface RecordedFrame {
  timestamp: number;
  label: string;
  matrix: Matrix15x15;
}

export const DataRecorder: React.FC<DataRecorderProps> = ({ matrix, lang = 'en' }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [label, setLabel] = useState("Neutral_Sit");
  const [frameCount, setFrameCount] = useState(0);
  const recordedDataRef = useRef<RecordedFrame[]>([]);
  const matrixRef = useRef(matrix);
  const t = translations[lang];

  // Keep ref synced with latest matrix without triggering re-renders of interval
  useEffect(() => {
    matrixRef.current = matrix;
  }, [matrix]);

  useEffect(() => {
    let interval: number | undefined;

    if (isRecording) {
      interval = window.setInterval(() => {
        const frame: RecordedFrame = {
          timestamp: Date.now(),
          label: label,
          matrix: JSON.parse(JSON.stringify(matrixRef.current)) // Deep copy
        };
        recordedDataRef.current.push(frame);
        setFrameCount(recordedDataRef.current.length);
      }, 200); // 5 times per second = 200ms
    }

    return () => clearInterval(interval);
  }, [isRecording, label]);

  const handleDownload = () => {
    if (recordedDataRef.current.length === 0) return;

    const dataStr = JSON.stringify(recordedDataRef.current, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `training_data_${label}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleOpenFolder = () => {
      alert("File saved to your default 'Downloads' folder.\n(Browser security prevents direct folder access).");
  };

  const clearBuffer = () => {
      if (confirm("Clear all recorded frames?")) {
          recordedDataRef.current = [];
          setFrameCount(0);
      }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 h-fit shadow-sm">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center justify-between">
         <span>{t.trainData}</span>
         {isRecording && <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
         </span>}
      </h3>

      <div className="space-y-3">
        <div>
           <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">{t.postureLabel}</label>
           <input 
             type="text" 
             value={label}
             onChange={(e) => setLabel(e.target.value)}
             className="w-full bg-black/40 border border-gray-700 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
             placeholder="e.g. Leaning_Left"
           />
        </div>

        <div className="flex items-center justify-between gap-2 bg-gray-950 p-2 rounded border border-gray-800">
           <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase">{t.buffer}</span>
              <span className="text-sm text-white font-mono">{frameCount} <span className="text-gray-600 text-[10px]">{t.frames}</span></span>
           </div>
           <div className="text-right">
              <span className="text-[10px] text-gray-500 uppercase">{t.duration}</span>
              <span className="text-sm text-white font-mono">{(frameCount * 0.2).toFixed(1)}s</span>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
           {!isRecording ? (
             <button 
               onClick={() => setIsRecording(true)}
               className="flex items-center justify-center gap-2 bg-red-900/50 hover:bg-red-900/70 text-red-200 border border-red-800 py-2 rounded text-xs font-bold transition-all"
             >
               <Disc size={14} /> {t.record}
             </button>
           ) : (
             <button 
               onClick={() => setIsRecording(false)}
               className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 py-2 rounded text-xs font-bold transition-all animate-pulse"
             >
               <StopCircle size={14} /> {t.stop}
             </button>
           )}

           <button 
             onClick={handleDownload}
             disabled={frameCount === 0}
             className={`flex items-center justify-center gap-2 border py-2 rounded text-xs font-bold transition-all
                ${frameCount > 0 
                  ? 'bg-blue-900/50 hover:bg-blue-900/70 text-blue-200 border-blue-800' 
                  : 'bg-gray-900 text-gray-600 border-gray-800 cursor-not-allowed'}`}
           >
             <Download size={14} /> {t.save}
           </button>
        </div>

        {frameCount > 0 && (
           <div className="flex gap-2">
              <button 
                onClick={clearBuffer}
                className="flex-1 text-[10px] text-gray-500 hover:text-red-400 underline decoration-dotted transition-colors"
              >
                {t.clearBuff}
              </button>
              <button 
                 onClick={handleOpenFolder}
                 className="flex-1 flex items-center justify-end gap-1 text-[10px] text-gray-500 hover:text-blue-400 transition-colors"
              >
                 <FolderOpen size={10} /> {t.openLoc}
              </button>
           </div>
        )}
      </div>
    </div>
  );
};