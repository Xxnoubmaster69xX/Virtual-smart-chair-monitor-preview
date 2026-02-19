import React from 'react';
import { FileText, Target, Activity, Users, Globe, BookOpen, GitBranch } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n';

interface ProjectInfoProps {
  lang: Language;
}

export const ProjectInfo: React.FC<ProjectInfoProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-300 pb-12">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {t.projectTitle}
        </h1>
        <div className="inline-flex items-center gap-2 bg-gray-900 border border-gray-800 px-4 py-2 rounded-full text-xs text-gray-400">
           <span>Feria Mexicana de Ciencias e Ingenierías Coahuila 2025</span>
           <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
           <span>{t.category}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Abstract */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5">
              <FileText size={120} />
           </div>
           <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
             <FileText className="text-blue-500" size={20} /> {t.abstract}
           </h2>
           <p className="text-gray-300 text-sm leading-relaxed">
             {t.abstractText}
           </p>
        </div>

        {/* Problem & Solution */}
        <div className="flex flex-col gap-6">
           <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-red-200 mb-2 flex items-center gap-2">
                 <Activity size={18} /> {t.problem}
              </h3>
              <p className="text-red-100/70 text-sm">
                 {t.problemText}
              </p>
           </div>
           
           <div className="bg-green-950/20 border border-green-900/50 rounded-xl p-6 flex-grow">
              <h3 className="text-lg font-bold text-green-200 mb-2 flex items-center gap-2">
                 <Target size={18} /> {t.solution}
              </h3>
              <p className="text-green-100/70 text-sm">
                 {t.solutionText}
              </p>
           </div>
        </div>
      </div>

      {/* Methodology Section (New) */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 mb-8">
         <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <GitBranch className="text-yellow-400" size={20} /> {t.methodology}
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-black/30 p-4 rounded border border-gray-700">
                 <div className="text-sm font-bold text-gray-200 mb-1">{t.methodPhase1}</div>
                 <div className="text-xs text-gray-400">{t.methodPhase1Desc}</div>
             </div>
             <div className="bg-black/30 p-4 rounded border border-gray-700">
                 <div className="text-sm font-bold text-gray-200 mb-1">{t.methodPhase2}</div>
                 <div className="text-xs text-gray-400">{t.methodPhase2Desc}</div>
             </div>
             <div className="bg-black/30 p-4 rounded border border-gray-700">
                 <div className="text-sm font-bold text-gray-200 mb-1">{t.methodPhase3}</div>
                 <div className="text-xs text-gray-400">{t.methodPhase3Desc}</div>
             </div>
         </div>
      </div>

      {/* Objectives Section (New) */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 mb-8">
         <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <BookOpen className="text-purple-400" size={20} /> {t.objectives}
         </h2>
         <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
             <li className="flex items-start gap-2">
                 <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2"></span>
                 {t.obj1}
             </li>
             <li className="flex items-start gap-2">
                 <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2"></span>
                 {t.obj2}
             </li>
             <li className="flex items-start gap-2">
                 <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2"></span>
                 {t.obj3}
             </li>
         </ul>
      </div>

      {/* Impact Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 mb-8">
         <h2 className="text-xl font-bold text-white mb-6 text-center">{t.impact}</h2>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
               <div className="bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-400">
                  <Users size={24} />
               </div>
               <h4 className="font-bold text-gray-200 mb-2">{t.impact1Title}</h4>
               <p className="text-xs text-gray-500">
                  {t.impact1Desc}
               </p>
            </div>

            <div className="text-center">
               <div className="bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-cyan-400">
                  <Globe size={24} />
               </div>
               <h4 className="font-bold text-gray-200 mb-2">{t.impact2Title}</h4>
               <p className="text-xs text-gray-500">
                  {t.impact2Desc}
               </p>
            </div>

            <div className="text-center">
               <div className="bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-400">
                  <Activity size={24} />
               </div>
               <h4 className="font-bold text-gray-200 mb-2">{t.impact3Title}</h4>
               <p className="text-xs text-gray-500">
                   {t.impact3Desc}
               </p>
            </div>
         </div>
      </div>

      <div className="border-t border-gray-800 pt-8 text-center">
         <p className="text-gray-500 text-xs italic">
            Participantes: David Eduardo Lara Flores • Asesor: [Advisor Name]
         </p>
      </div>

    </div>
  );
};