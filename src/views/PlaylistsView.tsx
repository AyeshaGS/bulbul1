import React, { useState } from 'react';
import { ListVideo, Plus, Trash2, Play, Lock, Globe, Share2 } from 'lucide-react';
import { useBulBul } from '../context/BulBulContext';

export const PlaylistsView: React.FC = () => {
  const {
    playlists,
    createPlaylist,
    deletePlaylist,
    selectPlaylist,
    selectedPlaylistId,
    videos,
    selectVideo
  } = useBulBul();

  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const activePlaylist = playlists.find(p => p.id === selectedPlaylistId) || playlists[0];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    createPlaylist(title, desc, isPrivate);
    setTitle('');
    setDesc('');
    setIsCreating(false);
  };

  const playlistVideos = activePlaylist
    ? activePlaylist.videoIds.map(id => videos.find(v => v.id === id)).filter(Boolean)
    : [];

  return (
    <div id="bulbul-playlists-view" className="max-w-7xl mx-auto space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <ListVideo className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Playlists Collection</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Curate and organize your favorite videos</p>
          </div>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 rounded-full bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Playlist</span>
        </button>
      </div>

      {/* Create Playlist Modal / Form */}
      {isCreating && (
        <form onSubmit={handleCreate} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-teal-500/40 shadow-xl space-y-4 max-w-xl animate-in zoom-in-95">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Create New Playlist</h3>
          <input
            type="text"
            placeholder="Playlist Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
            required
          />
          <textarea
            placeholder="Description (Optional)"
            rows={2}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
          />
          <div className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              id="is-private"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="rounded text-teal-500"
            />
            <label htmlFor="is-private" className="text-slate-700 dark:text-slate-300">
              Keep this playlist private
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-full text-xs text-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-teal-600 text-white text-xs font-bold"
            >
              Save Playlist
            </button>
          </div>
        </form>
      )}

      {/* Playlist Grid & Active Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Playlists Selector List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Playlists</h3>
          <div className="space-y-2">
            {playlists.map((pl) => {
              const isSelected = activePlaylist?.id === pl.id;
              return (
                <div
                  key={pl.id}
                  onClick={() => selectPlaylist(pl.id)}
                  className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between gap-3 transition-all ${
                    isSelected
                      ? 'bg-teal-500/10 border-teal-500 text-teal-700 dark:text-teal-300 font-bold'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={pl.thumbnail}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-14 aspect-video rounded-lg object-cover shrink-0"
                    />
                    <div className="truncate">
                      <div className="text-xs truncate">{pl.title}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{pl.videoIds.length} videos • {pl.isPrivate ? 'Private' : 'Public'}</div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete playlist "${pl.title}"?`)) {
                        deletePlaylist(pl.id);
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Playlist Videos view */}
        <div className="lg:col-span-2 space-y-4">
          {activePlaylist ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{activePlaylist.title}</h2>
                    {activePlaylist.isPrivate ? (
                      <span className="flex items-center gap-1 text-[10px] text-slate-400"><Lock className="w-3 h-3" /> Private</span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] text-teal-500"><Globe className="w-3 h-3" /> Public</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{activePlaylist.description}</p>
                </div>

                {playlistVideos.length > 0 && (
                  <button
                    onClick={() => selectVideo(playlistVideos[0]!.id, activePlaylist.videoIds)}
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 text-white text-xs font-bold flex items-center gap-2 shadow-sm"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Play All</span>
                  </button>
                )}
              </div>

              {/* Videos in this playlist */}
              <div className="space-y-2 divide-y divide-slate-100 dark:divide-slate-800">
                {playlistVideos.map((video, idx) => (
                  <div
                    key={video!.id}
                    onClick={() => selectVideo(video!.id, activePlaylist.videoIds)}
                    className="pt-2 first:pt-0 flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-400 w-4 text-center">{idx + 1}</span>
                    <img
                      src={video!.thumbnail}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-20 aspect-video rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-xs text-slate-900 dark:text-white truncate">{video!.title}</div>
                      <div className="text-[10px] text-slate-400">{video!.creatorName} • {video!.durationFormatted}</div>
                    </div>
                  </div>
                ))}

                {playlistVideos.length === 0 && (
                  <div className="py-12 text-center text-xs text-slate-400">
                    This playlist is currently empty. Click the "+ Save" button on any video to add it!
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400">Select or create a playlist.</div>
          )}
        </div>

      </div>

    </div>
  );
};
