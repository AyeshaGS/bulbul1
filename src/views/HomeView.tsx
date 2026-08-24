import React from 'react';
import { Sparkles, Zap, Flame, Play, Clock } from 'lucide-react';
import { useBulBul } from '../context/BulBulContext';
import { VideoCard } from '../components/VideoCard';

export const HomeView: React.FC = () => {
  const {
    videos,
    categories,
    selectedCategory,
    setSelectedCategory,
    featuredVideo,
    selectVideo,
    setCurrentView,
    toggleWatchLater,
    isInWatchLater
  } = useBulBul();

  // Filter videos based on category
  const longFormVideos = videos.filter(v => !v.isShort);
  const shorts = videos.filter(v => v.isShort);

  const filteredVideos = selectedCategory === 'All'
    ? longFormVideos
    : longFormVideos.filter(v => v.category.toLowerCase() === selectedCategory.toLowerCase() || v.tags.some(t => t.toLowerCase() === selectedCategory.toLowerCase()));

  const inWatchLater = featuredVideo ? isInWatchLater(featuredVideo.id) : false;

  return (
    <div id="bulbul-home-view" className="space-y-6 pb-12">
      
      {/* Category Pills Bar */}
      <div className="sticky top-16 z-20 py-2.5 px-1 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 overflow-x-auto no-scrollbar flex items-center gap-2">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-teal-400 dark:text-slate-950 shadow-sm shadow-teal-500/20'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Featured Hero Banner (Shown when on "All" category) */}
      {selectedCategory === 'All' && featuredVideo && (
        <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl group">
          <div className="relative aspect-[21/9] min-h-[260px] md:min-h-[340px] w-full">
            <img
              src={featuredVideo.thumbnail}
              alt={featuredVideo.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

            {/* Hero content */}
            <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end max-w-3xl space-y-3 text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-bold w-fit backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>BulBul Spotlight Premiere</span>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight">
                {featuredVideo.title}
              </h2>

              <p className="text-xs md:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                {featuredVideo.description}
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  id="btn-play-featured"
                  onClick={() => selectVideo(featuredVideo.id)}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-bold text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-teal-500/30 active:scale-95 transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Watch Now</span>
                </button>

                <button
                  onClick={() => toggleWatchLater(featuredVideo.id)}
                  className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs md:text-sm font-semibold flex items-center gap-2 backdrop-blur-md transition-all"
                >
                  <Clock className="w-4 h-4" />
                  <span>{inWatchLater ? 'Added to Watch Later' : 'Watch Later'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Videos Grid - First Batch */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <span>Recommended for You</span>
          </h2>
          <span className="text-xs text-slate-400">Personalized Feed</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {filteredVideos.slice(0, 4).map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>

      {/* BulBul Flits (Shorts) Shelf */}
      {shorts.length > 0 && selectedCategory === 'All' && (
        <div className="py-4 space-y-3 border-y border-slate-200/80 dark:border-slate-800/80 my-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-amber-500/15 text-amber-500">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                BulBul Flits (Shorts)
              </h3>
            </div>

            <button
              onClick={() => setCurrentView('shorts')}
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
            >
              View All Flits →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            {shorts.map((short) => (
              <div
                key={short.id}
                onClick={() => setCurrentView('shorts')}
                className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-slate-950 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-teal-500/10 border border-slate-200 dark:border-slate-800 transition-all duration-300"
              >
                <img
                  src={short.thumbnail}
                  alt={short.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-3 text-white space-y-1">
                  <span className="font-semibold text-xs line-clamp-2 leading-snug group-hover:text-teal-300 transition-colors">
                    {short.title}
                  </span>
                  <span className="text-[10px] text-white/70">
                    {(short.views / 1000).toFixed(0)}K views
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Remaining Long-Form Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
        {filteredVideos.slice(4).map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="py-16 text-center text-slate-400">
          No videos found in "{selectedCategory}". Try choosing another category.
        </div>
      )}

    </div>
  );
};
