import React from 'react';
import { BulBulProvider, useBulBul } from './context/BulBulContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './views/HomeView';
import { WatchView } from './views/WatchView';
import { ShortsView } from './views/ShortsView';
import { SubscriptionsView } from './views/SubscriptionsView';
import { LibraryView } from './views/LibraryView';
import { HistoryView } from './views/HistoryView';
import { TrendingView } from './views/TrendingView';
import { StudioView } from './views/StudioView';
import { ChannelView } from './views/ChannelView';
import { SearchView } from './views/SearchView';
import { PlaylistsView } from './views/PlaylistsView';
import { AdminView } from './views/AdminView';

import { UploadModal } from './components/UploadModal';
import { AuthModal } from './components/AuthModal';
import { ShareModal } from './components/ShareModal';
import { ReportModal } from './components/ReportModal';
import { AddToPlaylistModal } from './components/AddToPlaylistModal';

const BulBulMain: React.FC = () => {
  const { currentView, isSidebarCollapsed } = useBulBul();

  // Certain views like Watch and Shorts may adapt sidebar layout
  const isWatchPage = currentView === 'watch';
  const isShortsPage = currentView === 'shorts';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 antialiased selection:bg-teal-500 selection:text-white">
      
      {/* Top Application Header */}
      <Header />

      {/* Main Workspace with Sidebar and View Router */}
      <div className="flex-1 flex pt-16 pb-16 md:pb-0">
        
        {/* Desktop Sidebar (hidden in full Watch theater or Shorts when desired, or slim) */}
        {!isWatchPage && (
          <aside className="shrink-0 hidden md:block">
            <Sidebar />
          </aside>
        )}

        {/* Dynamic Main Viewport */}
        <main
          className={`flex-1 min-w-0 overflow-y-auto px-2 sm:px-4 md:px-6 py-4 transition-all ${
            !isWatchPage 
              ? (isSidebarCollapsed ? 'md:ml-18' : 'md:ml-60')
              : 'w-full'
          }`}
        >
          {currentView === 'home' && <HomeView />}
          {currentView === 'watch' && <WatchView />}
          {currentView === 'shorts' && <ShortsView />}
          {currentView === 'subscriptions' && <SubscriptionsView />}
          {currentView === 'library' && <LibraryView />}
          {currentView === 'history' && <HistoryView />}
          {currentView === 'trending' && <TrendingView />}
          {currentView === 'studio' && <StudioView />}
          {currentView === 'channel' && <ChannelView />}
          {currentView === 'search' && <SearchView />}
          {currentView === 'playlists' && <PlaylistsView />}
          {currentView === 'admin' && <AdminView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Global Modals */}
      <UploadModal />
      <AuthModal />
      <ShareModal />
      <ReportModal />
      <AddToPlaylistModal />

    </div>
  );
};

export default function App() {
  return (
    <BulBulProvider>
      <BulBulMain />
    </BulBulProvider>
  );
}
