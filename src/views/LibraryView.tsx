import React from 'react';
import { 
  History, Clock, ThumbsUp, ListVideo, 
  User, CheckCircle2, Play, ChevronRight 
} from 'lucide-react';
import { useBulBul } from '../context/BulBulContext';
import { VideoCard } from '../components/VideoCard';

export const LibraryView: React.FC = () => {
  const {
    currentUser,
    watchHistory,
    watchLaterVideoIds,
    likedVideoIds,
    playlists,
    videos,
    setCurrentView,
    selectVideo,
    selectPlaylist,
    selectChannel
  } = useBulBul();

  // Retrieve videos
  const historyVideos = watchHistory
    .map(h => ({ item: videos.find(v => v.id === h.videoId), progress: h.progress }))
    .filter(h => h.item !== undefined);

  const watchLaterVideos = watchLaterVideoIds
    .map(id => videos.find(v => v.id === id))
    .filter((v): v is typeof videos[0] => v !== undefined);

  const likedVideos = likedVideoIds
    .map(id => videos.find(v => v.id === id))
    .filter((v): v is typeof videos[0] => v !== undefined);

  return (
    <div id="bulbul-library-view" className="max-w-7xl mx-auto space-y-8 pb-16">
      
      {/* User Header Profile Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-950/30 via-slate-900/60 to-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={currentUser.avatar}
            alt=""
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-full object-cover border-2 border-teal-500 shadow-md"
          />
          <div>
            <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-1.5 justify-center sm:justify-start">
              <span>{currentUser.name}</span>
              {currentUser.isVerified && <CheckCircle2 className="w-4 h-4 text-teal-500" />}
            </h2>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {currentUser.handle} • {currentUser.email}
            </div>
            <div className="mt-1 text-xs text-teal-600 dark:text-teal-400 font-semibold">
              {currentUser.subscribersCount.toLocaleString()} subscribers
            </div>
          </div>
        </div>

        <button
          onClick={() => selectChannel(currentUser.id)}
          className="px-5 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-teal-500 hover:text-white text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
        >
          View Channel
        </button>
      </div>

      {/* History Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-teal-500" />
            <span>History</span>
          </h3>
          <button
            onClick={() => setCurrentView('history')}
            className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center"
          >
            <span>See All ({historyVideos.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {historyVideos.slice(0, 4).map(({ item, progress }) => (
            <div key={item!.id} className="relative space-y-2">
              <VideoCard video={item!} />
              {/* Progress bar under card */}
              <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-teal-500 rounded-full" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          ))}
          {historyVideos.length === 0 && (
            <div className="text-xs text-slate-400 py-6 col-span-full">No watch history yet.</div>
          )}
        </div>
      </div>

      {/* Watch Later Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-500" />
            <span>Watch Later</span>
          </h3>
          <span className="text-xs text-slate-400">{watchLaterVideos.length} videos</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {watchLaterVideos.slice(0, 4).map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
          {watchLaterVideos.length === 0 && (
            <div className="text-xs text-slate-400 py-6 col-span-full">Your watch later list is empty.</div>
          )}
        </div>
      </div>

      {/* Liked Videos Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <ThumbsUp className="w-5 h-5 text-indigo-500" />
            <span>Liked Videos</span>
          </h3>
          <span className="text-xs text-slate-400">{likedVideos.length} videos</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {likedVideos.slice(0, 4).map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
          {likedVideos.length === 0 && (
            <div className="text-xs text-slate-400 py-6 col-span-full">No liked videos yet.</div>
          )}
        </div>
      </div>

      {/* Playlists Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <ListVideo className="w-5 h-5 text-amber-500" />
            <span>Playlists</span>
          </h3>
          <button
            onClick={() => setCurrentView('playlists')}
            className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
          >
            Manage Playlists
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => selectPlaylist(pl.id)}
              className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/40 cursor-pointer transition-all space-y-3"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950">
                <img src={pl.thumbnail} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white text-xs font-bold">
                  {pl.videoIds.length} videos
                </div>
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{pl.title}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">{pl.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
