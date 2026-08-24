import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, 
  Volume1, Maximize, Minimize, Settings, Subtitles, 
  Tv, PictureInPicture2, Repeat, Check, SkipForward 
} from 'lucide-react';
import { Video, VideoQuality } from '../types';
import { useBulBul } from '../context/BulBulContext';

interface VideoPlayerProps {
  video: Video;
  autoPlay?: boolean;
  onEnded?: () => void;
  theaterMode?: boolean;
  onToggleTheater?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  autoPlay = true,
  onEnded,
  theaterMode = false,
  onToggleTheater
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);

  const { addToHistory, playNextInQueue, currentPlaylistQueue } = useBulBul();

  // Playback state
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(video.duration || 100);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [quality, setQuality] = useState<VideoQuality>('1080p');
  const [isCaptionsOn, setIsCaptionsOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isAutoPlayNext, setIsAutoPlayNext] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<'main' | 'speed' | 'quality'>('main');
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPos, setHoverPos] = useState<number>(0);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Format seconds to mm:ss or hh:mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Live caption text simulation based on video chapters or transcript
  const currentCaption = React.useMemo(() => {
    if (!isCaptionsOn) return null;
    if (video.transcript && video.transcript.length > 0) {
      // Find closest transcript item
      for (let i = video.transcript.length - 1; i >= 0; i--) {
        const item = video.transcript[i];
        const [m, s] = item.time.split(':').map(Number);
        const sec = m * 60 + s;
        if (currentTime >= sec && currentTime < sec + 8) {
          return item.text;
        }
      }
    }
    // Default dynamic captions
    if (video.chapters && video.chapters.length > 0) {
      const activeChap = [...video.chapters].reverse().find(c => currentTime >= c.time);
      if (activeChap && currentTime < activeChap.time + 6) {
        return `[Chapter] ${activeChap.title}`;
      }
    }
    return null;
  }, [currentTime, isCaptionsOn, video]);

  // Video event handlers
  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    setCurrentTime(current);

    if (videoRef.current.buffered.length > 0) {
      const buff = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
      setBuffered(buff);
    }

    // Update history progress periodically
    if (Math.floor(current) % 10 === 0 && duration > 0) {
      addToHistory(video.id, Math.round((current / duration) * 100));
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || video.duration);
    if (autoPlay) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressContainerRef.current || !videoRef.current) return;
    const rect = progressContainerRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = Math.max(0, Math.min(pos * duration, duration));
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressContainerRef.current) return;
    const rect = progressContainerRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const clampedPos = Math.max(0, Math.min(pos, 1));
    setHoverTime(clampedPos * duration);
    setHoverPos(clampedPos * 100);
  };

  const handleProgressMouseLeave = () => {
    setHoverTime(null);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setActiveSettingsTab('main');
    setShowSettingsMenu(false);
  };

  const handleQualityChange = (q: VideoQuality) => {
    setQuality(q);
    setActiveSettingsTab('main');
    setShowSettingsMenu(false);
  };

  const skipTime = (seconds: number) => {
    if (!videoRef.current) return;
    const newTime = Math.max(0, Math.min(videoRef.current.currentTime + seconds, duration));
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.warn('PiP not supported or allowed', err);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (isLooping) {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
        setIsPlaying(true);
      }
    } else if (isAutoPlayNext) {
      if (onEnded) {
        onEnded();
      } else if (currentPlaylistQueue.length > 0) {
        playNextInQueue();
      }
    }
  };

  // Auto-hide controls on inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !showSettingsMenu) {
        setShowControls(false);
      }
    }, 3000);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when user is typing in inputs or textareas
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'j':
          e.preventDefault();
          skipTime(-10);
          break;
        case 'l':
          e.preventDefault();
          skipTime(10);
          break;
        case 'arrowleft':
          e.preventDefault();
          skipTime(-5);
          break;
        case 'arrowright':
          e.preventDefault();
          skipTime(5);
          break;
        case 'arrowup':
          e.preventDefault();
          setVolume(prev => {
            const next = Math.min(1, prev + 0.1);
            if (videoRef.current) videoRef.current.volume = next;
            return next;
          });
          break;
        case 'arrowdown':
          e.preventDefault();
          setVolume(prev => {
            const next = Math.max(0, prev - 0.1);
            if (videoRef.current) videoRef.current.volume = next;
            return next;
          });
          break;
        case 'c':
          e.preventDefault();
          setIsCaptionsOn(prev => !prev);
          break;
        case 't':
          e.preventDefault();
          if (onToggleTheater) onToggleTheater();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted, duration]);

  return (
    <div 
      id="bulbul-video-player-container"
      ref={playerContainerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className={`relative w-full aspect-video bg-black rounded-2xl overflow-hidden select-none group shadow-2xl ${theaterMode ? 'max-h-[80vh]' : ''}`}
    >
      {/* HTML5 Video Element */}
      <video
        id="html5-video-element"
        ref={videoRef}
        src={video.videoUrl}
        poster={video.thumbnail}
        playsInline
        onClick={handlePlayPause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleVideoEnded}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Subtitles & Captions Overlay */}
      {currentCaption && (
        <div className="absolute bottom-16 left-0 right-0 flex justify-center px-6 pointer-events-none z-20">
          <div className="bg-black/85 text-white font-medium text-sm md:text-base px-4 py-1.5 rounded-lg border border-white/10 backdrop-blur-xs text-center max-w-2xl shadow-lg">
            {currentCaption}
          </div>
        </div>
      )}

      {/* Center Play Button Overlay on Pause */}
      {!isPlaying && (
        <div 
          onClick={handlePlayPause}
          className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-xs cursor-pointer z-10"
        >
          <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-500 text-white flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
            <Play className="w-9 h-9 ml-1 fill-white" />
          </div>
        </div>
      )}

      {/* Player Controls Bar */}
      <div 
        id="player-controls-bar"
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-8 pb-3 px-4 flex flex-col gap-2.5 transition-opacity duration-300 z-30 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Timeline Scrubber */}
        <div 
          ref={progressContainerRef}
          onClick={handleSeek}
          onMouseMove={handleProgressMouseMove}
          onMouseLeave={handleProgressMouseLeave}
          className="relative w-full h-2 group/scrubber flex items-center cursor-pointer py-1"
        >
          {/* Background Bar */}
          <div className="w-full h-1 group-hover/scrubber:h-1.5 rounded-full bg-white/25 overflow-hidden transition-all">
            {/* Buffered Progress */}
            <div 
              className="h-full bg-white/40 rounded-full transition-all"
              style={{ width: `${(buffered / (duration || 1)) * 100}%` }}
            />
          </div>

          {/* Played Progress Bar */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 left-0 h-1 group-hover/scrubber:h-1.5 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full pointer-events-none transition-all"
            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
          />

          {/* Scrubber Playhead Handle */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md shadow-teal-500/50 scale-0 group-hover/scrubber:scale-100 transition-transform pointer-events-none"
            style={{ left: `calc(${(currentTime / (duration || 1)) * 100}% - 7px)` }}
          />

          {/* Chapter markers on timeline if present */}
          {video.chapters?.map((chap, i) => (
            <div
              key={i}
              title={chap.title}
              className="absolute top-1/2 -translate-y-1/2 w-0.5 h-2 bg-black/80 pointer-events-none"
              style={{ left: `${(chap.time / (duration || 1)) * 100}%` }}
            />
          ))}

          {/* Hover Time Tooltip */}
          {hoverTime !== null && (
            <div 
              className="absolute -top-8 px-2 py-0.5 rounded bg-black/90 text-white text-xs font-semibold -translate-x-1/2 pointer-events-none border border-white/10"
              style={{ left: `${hoverPos}%` }}
            >
              {formatTime(hoverTime)}
            </div>
          )}
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center justify-between text-white text-sm">
          {/* Left Buttons */}
          <div className="flex items-center gap-3">
            <button
              id="player-btn-play-pause"
              onClick={handlePlayPause}
              aria-label={isPlaying ? "Pause video" : "Play video"}
              className="p-1 hover:text-teal-400 transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            <button
              onClick={() => skipTime(-10)}
              title="Rewind 10 seconds (J)"
              className="p-1 hover:text-teal-400 transition-colors text-white/80"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => skipTime(10)}
              title="Forward 10 seconds (L)"
              className="p-1 hover:text-teal-400 transition-colors text-white/80"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2 group/vol">
              <button 
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute" : "Mute"}
                className="p-1 hover:text-teal-400 transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-rose-400" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>

              <input
                id="player-volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 md:w-20 h-1 accent-teal-400 bg-white/30 rounded-lg cursor-pointer"
              />
            </div>

            {/* Time Display */}
            <div className="text-xs font-medium text-white/90 ml-1 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span className="mx-1 text-white/40">/</span>
              <span className="text-white/60">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Auto Play Next Toggle */}
            <button
              onClick={() => setIsAutoPlayNext(prev => !prev)}
              title={`Autoplay next: ${isAutoPlayNext ? 'ON' : 'OFF'}`}
              className={`p-1.5 rounded-md transition-colors ${isAutoPlayNext ? 'text-teal-400' : 'text-white/40 hover:text-white'}`}
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Captions Toggle */}
            <button
              id="player-btn-captions"
              onClick={() => setIsCaptionsOn(prev => !prev)}
              title="Captions / Subtitles (C)"
              className={`p-1.5 rounded-md transition-colors ${isCaptionsOn ? 'bg-teal-500/20 text-teal-400 border-b-2 border-teal-400' : 'text-white/70 hover:text-white'}`}
            >
              <Subtitles className="w-4 h-4" />
            </button>

            {/* Loop Toggle */}
            <button
              onClick={() => setIsLooping(prev => !prev)}
              title="Loop Video"
              className={`p-1.5 rounded-md transition-colors ${isLooping ? 'text-teal-400' : 'text-white/70 hover:text-white'}`}
            >
              <Repeat className="w-4 h-4" />
            </button>

            {/* Settings Menu Button & Popup */}
            <div className="relative">
              <button
                id="player-btn-settings"
                onClick={() => {
                  setShowSettingsMenu(prev => !prev);
                  setActiveSettingsTab('main');
                }}
                title="Settings (Speed, Quality)"
                className={`p-1.5 rounded-md hover:text-teal-400 transition-colors ${showSettingsMenu ? 'text-teal-400 rotate-45' : 'text-white/80'}`}
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Settings Menu Popup */}
              {showSettingsMenu && (
                <div 
                  id="player-settings-popup"
                  className="absolute right-0 bottom-9 w-52 bg-black/95 border border-white/15 rounded-2xl p-2 text-xs shadow-2xl backdrop-blur-md z-40 text-white animate-in fade-in zoom-in-95"
                >
                  {activeSettingsTab === 'main' && (
                    <div className="space-y-1">
                      <button
                        onClick={() => setActiveSettingsTab('speed')}
                        className="w-full px-3 py-2 rounded-xl flex items-center justify-between hover:bg-white/10"
                      >
                        <span className="text-white/70">Playback Speed</span>
                        <span className="font-semibold text-teal-400">{playbackSpeed === 1 ? 'Normal' : `${playbackSpeed}x`}</span>
                      </button>

                      <button
                        onClick={() => setActiveSettingsTab('quality')}
                        className="w-full px-3 py-2 rounded-xl flex items-center justify-between hover:bg-white/10"
                      >
                        <span className="text-white/70">Quality</span>
                        <span className="font-semibold text-teal-400">{quality}</span>
                      </button>
                    </div>
                  )}

                  {activeSettingsTab === 'speed' && (
                    <div className="space-y-0.5 max-h-48 overflow-y-auto">
                      <div className="px-3 py-1 font-semibold text-white/50 border-b border-white/10 mb-1 flex items-center justify-between">
                        <span>Speed</span>
                        <button onClick={() => setActiveSettingsTab('main')} className="text-teal-400 hover:underline">Back</button>
                      </div>
                      {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSpeedChange(s)}
                          className={`w-full px-3 py-1.5 rounded-lg flex items-center justify-between hover:bg-white/10 ${playbackSpeed === s ? 'text-teal-400 font-bold' : 'text-white/80'}`}
                        >
                          <span>{s === 1 ? 'Normal' : `${s}x`}</span>
                          {playbackSpeed === s && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  )}

                  {activeSettingsTab === 'quality' && (
                    <div className="space-y-0.5">
                      <div className="px-3 py-1 font-semibold text-white/50 border-b border-white/10 mb-1 flex items-center justify-between">
                        <span>Resolution</span>
                        <button onClick={() => setActiveSettingsTab('main')} className="text-teal-400 hover:underline">Back</button>
                      </div>
                      {(['1080p', '720p', '480p', '360p', 'Auto'] as VideoQuality[]).map((q) => (
                        <button
                          key={q}
                          onClick={() => handleQualityChange(q)}
                          className={`w-full px-3 py-1.5 rounded-lg flex items-center justify-between hover:bg-white/10 ${quality === q ? 'text-teal-400 font-bold' : 'text-white/80'}`}
                        >
                          <span>{q} {q === '1080p' ? '(HD)' : ''}</span>
                          {quality === q && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Picture in Picture */}
            <button
              onClick={togglePiP}
              title="Picture in Picture"
              className="p-1.5 rounded-md hover:text-teal-400 text-white/80 transition-colors"
            >
              <PictureInPicture2 className="w-4 h-4" />
            </button>

            {/* Theater Mode Toggle */}
            {onToggleTheater && (
              <button
                onClick={onToggleTheater}
                title="Theater mode (T)"
                className={`p-1.5 rounded-md hover:text-teal-400 transition-colors ${theaterMode ? 'text-teal-400' : 'text-white/80'}`}
              >
                <Tv className="w-4 h-4" />
              </button>
            )}

            {/* Fullscreen Toggle */}
            <button
              id="player-btn-fullscreen"
              onClick={toggleFullscreen}
              title="Fullscreen (F)"
              className="p-1.5 rounded-md hover:text-teal-400 text-white/80 transition-colors"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
