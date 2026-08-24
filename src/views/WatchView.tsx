import React, { useState } from 'react';
import { 
  ThumbsUp, ThumbsDown, Share2, ListPlus, Flag, 
  CheckCircle2, Bell, BellRing, BellOff, Sparkles, 
  ChevronDown, ChevronUp, Clock, Eye, Heart, Download 
} from 'lucide-react';
import { useBulBul } from '../context/BulBulContext';
import { VideoPlayer } from '../components/VideoPlayer';
import { CommentSection } from '../components/CommentSection';
import { VideoCard } from '../components/VideoCard';
import { BellNotificationSetting } from '../types';

export const WatchView: React.FC = () => {
  const {
    selectedVideo,
    videos,
    selectVideo,
    selectChannel,
    likedVideoIds,
    dislikedVideoIds,
    toggleLikeVideo,
    toggleDislikeVideo,
    isSubscribed,
    toggleSubscribe,
    channelBellSettings,
    setChannelBellSetting,
    openShareModal,
    openReportModal,
    openAddToPlaylistModal,
    currentPlaylistQueue,
    playlistQueueIndex,
    allUsers
  } = useBulBul();

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'transcript'>('desc');
  const [isBellDropdownOpen, setIsBellDropdownOpen] = useState(false);
  const [theaterMode, setTheaterMode] = useState(false);
  const [sidebarFilter, setSidebarFilter] = useState<'all' | 'creator' | 'related'>('all');

  if (!selectedVideo) {
    return (
      <div className="p-8 text-center text-slate-500">
        No video selected. Return to home.
      </div>
    );
  }

  const isLiked = likedVideoIds.includes(selectedVideo.id);
  const isDisliked = dislikedVideoIds.includes(selectedVideo.id);
  const isSubbed = isSubscribed(selectedVideo.creatorId);
  const bellSetting = channelBellSettings[selectedVideo.creatorId] || 'personalized';

  // Find creator details
  const creator = allUsers.find(u => u.id === selectedVideo.creatorId);
  const subsCount = creator ? creator.subscribersCount : 245000;

  // Filter related videos for sidebar
  const relatedVideos = videos.filter(v => v.id !== selectedVideo.id && !v.isShort);
  const filteredSidebarVideos = relatedVideos.filter(v => {
    if (sidebarFilter === 'creator') return v.creatorId === selectedVideo.creatorId;
    if (sidebarFilter === 'related') return v.category === selectedVideo.category;
    return true;
  });

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    return num.toString();
  };

  return (
    <div id="bulbul-watch-view" className="w-full max-w-7xl mx-auto p-2 sm:p-4 md:p-6 transition-all">
      <div className={`grid gap-6 ${theaterMode ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
        
        {/* Main Video & Content Column */}
        <div className={theaterMode ? 'w-full' : 'lg:col-span-2 space-y-4'}>
          {/* Custom Video Player */}
          <VideoPlayer 
            video={selectedVideo} 
            theaterMode={theaterMode}
            onToggleTheater={() => setTheaterMode(prev => !prev)}
          />

          {/* Video Title */}
          <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-tight mt-3">
            {selectedVideo.title}
          </h1>

          {/* Channel Bar & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-slate-200/80 dark:border-slate-800/80">
            {/* Channel Info & Subscribe */}
            <div className="flex items-center gap-3">
              <img
                src={selectedVideo.creatorAvatar}
                alt={selectedVideo.creatorName}
                referrerPolicy="no-referrer"
                onClick={() => selectChannel(selectedVideo.creatorId)}
                className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700 cursor-pointer hover:ring-2 hover:ring-teal-500 transition-all"
              />

              <div>
                <div 
                  onClick={() => selectChannel(selectedVideo.creatorId)}
                  className="font-bold text-sm text-slate-900 dark:text-white cursor-pointer hover:underline flex items-center gap-1.5"
                >
                  <span>{selectedVideo.creatorName}</span>
                  {selectedVideo.creatorVerified && (
                    <CheckCircle2 className="w-4 h-4 text-teal-500 fill-teal-500/20" />
                  )}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {formatNumber(subsCount)} subscribers
                </div>
              </div>

              {/* Subscribe Button & Bell */}
              <div className="ml-2 flex items-center">
                <button
                  id="btn-subscribe"
                  onClick={() => toggleSubscribe(selectedVideo.creatorId)}
                  className={`px-4 py-2 rounded-full font-bold text-xs md:text-sm transition-all duration-200 active:scale-95 shadow-sm ${
                    isSubbed 
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700' 
                      : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white shadow-teal-500/20'
                  }`}
                >
                  {isSubbed ? 'Subscribed' : 'Subscribe'}
                </button>

                {isSubbed && (
                  <div className="relative ml-1.5">
                    <button
                      onClick={() => setIsBellDropdownOpen(prev => !prev)}
                      title="Subscription notification settings"
                      className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      {bellSetting === 'all' ? (
                        <BellRing className="w-4 h-4 text-teal-500" />
                      ) : bellSetting === 'none' ? (
                        <BellOff className="w-4 h-4 text-slate-400" />
                      ) : (
                        <Bell className="w-4 h-4" />
                      )}
                    </button>

                    {isBellDropdownOpen && (
                      <div className="absolute left-0 mt-2 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-1 z-30 text-xs">
                        <button
                          onClick={() => {
                            setChannelBellSetting(selectedVideo.creatorId, 'all');
                            setIsBellDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 ${bellSetting === 'all' ? 'text-teal-600 font-bold' : ''}`}
                        >
                          <BellRing className="w-3.5 h-3.5" />
                          <span>All Notifications</span>
                        </button>
                        <button
                          onClick={() => {
                            setChannelBellSetting(selectedVideo.creatorId, 'personalized');
                            setIsBellDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 ${bellSetting === 'personalized' ? 'text-teal-600 font-bold' : ''}`}
                        >
                          <Bell className="w-3.5 h-3.5" />
                          <span>Personalized</span>
                        </button>
                        <button
                          onClick={() => {
                            setChannelBellSetting(selectedVideo.creatorId, 'none');
                            setIsBellDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 ${bellSetting === 'none' ? 'text-teal-600 font-bold' : ''}`}
                        >
                          <BellOff className="w-3.5 h-3.5" />
                          <span>None</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Video Action Buttons (Like/Dislike, Share, Save, Report) */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Like / Dislike pill */}
              <div className="inline-flex items-center bg-slate-100 dark:bg-slate-800 rounded-full p-0.5 border border-slate-200 dark:border-slate-700">
                <button
                  id="btn-like-video"
                  onClick={() => toggleLikeVideo(selectedVideo.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold hover:bg-slate-200/80 dark:hover:bg-slate-700 transition-colors ${
                    isLiked ? 'text-teal-600 dark:text-teal-400 bg-teal-500/15' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{formatNumber(selectedVideo.likes)}</span>
                </button>

                <div className="w-px h-4 bg-slate-300 dark:bg-slate-700" />

                <button
                  id="btn-dislike-video"
                  onClick={() => toggleDislikeVideo(selectedVideo.id)}
                  className={`p-2 rounded-full hover:bg-slate-200/80 dark:hover:bg-slate-700 transition-colors ${
                    isDisliked ? 'text-rose-500 bg-rose-500/15' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <ThumbsDown className={`w-4 h-4 ${isDisliked ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Share */}
              <button
                id="btn-share-video"
                onClick={() => openShareModal(selectedVideo)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
              >
                <Share2 className="w-4 h-4 text-indigo-500" />
                <span>Share</span>
              </button>

              {/* Save to Playlist */}
              <button
                id="btn-save-playlist"
                onClick={() => openAddToPlaylistModal(selectedVideo.id)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
              >
                <ListPlus className="w-4 h-4 text-cyan-500" />
                <span>Save</span>
              </button>

              {/* Report */}
              <button
                id="btn-report-video"
                onClick={() => openReportModal(selectedVideo)}
                title="Report Video"
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-500 hover:text-rose-500 transition-colors"
              >
                <Flag className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description & Transcript Box */}
          <div className="p-4 rounded-2xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-3">
                <span>{selectedVideo.views.toLocaleString()} views</span>
                <span>•</span>
                <span>Uploaded {selectedVideo.uploadDate}</span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  {selectedVideo.category}
                </span>
              </div>

              {/* Tab toggles */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('desc')}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${activeTab === 'desc' ? 'bg-white dark:bg-slate-800 font-bold text-teal-600 dark:text-teal-400 shadow-xs' : 'text-slate-500'}`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('transcript')}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${activeTab === 'transcript' ? 'bg-white dark:bg-slate-800 font-bold text-teal-600 dark:text-teal-400 shadow-xs' : 'text-slate-500'}`}
                >
                  Transcript
                </button>
              </div>
            </div>

            {activeTab === 'desc' ? (
              <div>
                <p className={`text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed ${isDescriptionExpanded ? '' : 'line-clamp-3'}`}>
                  {selectedVideo.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {selectedVideo.tags.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                      #{t}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setIsDescriptionExpanded(prev => !prev)}
                  className="mt-2 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                >
                  {isDescriptionExpanded ? (
                    <>
                      <span>Show Less</span>
                      <ChevronUp className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <span>Show More</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {selectedVideo.transcript && selectedVideo.transcript.length > 0 ? (
                  selectedVideo.transcript.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-xs">
                      <span className="font-mono text-teal-600 dark:text-teal-400 font-bold shrink-0">{item.time}</span>
                      <span className="text-slate-700 dark:text-slate-300">{item.text}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400 py-4 text-center">
                    Automated BulBul AI transcription is being generated for this video.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Interactive Comments Section */}
          <CommentSection 
            videoId={selectedVideo.id} 
            creatorId={selectedVideo.creatorId} 
          />
        </div>

        {/* Sidebar Recommended & Queue Column */}
        <div className="space-y-4">
          {/* Playlist Queue Header if in queue */}
          {currentPlaylistQueue.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/30">
              <div className="flex items-center justify-between text-xs font-bold text-teal-700 dark:text-teal-300 mb-2">
                <span>Playlist Queue</span>
                <span>{playlistQueueIndex + 1} / {currentPlaylistQueue.length}</span>
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {currentPlaylistQueue.map((id, idx) => {
                  const item = videos.find(v => v.id === id);
                  if (!item) return null;
                  return (
                    <div
                      key={id}
                      onClick={() => selectVideo(id, currentPlaylistQueue)}
                      className={`p-1.5 rounded-lg flex items-center gap-2 text-xs cursor-pointer ${idx === playlistQueueIndex ? 'bg-teal-500/20 text-teal-600 dark:text-teal-300 font-bold' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                    >
                      <span className="w-4 text-center">{idx + 1}</span>
                      <span className="truncate flex-1">{item.title}</span>
                      <span className="text-[10px] text-slate-400">{item.durationFormatted}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recommended Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setSidebarFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-colors ${sidebarFilter === 'all' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
            >
              All
            </button>
            <button
              onClick={() => setSidebarFilter('creator')}
              className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-colors ${sidebarFilter === 'creator' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
            >
              From {selectedVideo.creatorName.split(' ')[0]}
            </button>
            <button
              onClick={() => setSidebarFilter('related')}
              className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-colors ${sidebarFilter === 'related' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
            >
              Related {selectedVideo.category}
            </button>
          </div>

          {/* Up Next List */}
          <div className="space-y-2">
            {filteredSidebarVideos.map(vid => (
              <VideoCard 
                key={vid.id} 
                video={vid} 
                layout="compact" 
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
