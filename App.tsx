import { useState, useEffect, useRef } from 'react';
import { SensorGrid } from './components/SensorGrid';
import { CircuitDiagram } from './components/CircuitDiagram';
import { HeatmapDisplay } from './components/HeatmapDisplay';
import { AlertPanel } from './components/AlertPanel';
import { DataRecorder } from './components/DataRecorder';
import { SchematicView } from './components/SchematicView';
import { BuildGuide } from './components/BuildGuide';
import { ProjectInfo } from './components/ProjectInfo';
import { 
  Matrix15x15, 
  Point, 
  Alert, 
  MATRIX_SIZE, 
  PRESSURE_THRESHOLD_CRITICAL,
  STATIC_PRESSURE_TIME_LIMIT,
  Language
} from './types';
import { translations } from './i18n';
import { Cpu, LayoutDashboard, Zap, Search, Hammer, Info, Globe } from 'lucide-react';

const INITIAL_MATRIX: Matrix15x15 = Array(MATRIX_SIZE).fill(0).map(() => Array(MATRIX_SIZE).fill(0));

function App() {
  // --- State ---
  const [matrix, setMatrix] = useState<Matrix15x15>(INITIAL_MATRIX);
  // setIsScanning removed because it was unused (TS6133)
  const [isScanning] = useState(true);
  const [activeTab, setActiveTab] = useState<'monitor' | 'schematic' | 'build' | 'info'>('monitor');
  const [scanSpeed, setScanSpeed] = useState<'analysis' | 'realtime'>('realtime');
  const [lang, setLang] = useState<Language>('en');
  
  const t = translations[lang];

  // Scanning State (Visual simulation only, real data updates instantly for UX)
  const [scanRow, setScanRow] = useState(0);
  const [scanCol, setScanCol] = useState(0);
  
  // Derived Data
  const [cop, setCop] = useState<Point | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  
  // Static Pressure Tracking
  const highPressureTimerRef = useRef<{ [key: string]: number }>({});
  
  // --- Simulation Loop for Circuit Visualization ---
  useEffect(() => {
    if (!isScanning) return;
    
    // Determine speed: Analysis = 200ms (traceable), Realtime = 5ms (fast visual)
    const delay = scanSpeed === 'analysis' ? 200 : 5;

    const interval = setInterval(() => {
      setScanCol(prevCol => {
        if (prevCol >= MATRIX_SIZE - 1) {
          setScanRow(prevRow => (prevRow + 1) % MATRIX_SIZE);
          return 0;
        }
        return prevCol + 1;
      });
    }, delay);

    return () => clearInterval(interval);
  }, [isScanning, scanSpeed]);

  // --- Data Processing Loop (Scientific Logic) ---
  useEffect(() => {
    // 1. Calculate Center of Pressure (CoP)
    // CoP = (Sum(P_i * X_i) / Sum(P_i), Sum(P_i * Y_i) / Sum(P_i))
    let totalPressure = 0;
    let weightedRow = 0;
    let weightedCol = 0;
    let maxVal = 0;

    // Reset loop
    const now = Date.now();
    const timers = highPressureTimerRef.current;

    for (let r = 0; r < MATRIX_SIZE; r++) {
      for (let c = 0; c < MATRIX_SIZE; c++) {
        const p = matrix[r][c];
        totalPressure += p;
        weightedRow += p * r;
        weightedCol += p * c;
        if (p > maxVal) maxVal = p;

        // Static Pressure Monitoring
        const key = `${r}-${c}`;
        if (p > PRESSURE_THRESHOLD_CRITICAL) {
          if (!timers[key]) {
            timers[key] = now;
          }
        } else {
          delete timers[key];
        }
      }
    }

    if (totalPressure > 100) {
      setCop({
        row: weightedRow / totalPressure,
        col: weightedCol / totalPressure
      });
    } else {
      setCop(null);
    }

    // Alert Logic Check
    const criticalCount = Object.keys(timers).filter(k => (now - timers[k] > STATIC_PRESSURE_TIME_LIMIT)).length;
    
    setAlerts(prev => {
      const currentAlerts = [...prev];
      // Remove old resolved alerts
      if (criticalCount === 0) {
        return currentAlerts.filter(a => a.type !== 'critical');
      }
      
      // Add new alert if needed
      if (criticalCount > 5 && !currentAlerts.some(a => a.type === 'critical')) {
        return [
          {
            id: `crit-${now}`,
            type: 'critical',
            message: `Static High Pressure Detected in ${criticalCount} zones! Reposition Required.`,
            timestamp: now
          },
          ...currentAlerts
        ];
      }
      return currentAlerts;
    });

  }, [matrix]); // Re-run when matrix changes

  // Helper to interpret key presses for accessibility or debug
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'c') {
        setMatrix(INITIAL_MATRIX);
        setAlerts([]);
        highPressureTimerRef.current = {};
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-4 md:p-8 font-sans flex flex-col">
      <header className="mb-8 border-b border-gray-800 pb-4">
        <div className="flex flex-col xl:flex-row justify-between items-end gap-4">
          <div>
             <h1 className="text-2xl font-bold text-white tracking-tight">{t.appTitle}</h1>
             <p className="text-gray-500 text-sm mt-1">{t.subtitle}</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-end md:items-center">
            
            {/* Language Switcher */}
            <div className="flex items-center gap-2 bg-gray-900 p-1 rounded-lg border border-gray-800">
                <Globe size={14} className="ml-2 text-gray-500"/>
                <select 
                  value={lang} 
                  onChange={(e) => setLang(e.target.value as Language)}
                  className="bg-transparent text-xs font-bold text-gray-300 focus:outline-none p-1 cursor-pointer"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="zh">中文</option>
                </select>
            </div>

            {/* Speed Control */}
            <div className="bg-gray-900 p-1 rounded-lg border border-gray-800 flex items-center">
               <div className="px-3 text-[10px] text-gray-500 font-bold uppercase tracking-wider">{t.speed}</div>
               <button
                 onClick={() => setScanSpeed('analysis')}
                 className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                   scanSpeed === 'analysis' ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-800' : 'text-gray-500 hover:text-gray-300'
                 }`}
                 title="Slow down to visualize the multiplexing logic"
               >
                 <Search size={12} /> {t.speedAnalysis}
               </button>
               <button
                 onClick={() => setScanSpeed('realtime')}
                 className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                   scanSpeed === 'realtime' ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-800' : 'text-gray-500 hover:text-gray-300'
                 }`}
                 title="Fast scanning to simulate real operation"
               >
                 <Zap size={12} /> {t.speedRealtime}
               </button>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-gray-800"></div>

            {/* View Switcher Tabs */}
            <div className="bg-gray-900 p-1 rounded-lg border border-gray-800 flex overflow-x-auto max-w-[90vw] md:max-w-none">
              <button
                onClick={() => setActiveTab('monitor')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'monitor' ? 'bg-gray-800 text-white shadow' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <LayoutDashboard size={14} /> {t.tabMonitor}
              </button>
              <button
                onClick={() => setActiveTab('schematic')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'schematic' ? 'bg-cyan-950/50 text-cyan-400 border border-cyan-900/50 shadow' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Cpu size={14} /> {t.tabSchematic}
              </button>
              <button
                onClick={() => setActiveTab('build')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'build' ? 'bg-orange-950/50 text-orange-400 border border-orange-900/50 shadow' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Hammer size={14} /> {t.tabBuild}
              </button>
              <button
                onClick={() => setActiveTab('info')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'info' ? 'bg-blue-950/50 text-blue-400 border border-blue-900/50 shadow' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Info size={14} /> {t.tabInfo}
              </button>
            </div>

            <div className="text-right pl-4 border-l border-gray-800 hidden xl:block">
               <div className="text-[10px] uppercase text-gray-500 font-bold">{t.status}</div>
               <div className="flex items-center justify-end gap-2 text-green-400 text-xs font-mono">
                 <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                 </span>
                 {t.online}
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        
        {/* MONITOR VIEW */}
        {activeTab === 'monitor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full animate-in fade-in zoom-in-95 duration-300">
            
            {/* Left Column: Input & Circuit (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <section className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 shadow-sm">
                 <SensorGrid 
                   matrix={matrix} 
                   onUpdateMatrix={setMatrix} 
                   activeRow={scanRow}
                   activeCol={scanCol}
                   isScanning={isScanning}
                   lang={lang}
                 />
              </section>

              <section>
                 <CircuitDiagram 
                   activeRow={scanRow} 
                   activeCol={scanCol} 
                   activeValue={matrix[scanRow][scanCol]}
                   lang={lang} 
                 />
              </section>
            </div>

            {/* Middle Column: Output Visualization (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col h-[600px] lg:h-auto">
               <section className="h-full bg-gray-900/50 p-4 rounded-xl border border-gray-800 shadow-sm flex flex-col">
                 <HeatmapDisplay matrix={matrix} centerOfPressure={cop} lang={lang} />
                 
                 {/* Stats Bar */}
                 <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="bg-black/40 p-2 rounded border border-gray-800 text-center">
                       <div className="text-[10px] text-gray-500 uppercase">{t.maxPressure}</div>
                       <div className="text-lg font-mono font-bold text-white">
                          {Math.max(...matrix.flat())} <span className="text-xs text-gray-600">/ 1023</span>
                       </div>
                    </div>
                    <div className="bg-black/40 p-2 rounded border border-gray-800 text-center">
                       <div className="text-[10px] text-gray-500 uppercase">{t.activeCells}</div>
                       <div className="text-lg font-mono font-bold text-blue-400">
                          {matrix.flat().filter(v => v > 50).length}
                       </div>
                    </div>
                    <div className="bg-black/40 p-2 rounded border border-gray-800 text-center">
                       <div className="text-[10px] text-gray-500 uppercase">{t.critZones}</div>
                       <div className="text-lg font-mono font-bold text-red-500">
                          {matrix.flat().filter(v => v > PRESSURE_THRESHOLD_CRITICAL).length}
                       </div>
                    </div>
                 </div>
               </section>
            </div>

            {/* Right Column: Alerts & Analysis (3 Cols) */}
            <div className="lg:col-span-3 flex flex-col gap-4">
               <section>
                 <DataRecorder matrix={matrix} lang={lang} />
               </section>
               <section className="flex-grow">
                 <AlertPanel alerts={alerts} lang={lang} />
               </section>
            </div>
          </div>
        )}

        {/* SCHEMATIC VIEW */}
        {activeTab === 'schematic' && (
          <div className="h-full min-h-[600px] animate-in fade-in zoom-in-95 duration-300">
             <SchematicView 
                activeRow={scanRow} 
                activeCol={scanCol} 
                lang={lang}
             />
          </div>
        )}

        {/* BUILD IT VIEW */}
        {activeTab === 'build' && <BuildGuide lang={lang} />}

        {/* INFO VIEW */}
        {activeTab === 'info' && <ProjectInfo lang={lang} />}

      </main>
    </div>
  );
}

export default App;