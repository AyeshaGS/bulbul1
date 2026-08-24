import React, { useState } from 'react';
import { Flame, Music, Gamepad2, Film, Newspaper } from 'lucide-react';
import { useBulBul } from '../context/BulBulContext';
import { VideoCard } from '../components/VideoCard';

export const TrendingView: React.FC = () => {
  const { videos } = useBulBul();
  const [trendingTab, setTrendingTab] = useState<'Now' | 'Music' | 'Gaming' | 'Movies'>('Now');

  // Sort by views & likes
  const trendingVideos = [...videos]
    .filter(v => !v.isShort)
    .sort((a, b) => (b.views + b.likes * 10) - (a.views + a.likes * 10));

  const filteredTrending = trendingTab === 'Now'
    ? trendingVideos
    : trendingTab === 'Music'
    ? trendingVideos.filter(v => v.category === 'Music' || v.tags.includes('music'))
    : trendingTab === 'Gaming'
    ? trendingVideos.filter(v => v.category === 'Gaming' || v.tags.includes('gaming'))
    : trendingVideos.filter(v => v.category === 'Animation' || v.category === 'Film');

  return (
    <div id="bulbul-trending-view" className="max-w-7xl mx-auto space-y-6 pb-16">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/20 via-rose-500/10 to-transparent border border-amber-500/30 flex items-center gap-4">
        <div className="p-3.5 rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/30">
          <Flame className="w-8 h-8 fill-white" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
            Trending on BulBul
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            What the world is watching, listening to, and discussing right now
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setTrendingTab('Now')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${trendingTab === 'Now' ? 'bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          Now
        </button>
        <button
          onClick={() => setTrendingTab('Music')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${trendingTab === 'Music' ? 'bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          <Music className="w-3.5 h-3.5" />
          <span>Music</span>
        </button>
        <button
          onClick={() => setTrendingTab('Gaming')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${trendingTab === 'Gaming' ? 'bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Gaming</span>
        </button>
        <button
          onClick={() => setTrendingTab('Movies')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${trendingTab === 'Movies' ? 'bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Movies & Animation</span>
        </button>
      </div>

      {/* Ranked List */}
      <div className="space-y-4">
        {filteredTrending.map((video, index) => (
          <div key={video.id} className="flex items-center gap-4 group">
            {/* Rank Number Badge */}
            <div className="w-8 md:w-10 text-center font-black text-lg md:text-2xl text-slate-400 group-hover:text-amber-500 transition-colors shrink-0">
              #{index + 1}
            </div>

            <div className="flex-1 min-w-0">
              <VideoCard video={video} layout="horizontal" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
