import React from 'react';
import { 
  Home, Zap, Tv, Folder, History, Clock, 
  ThumbsUp, ListVideo, Flame, Music2, Gamepad2, 
  Cpu, UtensilsCrossed, Sparkles, Film, Shield, 
  Settings, HelpCircle, Compass, Trees
} from 'lucide-react';
import { useBulBul } from '../context/BulBulContext';
import { AppView } from '../types';

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    isSidebarCollapsed,
    subscribedChannelIds,
    allUsers,
    selectChannel,
    currentUser,
    setSelectedCategory,
    playlists
  } = useBulBul();

  // Subscribed users
  const subscribedChannels = allUsers.filter(u => subscribedChannelIds.includes(u.id));

  interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    view?: AppView;
    category?: string;
    badge?: string;
    roleRequired?: string;
  }

  const primaryNav: NavItem[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" />, view: 'home' },
    { id: 'shorts', label: 'Flits (Shorts)', icon: <Zap className="w-5 h-5 text-amber-500" />, view: 'shorts', badge: 'Hot' },
    { id: 'subscriptions', label: 'Subscriptions', icon: <Tv className="w-5 h-5" />, view: 'subscriptions' }
  ];

  const libraryNav: NavItem[] = [
    { id: 'library', label: 'Library', icon: <Folder className="w-5 h-5" />, view: 'library' },
    { id: 'history', label: 'History', icon: <History className="w-5 h-5" />, view: 'history' },
    { id: 'watch-later', label: 'Watch Later', icon: <Clock className="w-5 h-5" />, view: 'watch-later' },
    { id: 'liked', label: 'Liked Videos', icon: <ThumbsUp className="w-5 h-5" />, view: 'liked' },
    { id: 'playlists', label: 'Playlists', icon: <ListVideo className="w-5 h-5" />, view: 'playlists' }
  ];

  const exploreNav: NavItem[] = [
    { id: 'trending', label: 'Trending', icon: <Flame className="w-5 h-5 text-rose-500" />, view: 'trending' },
    { id: 'music', label: 'Music & Lo-Fi', icon: <Music2 className="w-5 h-5 text-indigo-400" />, view: 'category', category: 'Music' },
    { id: 'gaming', label: 'Gaming', icon: <Gamepad2 className="w-5 h-5 text-emerald-400" />, view: 'category', category: 'Gaming' },
    { id: 'tech', label: 'Technology', icon: <Cpu className="w-5 h-5 text-cyan-400" />, view: 'category', category: 'Technology' },
    { id: 'nature', label: 'Nature & 4K', icon: <Trees className="w-5 h-5 text-teal-400" />, view: 'category', category: 'Nature' },
    { id: 'cooking', label: 'Cooking & Food', icon: <UtensilsCrossed className="w-5 h-5 text-amber-400" />, view: 'category', category: 'Cooking' },
    { id: 'animation', label: 'Animation & VFX', icon: <Sparkles className="w-5 h-5 text-pink-400" />, view: 'category', category: 'Animation' }
  ];

  const creatorNav: NavItem[] = [
    { id: 'studio', label: 'BulBul Studio', icon: <Film className="w-5 h-5 text-teal-500" />, view: 'studio' },
    { id: 'admin', label: 'Admin Hub', icon: <Shield className="w-5 h-5 text-amber-500" />, view: 'admin', roleRequired: 'Admin' }
  ];

  const handleNavClick = (item: NavItem) => {
    if (item.category) {
      setSelectedCategory(item.category);
      setCurrentView('category');
    } else if (item.view) {
      if (item.view === 'home') {
        setSelectedCategory('All');
      }
      setCurrentView(item.view);
    }
  };

  const isActive = (item: NavItem) => {
    if (item.category) {
      return currentView === 'category';
    }
    return currentView === item.view;
  };

  // Mini collapsed sidebar
  if (isSidebarCollapsed) {
    return (
      <aside 
        id="bulbul-sidebar-mini"
        className="hidden md:flex flex-col items-center py-4 px-1 w-18 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm shrink-0 select-none z-30"
      >
        <div className="space-y-4 w-full flex flex-col items-center">
          {primaryNav.map(item => {
            const active = isActive(item);
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                title={item.label}
                className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${active ? 'bg-teal-500/15 text-teal-600 dark:text-teal-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80'}`}
              >
                {item.icon}
                <span className="text-[10px] truncate max-w-[50px]">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}

          <div className="w-8 h-px bg-slate-200 dark:bg-slate-800" />

          {libraryNav.slice(0, 3).map(item => {
            const active = isActive(item);
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                title={item.label}
                className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${active ? 'bg-teal-500/15 text-teal-600 dark:text-teal-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80'}`}
              >
                {item.icon}
                <span className="text-[10px] truncate max-w-[50px]">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}

          <button
            onClick={() => setCurrentView('studio')}
            title="BulBul Studio"
            className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${currentView === 'studio' ? 'bg-teal-500/20 text-teal-600 dark:text-teal-300 font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Film className="w-5 h-5 text-teal-500" />
            <span className="text-[10px]">Studio</span>
          </button>
        </div>
      </aside>
    );
  }

  // Expanded full sidebar
  return (
    <aside 
      id="bulbul-sidebar-full"
      className="hidden md:flex flex-col w-60 lg:w-64 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md shrink-0 select-none overflow-y-auto max-h-[calc(100vh-4rem)] p-3 z-30 space-y-6 custom-scrollbar"
    >
      {/* Primary Section */}
      <div className="space-y-1">
        {primaryNav.map(item => {
          const active = isActive(item);
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`w-full px-3.5 py-2.5 rounded-xl flex items-center justify-between text-sm font-medium transition-all ${active ? 'bg-gradient-to-r from-teal-500/15 to-cyan-500/10 text-teal-700 dark:text-teal-300 font-semibold shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'}`}
            >
              <div className="flex items-center gap-3.5">
                <span className={active ? 'text-teal-600 dark:text-teal-400' : ''}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-300">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="h-px bg-slate-200/80 dark:bg-slate-800/80" />

      {/* Library Section */}
      <div>
        <div className="px-3.5 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Library & Activity
        </div>
        <div className="space-y-1">
          {libraryNav.map(item => {
            const active = isActive(item);
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`w-full px-3.5 py-2 rounded-xl flex items-center gap-3.5 text-sm font-medium transition-all ${active ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300 font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-slate-200/80 dark:bg-slate-800/80" />

      {/* Subscriptions Section */}
      <div>
        <div className="px-3.5 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
          <span>Subscriptions</span>
          <span className="text-[10px] text-slate-400">({subscribedChannels.length})</span>
        </div>

        <div className="space-y-1">
          {subscribedChannels.length === 0 ? (
            <div className="px-3.5 py-2 text-xs text-slate-400">
              No subscriptions yet. Discover creators!
            </div>
          ) : (
            subscribedChannels.map(channel => (
              <button
                key={channel.id}
                onClick={() => selectChannel(channel.id)}
                className="w-full px-3 py-1.5 rounded-xl flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
              >
                <img
                  src={channel.avatar}
                  alt={channel.name}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover border border-slate-300 dark:border-slate-700 shrink-0"
                />
                <span className="truncate text-xs font-medium">{channel.name}</span>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="h-px bg-slate-200/80 dark:bg-slate-800/80" />

      {/* Explore Section */}
      <div>
        <div className="px-3.5 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Explore Topics
        </div>
        <div className="space-y-1">
          {exploreNav.map(item => {
            const active = isActive(item);
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`w-full px-3.5 py-2 rounded-xl flex items-center gap-3.5 text-sm font-medium transition-all ${active ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300 font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-slate-200/80 dark:bg-slate-800/80" />

      {/* BulBul Pro / Studio / Admin */}
      <div>
        <div className="px-3.5 mb-2 text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          Creator & Control
        </div>
        <div className="space-y-1">
          {creatorNav.map(item => {
            if (item.roleRequired && currentUser.role !== item.roleRequired) return null;
            const active = currentView === item.view;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`w-full px-3.5 py-2 rounded-xl flex items-center gap-3.5 text-sm font-medium transition-all ${active ? 'bg-teal-500/20 text-teal-700 dark:text-teal-300 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer info */}
      <div className="px-3.5 pt-4 pb-8 text-[11px] text-slate-400 dark:text-slate-500 space-y-2">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <span className="hover:underline cursor-pointer">About</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">Press</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">Copyright</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">Creators</span>
        </div>
        <div>
          © 2026 BulBul Media Inc.
        </div>
      </div>
    </aside>
  );
};
