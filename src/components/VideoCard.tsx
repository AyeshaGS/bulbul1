import React, { useState, useRef } from 'react';
import { 
  CheckCircle2, MoreVertical, Clock, ListPlus, 
  Share2, Flag, EyeOff, Play 
} from 'lucide-react';
import { Video } from '../types';
import { useBulBul } from '../context/BulBulContext';

interface VideoCardProps {
  video: Video;
  layout?: 'grid' | 'horizontal' | 'compact';
  showChannelAvatar?: boolean;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  layout = 'grid',
  showChannelAvatar = true
}) => {
  const {
    selectVideo,
    selectChannel,
    toggleWatchLater,
    isInWatchLater,
    openShareModal,
    openReportModal,
    openAddToPlaylistModal
  } = useBulBul();

  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const inWatchLater = isInWatchLater(video.id);

  // Format view count nicely (e.g. 1.2M, 480K)
  const formatViews = (count: number) => {
    if (count >= 1_000_000) {
      return (count / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (count >= 1_000) {
      return (count / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return count.toString();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // If clicking menu, don't trigger video navigation
    if (menuRef.current && menuRef.current.contains(e.target as Node)) {
      return;
    }
    selectVideo(video.id);
  };

  if (layout === 'horizontal') {
    return (
      <div 
        id={`video-card-${video.id}`}
        onClick={handleCardClick}
        className="group flex flex-col sm:flex-row gap-3.5 p-2 rounded-2xl hover:bg-slate-100/80 dark:hover:bg-slate-900/80 cursor-pointer transition-all duration-200"
      >
        {/* Thumbnail */}
        <div className="relative aspect-video sm:w-60 md:w-72 shrink-0 rounded-xl overflow-hidden bg-slate-900 shadow-sm">
          <img
            src={video.thumbnail}
            alt={video.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-white text-[11px] font-semibold backdrop-blur-xs">
            {video.durationFormatted}
          </div>
          {video.tags.includes('4K') && (
            <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-teal-600/90 text-white text-[10px] font-bold">
              4K UHD
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm md:text-base line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-snug">
              {video.title}
            </h3>
            
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
              <span 
                onClick={(e) => {
                  e.stopPropagation();
                  selectChannel(video.creatorId);
                }}
                className="hover:text-slate-900 dark:hover:text-white font-medium flex items-center gap-1"
              >
                {video.creatorName}
                {video.creatorVerified && <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />}
              </span>
              <span>•</span>
              <span>{formatViews(video.views)} views</span>
              <span>•</span>
              <span>{video.uploadDate}</span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-2 hidden sm:block">
              {video.description}
            </p>
          </div>

          <div className="flex items-center gap-1.5 mt-2">
            {video.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px]">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'compact') {
    return (
      <div 
        id={`video-card-compact-${video.id}`}
        onClick={handleCardClick}
        className="group flex gap-2.5 p-1.5 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-900/80 cursor-pointer transition-all"
      >
        <div className="relative aspect-video w-36 shrink-0 rounded-lg overflow-hidden bg-slate-900">
          <img
            src={video.thumbnail}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-white text-[10px] font-semibold">
            {video.durationFormatted}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 leading-tight">
            {video.title}
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
            {video.creatorName}
          </p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            {formatViews(video.views)} views • {video.uploadDate}
          </p>
        </div>
      </div>
    );
  }

  // Standard Grid Layout
  return (
    <div 
      id={`video-card-${video.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsMenuOpen(false);
      }}
      onClick={handleCardClick}
      className="group flex flex-col rounded-2xl overflow-hidden bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 hover:border-teal-500/40 dark:hover:border-teal-500/40 shadow-xs hover:shadow-lg hover:shadow-teal-500/5 transition-all duration-300 cursor-pointer"
    >
      {/* Thumbnail with Hover Video Preview simulation */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={video.thumbnail}
          alt={video.title}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover transform transition-transform duration-500 ${isHovered ? 'scale-105 opacity-90' : 'scale-100'}`}
        />

        {/* Hover play pulse indicator */}
        <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-11 h-11 rounded-full bg-teal-500/90 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 ml-0.5 fill-white" />
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-950/85 text-white text-[11px] font-semibold backdrop-blur-xs shadow-xs">
          {video.durationFormatted}
        </div>

        {/* Category Pill badge */}
        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-950/70 text-teal-300 border border-teal-500/30 text-[10px] font-bold backdrop-blur-xs">
          {video.category}
        </div>
      </div>

      {/* Details Box */}
      <div className="p-3.5 flex gap-3">
        {showChannelAvatar && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              selectChannel(video.creatorId);
            }}
            title={video.creatorName}
            className="shrink-0 mt-0.5"
          >
            <img
              src={video.creatorAvatar}
              alt={video.creatorName}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 hover:ring-2 hover:ring-teal-500/50 transition-all"
            />
          </button>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-snug">
            {video.title}
          </h3>

          <div className="mt-1.5 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <span 
              onClick={(e) => {
                e.stopPropagation();
                selectChannel(video.creatorId);
              }}
              className="hover:text-slate-800 dark:hover:text-slate-200 font-medium truncate max-w-[150px] inline-flex items-center gap-1"
            >
              {video.creatorName}
              {video.creatorVerified && <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            <span>{formatViews(video.views)} views</span>
            <span>•</span>
            <span>{video.uploadDate}</span>
          </div>
        </div>

        {/* Action Menu */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(prev => !prev);
            }}
            aria-label="Video options"
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-6 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100 text-xs"
            >
              <button
                onClick={() => {
                  toggleWatchLater(video.id);
                  setIsMenuOpen(false);
                }}
                className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Clock className="w-4 h-4 text-teal-500" />
                <span>{inWatchLater ? 'Remove from Watch Later' : 'Save to Watch Later'}</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  openAddToPlaylistModal(video.id);
                }}
                className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ListPlus className="w-4 h-4 text-cyan-500" />
                <span>Add to Playlist</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  openShareModal(video);
                }}
                className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Share2 className="w-4 h-4 text-indigo-500" />
                <span>Share</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  openReportModal(video);
                }}
                className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              >
                <Flag className="w-4 h-4" />
                <span>Report Video</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
