import React, { useState } from 'react';
import { Users, Grid, List, CheckCircle2 } from 'lucide-react';
import { useBulBul } from '../context/BulBulContext';
import { VideoCard } from '../components/VideoCard';

export const SubscriptionsView: React.FC = () => {
  const {
    subscribedChannelIds,
    allUsers,
    videos,
    selectChannel
  } = useBulBul();

  const [filterChannelId, setFilterChannelId] = useState<string | null>(null);

  const subscribedUsers = allUsers.filter(u => subscribedChannelIds.includes(u.id));

  const subscriptionVideos = videos.filter(v => 
    subscribedChannelIds.includes(v.creatorId) &&
    (filterChannelId ? v.creatorId === filterChannelId : true)
  );

  return (
    <div id="bulbul-subscriptions-view" className="max-w-7xl mx-auto space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Subscriptions</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Latest from channels you follow</p>
          </div>
        </div>
      </div>

      {/* Channels Avatar Carousel */}
      <div className="flex items-center gap-4 overflow-x-auto py-2 px-1 no-scrollbar">
        <button
          onClick={() => setFilterChannelId(null)}
          className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl shrink-0 transition-all ${
            filterChannelId === null ? 'bg-teal-500/15 ring-2 ring-teal-500' : 'hover:bg-slate-100 dark:hover:bg-slate-900'
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-slate-900 text-white dark:bg-slate-800 font-bold flex items-center justify-center text-xs">
            ALL
          </div>
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">All Creators</span>
        </button>

        {subscribedUsers.map(user => (
          <button
            key={user.id}
            onClick={() => setFilterChannelId(user.id)}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl shrink-0 transition-all ${
              filterChannelId === user.id ? 'bg-teal-500/15 ring-2 ring-teal-500' : 'hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <img
              src={user.avatar}
              alt=""
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[80px]">
              {user.name.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>

      {/* Feed Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
        {subscriptionVideos.map(video => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {subscriptionVideos.length === 0 && (
        <div className="py-16 text-center text-slate-400 space-y-3">
          <Users className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
          <p>No new videos from your subscribed channels right now.</p>
        </div>
      )}

    </div>
  );
};
