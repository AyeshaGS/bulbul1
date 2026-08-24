import React, { useState, useRef, useEffect } from 'react';
import { 
  ThumbsUp, ThumbsDown, MessageSquare, Share2, 
  Volume2, VolumeX, ChevronUp, ChevronDown, 
  Music, CheckCircle2, X, Send, Play, Pause 
} from 'lucide-react';
import { useBulBul } from '../context/BulBulContext';
import { CommentSection } from '../components/CommentSection';

export const ShortsView: React.FC = () => {
  const {
    videos,
    likedVideoIds,
    toggleLikeVideo,
    toggleDislikeVideo,
    dislikedVideoIds,
    isSubscribed,
    toggleSubscribe,
    openShareModal,
    selectChannel
  } = useBulBul();

  // Filter shorts
  const shortsList = videos.filter(v => v.isShort);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const activeShort = shortsList[currentIndex] || shortsList[0];
  const videoRef = useRef<HTMLVideoElement>(null);

  const isLiked = activeShort ? likedVideoIds.includes(activeShort.id) : false;
  const isDisliked = activeShort ? dislikedVideoIds.includes(activeShort.id) : false;
  const isSubbed = activeShort ? isSubscribed(activeShort.creatorId) : false;

  const handleNextShort = () => {
    if (currentIndex < shortsList.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsPlaying(true);
    }
  };

  const handlePrevShort = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsPlaying(true);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        handleNextShort();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        handlePrevShort();
      } else if (e.key === 'm') {
        e.preventDefault();
        setIsMuted(prev => !prev);
      } else if (e.key === ' ') {
        e.preventDefault();
        if (videoRef.current) {
          if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
          } else {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, shortsList.length]);

  if (!activeShort) {
    return (
      <div className="p-12 text-center text-slate-500">
        No Flits available yet. Upload the first vertical short!
      </div>
    );
  }

  const formatViews = (count: number) => {
    if (count >= 1_000_000) return (count / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (count >= 1_000) return (count / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    return count.toString();
  };

  return (
    <div id="bulbul-shorts-view" className="relative w-full h-[calc(100vh-4rem)] flex items-center justify-center p-2 md:p-4 overflow-hidden select-none">
      
      {/* Container holding 9:16 vertical card and side floating buttons */}
      <div className="relative h-full max-h-[820px] aspect-[9/16] rounded-3xl overflow-hidden bg-black shadow-2xl border border-slate-800 flex items-center justify-center">
        
        {/* Background Video */}
        <video
          ref={videoRef}
          key={activeShort.id}
          src={activeShort.videoUrl}
          poster={activeShort.thumbnail}
          loop
          autoPlay
          playsInline
          muted={isMuted}
          onClick={() => {
            if (videoRef.current) {
              if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
              } else {
                videoRef.current.pause();
                setIsPlaying(false);
              }
            }
          }}
          className="w-full h-full object-cover cursor-pointer"
        />

        {/* Play/Pause state badge when paused */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-black/70 text-white flex items-center justify-center backdrop-blur-xs">
              <Play className="w-8 h-8 fill-white ml-1" />
            </div>
          </div>
        )}

        {/* Top Controls Bar */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 text-white text-xs font-bold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>BulBul Flits</span>
          </div>

          <button
            onClick={() => setIsMuted(prev => !prev)}
            aria-label={isMuted ? "Unmute sound" : "Mute sound"}
            className="p-2 rounded-full bg-black/50 text-white hover:bg-black/80 backdrop-blur-md transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-teal-400" />}
          </button>
        </div>

        {/* Bottom Details Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent pt-16 z-20 text-white space-y-3">
          {/* Creator Profile */}
          <div className="flex items-center justify-between">
            <div 
              onClick={() => selectChannel(activeShort.creatorId)}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <img
                src={activeShort.creatorAvatar}
                alt={activeShort.creatorName}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover border-2 border-white/80 group-hover:scale-105 transition-transform"
              />
              <div>
                <div className="font-bold text-xs flex items-center gap-1">
                  <span>{activeShort.creatorName}</span>
                  {activeShort.creatorVerified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 fill-teal-400/20" />
                  )}
                </div>
                <div className="text-[10px] text-white/70">{activeShort.creatorHandle}</div>
              </div>
            </div>

            <button
              onClick={() => toggleSubscribe(activeShort.creatorId)}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all ${
                isSubbed 
                  ? 'bg-white/20 text-white hover:bg-white/30' 
                  : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-sm'
              }`}
            >
              {isSubbed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>

          {/* Short Title & Tags */}
          <p className="text-xs font-medium line-clamp-2 text-white/95 leading-relaxed">
            {activeShort.title}
          </p>

          {/* Music / Audio track ticker */}
          <div className="flex items-center gap-2 text-[11px] text-white/80">
            <Music className="w-3.5 h-3.5 text-teal-400 shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="truncate">{activeShort.audioTrackName || 'Original Sound - BulBul Audio'}</span>
          </div>
        </div>

        {/* Right Floating Actions Column */}
        <div className="absolute right-3 bottom-24 flex flex-col items-center gap-4 z-20 text-white">
          {/* Like */}
          <button
            onClick={() => toggleLikeVideo(activeShort.id)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className={`p-3 rounded-full backdrop-blur-md transition-transform active:scale-75 ${isLiked ? 'bg-teal-500 text-white' : 'bg-black/60 hover:bg-black/80'}`}>
              <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </div>
            <span className="text-[11px] font-bold shadow-xs">{formatViews(activeShort.likes)}</span>
          </button>

          {/* Dislike */}
          <button
            onClick={() => toggleDislikeVideo(activeShort.id)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className={`p-3 rounded-full backdrop-blur-md transition-transform active:scale-75 ${isDisliked ? 'bg-rose-500 text-white' : 'bg-black/60 hover:bg-black/80'}`}>
              <ThumbsDown className={`w-5 h-5 ${isDisliked ? 'fill-current' : ''}`} />
            </div>
            <span className="text-[11px] font-medium">Dislike</span>
          </button>

          {/* Comments drawer trigger */}
          <button
            onClick={() => setIsCommentsOpen(prev => !prev)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="p-3 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md transition-transform active:scale-75">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold">Comments</span>
          </button>

          {/* Share */}
          <button
            onClick={() => openShareModal(activeShort)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="p-3 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md transition-transform active:scale-75">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium">Share</span>
          </button>

          {/* Spinning Vinyl Audio Disc */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-900 to-slate-700 p-0.5 border border-white/20 animate-spin" style={{ animationDuration: '4s' }}>
            <img 
              src={activeShort.creatorAvatar} 
              alt="" 
              referrerPolicy="no-referrer"
              className="w-full h-full rounded-full object-cover" 
            />
          </div>
        </div>

        {/* Side Next / Prev Arrow Buttons */}
        <div className="absolute -right-16 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 z-30">
          <button
            onClick={handlePrevShort}
            disabled={currentIndex === 0}
            className="p-3 rounded-full bg-white/10 dark:bg-slate-800/80 hover:bg-teal-500 hover:text-white disabled:opacity-30 disabled:pointer-events-none text-slate-700 dark:text-slate-200 backdrop-blur-md transition-colors"
          >
            <ChevronUp className="w-5 h-5" />
          </button>

          <button
            onClick={handleNextShort}
            disabled={currentIndex === shortsList.length - 1}
            className="p-3 rounded-full bg-white/10 dark:bg-slate-800/80 hover:bg-teal-500 hover:text-white disabled:opacity-30 disabled:pointer-events-none text-slate-700 dark:text-slate-200 backdrop-blur-md transition-colors"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Slide-in Comments Drawer for Shorts */}
      {isCommentsOpen && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-4 flex flex-col animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Flit Comments</span>
            </h3>
            <button
              onClick={() => setIsCommentsOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pt-2">
            <CommentSection videoId={activeShort.id} creatorId={activeShort.creatorId} />
          </div>
        </div>
      )}

    </div>
  );
};
