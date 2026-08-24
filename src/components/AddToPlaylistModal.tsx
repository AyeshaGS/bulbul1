import React, { useState } from 'react';
import { X, ListPlus, Plus, Lock, Globe, Check } from 'lucide-react';
import { useBulBul } from '../context/BulBulContext';

export const AddToPlaylistModal: React.FC = () => {
  const {
    isAddToPlaylistModalOpen,
    addToPlaylistVideoId,
    closeAddToPlaylistModal,
    playlists,
    toggleVideoInPlaylist,
    createPlaylist
  } = useBulBul();

  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  if (!isAddToPlaylistModalOpen || !addToPlaylistVideoId) return null;

  const handleCreateAndAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const pl = createPlaylist(newTitle, '', isPrivate);
    toggleVideoInPlaylist(pl.id, addToPlaylistVideoId);
    setNewTitle('');
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ListPlus className="w-5 h-5 text-teal-500" />
            <h3 className="font-bold text-slate-900 dark:text-white">Save to Playlist</h3>
          </div>
          <button onClick={closeAddToPlaylistModal} className="p-1 rounded-full text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Playlists list */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {playlists.map((pl) => {
            const hasVideo = pl.videoIds.includes(addToPlaylistVideoId);
            return (
              <label
                key={pl.id}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={hasVideo}
                    onChange={() => toggleVideoInPlaylist(pl.id, addToPlaylistVideoId)}
                    className="rounded text-teal-500 focus:ring-teal-500"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{pl.title}</span>
                </div>
                {pl.isPrivate ? (
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <Globe className="w-3.5 h-3.5 text-teal-500" />
                )}
              </label>
            );
          })}
        </div>

        {/* Create new playlist toggle */}
        {!isCreating ? (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full py-2 flex items-center justify-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Playlist</span>
          </button>
        ) : (
          <form onSubmit={handleCreateAndAdd} className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <input
              type="text"
              required
              placeholder="Playlist name..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
            />
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="rounded text-teal-500"
                />
                <span>Private</span>
              </label>

              <button
                type="submit"
                className="px-3 py-1 rounded-full bg-teal-600 text-white text-xs font-bold"
              >
                Create
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
