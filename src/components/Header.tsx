import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, Search, Mic, Video, Bell, Moon, Sun, 
  User, CheckCircle2, Shield, Radio, Flame, Sparkles, 
  LogOut, UploadCloud, Film, Check, ExternalLink, X, PlusCircle 
} from 'lucide-react';
import { useBulBul } from '../context/BulBulContext';
import { BulBulLogo } from './BulBulLogo';

export const Header: React.FC = () => {
  const {
    toggleSidebar,
    isDarkMode,
    toggleDarkMode,
    searchQuery,
    setSearchQuery,
    triggerSearch,
    currentUser,
    allUsers,
    loginAs,
    setCurrentView,
    setUploadModalOpen,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    selectVideo,
    selectChannel,
    setAuthModalOpen,
    videos
  } = useBulBul();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const createMenuRef = useRef<HTMLDivElement>(null);

  // Auto suggestions based on available videos and tags
  const suggestions = React.useMemo(() => {
    if (!searchQuery.trim()) return ['Quantum hyperdrive', '4K nature rainforest', 'Fullstack course', 'Michelin Ramen Kyoto', 'Sci-fi 3D animation'];
    const query = searchQuery.toLowerCase();
    const matches: string[] = [];
    videos.forEach(v => {
      if (v.title.toLowerCase().includes(query) && !matches.includes(v.title)) {
        matches.push(v.title);
      }
      v.tags.forEach(t => {
        if (t.toLowerCase().includes(query) && !matches.includes(t)) {
          matches.push(t);
        }
      });
    });
    return matches.slice(0, 6);
  }, [searchQuery, videos]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (createMenuRef.current && !createMenuRef.current.contains(e.target as Node)) {
        setIsCreateMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      triggerSearch(searchQuery.trim());
    }
  };

  const handleVoiceSearchSimulation = () => {
    setIsVoiceListening(true);
    setVoiceTranscript('Listening to your voice...');
    const samples = [
      'Show me quantum physics documentaries',
      'Relaxing 4k rainforest sounds',
      'Next.js and TypeScript architecture',
      'Japanese street ramen cooking'
    ];
    const picked = samples[Math.floor(Math.random() * samples.length)];

    setTimeout(() => {
      setVoiceTranscript(`"${picked}"`);
    }, 1200);

    setTimeout(() => {
      setSearchQuery(picked);
      setIsVoiceListening(false);
      setVoiceTranscript('');
      triggerSearch(picked);
    }, 2400);
  };

  return (
    <header 
      id="bulbul-header"
      className="sticky top-0 z-40 h-16 w-full px-3 md:px-6 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-colors"
    >
      {/* Left section */}
      <div className="flex items-center gap-2 md:gap-4">
        <button
          id="btn-toggle-sidebar"
          onClick={toggleSidebar}
          aria-label="Toggle navigation drawer"
          className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <BulBulLogo 
          size="md" 
          onClick={() => {
            setCurrentView('home');
            setSearchQuery('');
          }} 
        />
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-2xl mx-3 md:mx-8 relative">
        <form onSubmit={handleSearchSubmit} className="flex items-center">
          <div className="relative flex-1 flex items-center">
            <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
              <Search className="w-4 h-4" />
            </div>
            
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search videos, creators, music, audio..."
              className="w-full h-10 pl-10 pr-9 rounded-l-full bg-slate-100 dark:bg-slate-900/90 border border-r-0 border-slate-300/80 dark:border-slate-700/80 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500/30 transition-all"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            id="btn-search-submit"
            type="submit"
            aria-label="Search"
            className="h-10 px-5 flex items-center justify-center rounded-r-full bg-slate-200/90 dark:bg-slate-800 border border-slate-300/80 dark:border-slate-700/80 hover:bg-slate-300/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Voice Search Simulation */}
          <button
            id="btn-voice-search"
            type="button"
            onClick={handleVoiceSearchSimulation}
            title="Voice Search"
            aria-label="Voice Search"
            className="ml-2.5 p-2.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-teal-500/10 hover:text-teal-600 dark:hover:text-teal-400 border border-slate-200 dark:border-slate-800 transition-all"
          >
            <Mic className="w-4 h-4" />
          </button>
        </form>

        {/* Search Suggestions Dropdown */}
        {isSearchFocused && suggestions.length > 0 && (
          <div 
            id="search-suggestions-box"
            className="absolute top-12 left-0 right-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 overflow-hidden"
          >
            <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Suggestions & Trending
            </div>
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onMouseDown={() => {
                  setSearchQuery(item);
                  triggerSearch(item);
                  setIsSearchFocused(false);
                }}
                className="w-full px-4 py-2 text-left text-sm flex items-center gap-3 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{item}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 md:gap-3">
        {/* Create / Upload Dropdown */}
        <div className="relative" ref={createMenuRef}>
          <button
            id="btn-create-menu"
            onClick={() => setIsCreateMenuOpen(prev => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-medium text-xs md:text-sm shadow-sm shadow-teal-500/25 transition-all duration-200 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Create</span>
          </button>

          {isCreateMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <button
                id="menu-item-upload-video"
                onClick={() => {
                  setIsCreateMenuOpen(false);
                  setUploadModalOpen(true);
                }}
                className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-teal-950/40 hover:text-teal-600 dark:hover:text-teal-400"
              >
                <UploadCloud className="w-4 h-4 text-teal-500" />
                <div>
                  <div className="font-medium">Upload Video</div>
                  <div className="text-xs text-slate-400">Long-form or Flits</div>
                </div>
              </button>

              <button
                id="menu-item-bulbul-studio"
                onClick={() => {
                  setIsCreateMenuOpen(false);
                  setCurrentView('studio');
                }}
                className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-teal-950/40 hover:text-teal-600 dark:hover:text-teal-400"
              >
                <Film className="w-4 h-4 text-cyan-500" />
                <div>
                  <div className="font-medium">BulBul Studio</div>
                  <div className="text-xs text-slate-400">Creator Analytics & Tools</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          id="btn-toggle-theme"
          onClick={toggleDarkMode}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            id="btn-notifications-bell"
            onClick={() => setIsNotifOpen(prev => !prev)}
            aria-label="Notifications"
            className="relative p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white">Notifications</span>
                  {unreadNotificationCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold">
                      {unreadNotificationCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <button 
                    onClick={markAllNotificationsAsRead}
                    className="text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    Mark read
                  </button>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <button 
                    onClick={clearNotifications}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                {notifications.length === 0 ? (
                  <div className="py-10 text-center text-slate-400 text-sm">
                    No new notifications right now.
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        if (n.targetId) {
                          if (n.targetId.startsWith('vid_') || n.targetId.startsWith('short_')) {
                            selectVideo(n.targetId);
                          } else if (n.targetId.startsWith('user_') || n.targetId.startsWith('creator_')) {
                            selectChannel(n.targetId);
                          }
                        }
                        setIsNotifOpen(false);
                      }}
                      className={`p-3.5 flex gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors ${!n.read ? 'bg-teal-50/40 dark:bg-teal-950/20' : ''}`}
                    >
                      {n.avatar ? (
                        <img 
                          src={n.avatar} 
                          alt="" 
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700" 
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-600 flex items-center justify-center shrink-0">
                          <Bell className="w-5 h-5" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                          {n.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                          {n.message}
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                          {n.timestamp}
                        </span>
                      </div>

                      {n.thumbnail && (
                        <img 
                          src={n.thumbnail} 
                          alt="" 
                          referrerPolicy="no-referrer"
                          className="w-12 h-8 rounded-md object-cover shrink-0 border border-slate-200 dark:border-slate-700" 
                        />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Account Avatar & Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            id="btn-user-profile-menu"
            onClick={() => setIsUserMenuOpen(prev => !prev)}
            aria-label="User profile menu"
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-teal-500/40 transition-all"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-teal-500/30"
            />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* Profile header */}
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <img
                  src={currentUser.avatar}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover border border-teal-500/40"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                    <span className="truncate">{currentUser.name}</span>
                    {currentUser.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {currentUser.handle}
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[10px] font-medium">
                    {currentUser.role} • {currentUser.subscribersCount.toLocaleString()} subs
                  </div>
                </div>
              </div>

              {/* Navigation links */}
              <div className="py-1">
                <button
                  id="menu-view-my-channel"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    selectChannel(currentUser.id);
                  }}
                  className="w-full px-4 py-2 text-left text-sm flex items-center gap-3 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Your Channel</span>
                </button>

                <button
                  id="menu-view-bulbul-studio"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setCurrentView('studio');
                  }}
                  className="w-full px-4 py-2 text-left text-sm flex items-center gap-3 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Film className="w-4 h-4 text-teal-500" />
                  <span className="flex-1">BulBul Studio</span>
                  <span className="text-[10px] bg-teal-500/20 text-teal-600 dark:text-teal-300 font-bold px-1.5 py-0.5 rounded">Pro</span>
                </button>

                {currentUser.role === 'Admin' && (
                  <button
                    id="menu-view-admin-dashboard"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setCurrentView('admin');
                    }}
                    className="w-full px-4 py-2 text-left text-sm flex items-center gap-3 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Shield className="w-4 h-4 text-amber-500" />
                    <span>BulBul Control Hub (Admin)</span>
                  </button>
                )}
              </div>

              {/* Switch Demo Accounts */}
              <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Quick Switch Account
                </div>
                <div className="space-y-1">
                  {allUsers.slice(0, 3).map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        loginAs(u.id);
                        setIsUserMenuOpen(false);
                      }}
                      className={`w-full px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${currentUser.id === u.id ? 'bg-teal-500/15 text-teal-600 dark:text-teal-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <img src={u.avatar} alt="" referrerPolicy="no-referrer" className="w-5 h-5 rounded-full object-cover" />
                        <span className="truncate">{u.name} ({u.role})</span>
                      </div>
                      {currentUser.id === u.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Login / Auth */}
              <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  id="menu-btn-open-auth"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="w-full py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Sign In / Create New Account</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Voice Search Active Modal Dialog */}
      {isVoiceListening && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl flex flex-col items-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-lg animate-bounce">
                <Mic className="w-10 h-10" />
              </div>
              <div className="absolute inset-0 rounded-full bg-teal-400/40 animate-ping" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Listening to BulBul Voice...
            </h3>
            <p className="text-sm text-teal-600 dark:text-teal-400 min-h-[28px] font-medium">
              {voiceTranscript || 'Speak anything to search...'}
            </p>

            <button
              onClick={() => setIsVoiceListening(false)}
              className="mt-6 px-5 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
