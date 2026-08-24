import React, { useState } from 'react';
import { History, Trash2, Search, X } from 'lucide-react';
import { useBulBul } from '../context/BulBulContext';
import { VideoCard } from '../components/VideoCard';

export const HistoryView: React.FC = () => {
  const { watchHistory, clearHistory, removeFromHistory, videos } = useBulBul();
  const [historyFilter, setHistoryFilter] = useState('');

  const historyItems = watchHistory
    .map(h => ({
      video: videos.find(v => v.id === h.videoId),
      watchedAt: h.watchedAt,
      progress: h.progress
    }))
    .filter(h => h.video !== undefined);

  const filteredHistory = historyFilter
    ? historyItems.filter(h => h.video!.title.toLowerCase().includes(historyFilter.toLowerCase()) || h.video!.creatorName.toLowerCase().includes(historyFilter.toLowerCase()))
    : historyItems;

  return (
    <div id="bulbul-history-view" className="max-w-7xl mx-auto space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Watch History</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">{historyItems.length} videos watched</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search history..."
              value={historyFilter}
              onChange={(e) => setHistoryFilter(e.target.value)}
              className="pl-9 pr-8 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs w-48 focus:w-60 transition-all focus:outline-none focus:border-teal-500"
            />
            {historyFilter && (
              <button onClick={() => setHistoryFilter('')} className="absolute right-2.5 top-2.5 text-slate-400">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {historyItems.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Clear all watch history?')) {
                  clearHistory();
                }
              }}
              className="px-4 py-2 rounded-full bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* Videos List */}
      <div className="space-y-3">
        {filteredHistory.map(({ video, watchedAt, progress }) => (
          <div 
            key={video!.id} 
            className="group relative p-3 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:border-teal-500/40 transition-all"
          >
            <div className="flex-1 min-w-0">
              <VideoCard video={video!} layout="horizontal" />
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400">Watched {watchedAt}</span>
              <button
                onClick={() => removeFromHistory(video!.id)}
                title="Remove from history"
                className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredHistory.length === 0 && (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <History className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
            <p>No watch history matches your search.</p>
          </div>
        )}
      </div>

    </div>
  );
};
