import React from 'react';
import { Alert, Matrix15x15, Language } from '../types';
import { translations } from '../i18n';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface AlertPanelProps {
  alerts: Alert[];
  matrix: Matrix15x15;
  lang?: Language;
}

export const AlertPanel: React.FC<AlertPanelProps> = ({ alerts, matrix, lang = 'en' }) => {
  const t = translations[lang];

  return (
    <div className="flex flex-col h-full bg-gray-900 border border-gray-800 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">{t.monitorAlerts}</h3>

      <div className="flex-grow space-y-2 mb-4 overflow-y-auto max-h-[200px] pr-2">
        {alerts.length === 0 ? (
          <div className="text-gray-600 text-sm flex items-center gap-2">
            <CheckCircle size={16} /> {t.systemNominal}
          </div>
        ) : (
          alerts.map(alert => (
            <div 
              key={alert.id} 
              className={`
                p-3 rounded border text-sm flex items-start gap-2 animate-in slide-in-from-left-2
                ${alert.type === 'critical' ? 'bg-red-950/50 border-red-800 text-red-200' : 
                  alert.type === 'warning' ? 'bg-orange-950/50 border-orange-800 text-orange-200' :
                  'bg-blue-950/50 border-blue-800 text-blue-200'}
              `}
            >
              <AlertTriangle className="shrink-0 mt-0.5" size={16} />
              <div>
                 <div className="font-bold text-xs opacity-70">
                   {new Date(alert.timestamp).toLocaleTimeString()}
                 </div>
                 {alert.message}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-auto border-t border-gray-800 pt-4 text-xs text-gray-500 text-center italic">
        {t.offlineMode}
      </div>
    </div>
  );
};