import React from 'react';
import { Home, Zap, PlusCircle, Tv, Folder } from 'lucide-react';
import { useBulBul } from '../context/BulBulContext';

export const BottomNav: React.FC = () => {
  const { currentView, setCurrentView, setUploadModalOpen, setSelectedCategory } = useBulBul();

  return (
    <nav 
      id="bulbul-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-2 z-40"
    >
      <button
        onClick={() => {
          setSelectedCategory('All');
          setCurrentView('home');
        }}
        className={`flex flex-col items-center justify-center w-14 h-full gap-1 text-xs transition-colors ${currentView === 'home' ? 'text-teal-600 dark:text-teal-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px]">Home</span>
      </button>

      <button
        onClick={() => setCurrentView('shorts')}
        className={`flex flex-col items-center justify-center w-14 h-full gap-1 text-xs transition-colors ${currentView === 'shorts' ? 'text-teal-600 dark:text-teal-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}
      >
        <Zap className="w-5 h-5 text-amber-500" />
        <span className="text-[10px]">Flits</span>
      </button>

      {/* Center Upload Button */}
      <button
        onClick={() => setUploadModalOpen(true)}
        className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-tr from-teal-600 to-cyan-500 text-white shadow-md shadow-teal-500/30 active:scale-90 transition-transform"
      >
        <PlusCircle className="w-6 h-6" />
      </button>

      <button
        onClick={() => setCurrentView('subscriptions')}
        className={`flex flex-col items-center justify-center w-14 h-full gap-1 text-xs transition-colors ${currentView === 'subscriptions' ? 'text-teal-600 dark:text-teal-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}
      >
        <Tv className="w-5 h-5" />
        <span className="text-[10px]">Subs</span>
      </button>

      <button
        onClick={() => setCurrentView('library')}
        className={`flex flex-col items-center justify-center w-14 h-full gap-1 text-xs transition-colors ${currentView === 'library' ? 'text-teal-600 dark:text-teal-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}
      >
        <Folder className="w-5 h-5" />
        <span className="text-[10px]">Library</span>
      </button>
    </nav>
  );
};
