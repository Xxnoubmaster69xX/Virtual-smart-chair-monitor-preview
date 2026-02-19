import React from 'react';
import { Hammer, ShoppingCart, Cpu, Code, Layers, AlertTriangle, Lightbulb } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n';

interface BuildGuideProps {
  lang: Language;
}

export const BuildGuide: React.FC<BuildGuideProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Left Col: Navigation / Overview */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-2">{t.diyTitle}</h2>
          <p className="text-gray-400 text-sm mb-4">
            {t.diyDesc}
            <br/>
            Based on <strong>PSMA Research v1.2</strong>.
          </p>
          
          <div className="flex flex-col gap-2 text-sm">
             <div className="flex items-center gap-3 p-3 bg-gray-950 rounded border border-gray-800">
                <Layers className="text-blue-400" size={20} />
                <div>
                   <div className="font-bold text-gray-200">{t.sensor}</div>
                   <div className="text-gray-500 text-xs">{t.sensorDesc}</div>
                </div>
             </div>
             <div className="flex items-center gap-3 p-3 bg-gray-950 rounded border border-gray-800">
                <Cpu className="text-yellow-400" size={20} />
                <div>
                   <div className="font-bold text-gray-200">{t.brain}</div>
                   <div className="text-gray-500 text-xs">{t.brainDesc}</div>
                </div>
             </div>
             <div className="flex items-center gap-3 p-3 bg-gray-950 rounded border border-gray-800">
                <Code className="text-green-400" size={20} />
                <div>
                   <div className="font-bold text-gray-200">{t.software}</div>
                   <div className="text-gray-500 text-xs">{t.softwareDesc}</div>
                </div>
             </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
           <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
             <ShoppingCart size={18} /> {t.materials}
           </h3>
           <ul className="space-y-3 text-sm text-gray-300">
             <li className="flex justify-between border-b border-gray-800 pb-2">
               <span>{t.matVelostat}</span>
               <span className="text-gray-500">1x</span>
             </li>
             <li className="flex justify-between border-b border-gray-800 pb-2">
               <span>{t.matCopper}</span>
               <span className="text-gray-500">1 Roll</span>
             </li>
             <li className="flex justify-between border-b border-gray-800 pb-2">
               <span>{t.matMux}</span>
               <span className="text-gray-500">2x</span>
             </li>
             <li className="flex justify-between border-b border-gray-800 pb-2">
               <span>{t.matArduino}</span>
               <span className="text-gray-500">1x</span>
             </li>
             <li className="flex justify-between border-b border-gray-800 pb-2">
               <span>{t.matResistor}</span>
               <span className="text-gray-500">1x</span>
             </li>
             <li className="flex justify-between border-b border-gray-800 pb-2">
               <span>{t.matWires}</span>
               <span className="text-gray-500">Lot</span>
             </li>
             <li className="flex justify-between">
               <span className="text-green-400 font-bold">{t.matBase}</span>
               <span className="text-gray-500">2x</span>
             </li>
           </ul>
        </div>
      </div>

      {/* Right Col: Instructions */}
      <div className="lg:col-span-8 flex flex-col gap-6 h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Step 1 */}
        <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
           <div className="flex items-center gap-4 mb-4">
              <div className="bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold text-white">1</div>
              <h3 className="text-xl font-bold text-white">{t.step1Title}</h3>
           </div>
           
           <div className="prose prose-invert max-w-none text-gray-300 text-sm space-y-4">
              <p>{t.step1Desc}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                 <div className="bg-black/30 p-4 rounded border border-gray-800">
                    <h4 className="font-bold text-cyan-400 mb-2">{t.layer1}</h4>
                    <ul className="list-disc pl-4 space-y-1">
                       {t.layer1Steps.map((step, i) => <li key={i}>{step}</li>)}
                    </ul>
                 </div>
                 <div className="bg-black/30 p-4 rounded border border-gray-800">
                    <h4 className="font-bold text-cyan-400 mb-2">{t.layer3}</h4>
                    <ul className="list-disc pl-4 space-y-1">
                       {t.layer3Steps.map((step, i) => <li key={i}>{step}</li>)}
                    </ul>
                 </div>
              </div>

              <div className="bg-orange-900/20 border-l-4 border-orange-500 p-4 rounded-r">
                 <div className="flex items-center gap-2 text-orange-400 font-bold mb-1">
                    <Lightbulb size={16} /> {t.proTip}
                 </div>
                 <p className="text-orange-200/80">{t.proTipDesc}</p>
              </div>

              <p><strong>{t.assembly}</strong></p>
           </div>
        </section>

        {/* Step 2 */}
        <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
           <div className="flex items-center gap-4 mb-4">
              <div className="bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold text-white">2</div>
              <h3 className="text-xl font-bold text-white">{t.step2Title}</h3>
           </div>

           <div className="prose prose-invert max-w-none text-gray-300 text-sm space-y-4">
              <p>{t.step2Desc}</p>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="border-b border-gray-700 text-gray-400">
                         <th className="py-2">Component</th>
                         <th className="py-2">Pin</th>
                         <th className="py-2">Connects To</th>
                         <th className="py-2">Function</th>
                      </tr>
                   </thead>
                   <tbody className="font-mono text-xs">
                      <tr className="bg-black/20">
                         <td className="py-2 pl-2">MUX A (Rows)</td>
                         <td>C0 - C14</td>
                         <td>Matrix Row Wires 1-15</td>
                         <td>Output Channels</td>
                      </tr>
                      <tr>
                         <td className="py-2 pl-2">MUX A (Rows)</td>
                         <td>SIG / COM</td>
                         <td>Arduino 5V</td>
                         <td>Power Source</td>
                      </tr>
                      <tr className="bg-black/20">
                         <td className="py-2 pl-2">MUX B (Cols)</td>
                         <td>C0 - C14</td>
                         <td>Matrix Col Wires 1-15</td>
                         <td>Input Channels</td>
                      </tr>
                      <tr>
                         <td className="py-2 pl-2">MUX B (Cols)</td>
                         <td>SIG / COM</td>
                         <td>Arduino A0</td>
                         <td>Analog Read</td>
                      </tr>
                      <tr className="bg-black/20">
                         <td className="py-2 pl-2">Both MUXs</td>
                         <td>S0, S1, S2, S3</td>
                         <td>Arduino D2, D3, D4, D5</td>
                         <td>Address Select</td>
                      </tr>
                   </tbody>
                </table>
              </div>

              <div className="bg-blue-900/20 border border-blue-800 p-4 rounded flex gap-4 items-start">
                 <AlertTriangle className="text-blue-400 shrink-0 mt-1" />
                 <div>
                    <h4 className="font-bold text-blue-300 mb-1">{t.voltageDivTitle}</h4>
                    <p className="text-blue-200/80">{t.voltageDivDesc}</p>
                 </div>
              </div>
           </div>
        </section>

        {/* Step 3 */}
        <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
           <div className="flex items-center gap-4 mb-4">
              <div className="bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold text-white">3</div>
              <h3 className="text-xl font-bold text-white">{t.step3Title}</h3>
           </div>

           <div className="text-sm text-gray-300 space-y-4">
              <p>{t.step3Desc}</p>
              
              <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-400 uppercase font-bold">
                    <span>Arduino C++ (Firmware)</span>
                  </div>
                  <div className="bg-black p-4 rounded border border-gray-800 font-mono text-xs text-green-400 overflow-x-auto">
{`void loop() {
  for (int row = 0; row < 15; row++) {
    setMuxAddress(row); // Set MUX A
    for (int col = 0; col < 15; col++) {
      setMuxAddress(col); // Set MUX B
      int val = analogRead(A0);
      Serial.print(val); Serial.print(",");
    }
    Serial.println();
  }
}`}
                  </div>
              </div>

              <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-400 uppercase font-bold">
                    <span>Python (Data Receiver)</span>
                  </div>
                  <div className="bg-black p-4 rounded border border-gray-800 font-mono text-xs text-blue-400 overflow-x-auto">
{`import serial
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Connect to Arduino
ser = serial.Serial('COM3', 9600)

def read_frame():
    # Read a full line (15x15 = 225 values)
    line = ser.readline().decode('utf-8').strip()
    if not line: return None
    
    # Parse CSV into Matrix
    values = [int(x) for x in line.split(',') if x.isdigit()]
    if len(values) == 225:
        matrix = np.array(values).reshape(15,15)
        # Apply Threshold (Ghost Seeking Fix)
        matrix[matrix < 20] = 0 
        return matrix
    return None

# Simple Real-time Plotting would go here...`}
                  </div>
              </div>

              <p>{t.ghostSeek}</p>
           </div>
        </section>

      </div>
    </div>
  );
};