import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, CheckCircle2, User } from 'lucide-react';
import { useBulBul } from '../context/BulBulContext';
import { VideoCard } from '../components/VideoCard';

export const SearchView: React.FC = () => {
  const { searchQuery, videos, allUsers, selectChannel } = useBulBul();
  const [filterType, setFilterType] = useState<'all' | 'videos' | 'shorts' | 'channels'>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'views'>('relevance');

  const query = searchQuery.toLowerCase().trim();

  // Matched channels
  const matchedChannels = allUsers.filter(u => 
    u.name.toLowerCase().includes(query) ||
    u.handle.toLowerCase().includes(query) ||
    (u.bio && u.bio.toLowerCase().includes(query))
  );

  // Matched videos
  const matchedVideos = videos.filter(v => 
    v.title.toLowerCase().includes(query) ||
    v.description.toLowerCase().includes(query) ||
    v.tags.some(t => t.toLowerCase().includes(query)) ||
    v.creatorName.toLowerCase().includes(query) ||
    v.category.toLowerCase().includes(query)
  );

  // Filter based on selected filter
  const filteredVideos = matchedVideos.filter(v => {
    if (filterType === 'videos') return !v.isShort;
    if (filterType === 'shorts') return v.isShort;
    return true;
  });

  // Sort
  const sortedVideos = [...filteredVideos].sort((a, b) => {
    if (sortBy === 'views') return b.views - a.views;
    if (sortBy === 'date') return b.id.localeCompare(a.id);
    return 0;
  });

  return (
    <div id="bulbul-search-view" className="max-w-7xl mx-auto space-y-6 pb-16">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-teal-500" />
            <span>Search Results for "{searchQuery}"</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Found {sortedVideos.length} videos and {matchedChannels.length} channels
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${filterType === 'all' ? 'bg-teal-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            All Results
          </button>
          <button
            onClick={() => setFilterType('videos')}
            className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${filterType === 'videos' ? 'bg-teal-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            Videos
          </button>
          <button
            onClick={() => setFilterType('shorts')}
            className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${filterType === 'shorts' ? 'bg-teal-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            Flits
          </button>
          <button
            onClick={() => setFilterType('channels')}
            className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${filterType === 'channels' ? 'bg-teal-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            Channels
          </button>
        </div>
      </div>

      {/* Matched Channel Cards (if any and filter allows) */}
      {filterType !== 'shorts' && filterType !== 'videos' && matchedChannels.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Channels</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchedChannels.map(channel => (
              <div
                key={channel.id}
                onClick={() => selectChannel(channel.id)}
                className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 cursor-pointer hover:border-teal-500/50 transition-all shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={channel.avatar}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1">
                      <span>{channel.name}</span>
                      {channel.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />}
                    </div>
                    <div className="text-xs text-slate-400">{channel.handle} • {channel.subscribersCount.toLocaleString()} subscribers</div>
                    <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">{channel.bio}</div>
                  </div>
                </div>

                <button className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-teal-600 dark:text-teal-400 hover:bg-teal-500 hover:text-white transition-colors">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Matched Videos */}
      {filterType !== 'channels' && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Videos & Flits</h3>
          <div className="space-y-3">
            {sortedVideos.map(video => (
              <div key={video.id} className="p-2 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
                <VideoCard video={video} layout="horizontal" />
              </div>
            ))}
          </div>
        </div>
      )}

      {sortedVideos.length === 0 && matchedChannels.length === 0 && (
        <div className="py-20 text-center text-slate-400 space-y-2">
          <Search className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
          <p className="text-base font-semibold">No results found for "{searchQuery}"</p>
          <p className="text-xs text-slate-500">Try different keywords or check for spelling errors.</p>
        </div>
      )}

    </div>
  );
};
