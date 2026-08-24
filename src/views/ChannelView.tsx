import React, { useState } from 'react';
import { 
  CheckCircle2, Bell, BellRing, BellOff, 
  Play, ThumbsUp, MessageSquare, Share2, 
  Calendar, Eye, Globe, ExternalLink, Flame, Sparkles 
} from 'lucide-react';
import { useBulBul } from '../context/BulBulContext';
import { VideoCard } from '../components/VideoCard';
import { CommunityPost } from '../types';

export const ChannelView: React.FC = () => {
  const {
    selectedChannelId,
    allUsers,
    videos,
    isSubscribed,
    toggleSubscribe,
    channelBellSettings,
    setChannelBellSetting,
    selectVideo,
    communityPosts,
    votePoll,
    toggleLikePost,
    playlists,
    setCurrentView
  } = useBulBul();

  const [activeTab, setActiveTab] = useState<'home' | 'videos' | 'shorts' | 'playlists' | 'community' | 'about'>('home');
  const [videoSort, setVideoSort] = useState<'latest' | 'popular'>('latest');
  const [isBellOpen, setIsBellOpen] = useState(false);

  const channel = allUsers.find(u => u.id === selectedChannelId) || allUsers[0];
  const channelVideos = videos.filter(v => v.creatorId === channel.id && !v.isShort);
  const channelShorts = videos.filter(v => v.creatorId === channel.id && v.isShort);
  const channelPosts = communityPosts.filter(p => p.creatorId === channel.id);
  const channelPlaylists = playlists.filter(p => p.userId === channel.id && !p.isPrivate);

  const isSubbed = isSubscribed(channel.id);
  const bellSetting = channelBellSettings[channel.id] || 'personalized';

  // Sort channel videos
  const sortedVideos = [...channelVideos].sort((a, b) => {
    if (videoSort === 'popular') return b.views - a.views;
    return b.id.localeCompare(a.id);
  });

  const featuredTrailer = channelVideos[0];

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    return num.toString();
  };

  return (
    <div id="bulbul-channel-view" className="w-full max-w-7xl mx-auto space-y-6 pb-16">
      
      {/* Banner */}
      <div className="relative w-full aspect-[24/6] min-h-[140px] md:min-h-[200px] rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
        <img
          src={channel.banner || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'}
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Channel Header Profile */}
      <div className="px-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start md:items-center gap-4">
          <img
            src={channel.avatar}
            alt={channel.name}
            referrerPolicy="no-referrer"
            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-white dark:border-slate-900 shadow-xl shrink-0 -mt-10 md:-mt-12 bg-slate-900"
          />

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                {channel.name}
              </h1>
              {channel.isVerified && (
                <CheckCircle2 className="w-5 h-5 text-teal-500 fill-teal-500/20" />
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold">{channel.handle}</span>
              <span>•</span>
              <span>{formatNumber(channel.subscribersCount)} subscribers</span>
              <span>•</span>
              <span>{channelVideos.length + channelShorts.length} videos</span>
            </div>

            {channel.bio && (
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl line-clamp-2 pt-1">
                {channel.bio}
              </p>
            )}
          </div>
        </div>

        {/* Subscribe Action */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            onClick={() => toggleSubscribe(channel.id)}
            className={`px-6 py-2.5 rounded-full font-bold text-xs md:text-sm shadow-md transition-all active:scale-95 ${
              isSubbed 
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700' 
                : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white shadow-teal-500/20'
            }`}
          >
            {isSubbed ? 'Subscribed' : 'Subscribe'}
          </button>

          {isSubbed && (
            <div className="relative">
              <button
                onClick={() => setIsBellOpen(prev => !prev)}
                className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                {bellSetting === 'all' ? <BellRing className="w-4 h-4 text-teal-500" /> : <Bell className="w-4 h-4" />}
              </button>

              {isBellOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-1 z-30 text-xs">
                  <button
                    onClick={() => {
                      setChannelBellSetting(channel.id, 'all');
                      setIsBellOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 ${bellSetting === 'all' ? 'text-teal-600 font-bold' : ''}`}
                  >
                    <BellRing className="w-3.5 h-3.5" />
                    <span>All Notifications</span>
                  </button>
                  <button
                    onClick={() => {
                      setChannelBellSetting(channel.id, 'personalized');
                      setIsBellOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 ${bellSetting === 'personalized' ? 'text-teal-600 font-bold' : ''}`}
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Personalized</span>
                  </button>
                  <button
                    onClick={() => {
                      setChannelBellSetting(channel.id, 'none');
                      setIsBellOpen(false);
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

      {/* Channel Tabs */}
      <div className="px-4 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar text-xs md:text-sm font-semibold">
        {(['home', 'videos', 'shorts', 'playlists', 'community', 'about'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === tab 
                ? 'border-teal-500 text-teal-600 dark:text-teal-400 font-bold' 
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* HOME TAB */}
      {activeTab === 'home' && (
        <div className="px-4 space-y-8">
          {/* Trailer Spotlight */}
          {featuredTrailer && (
            <div 
              onClick={() => selectVideo(featuredTrailer.id)}
              className="p-4 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 cursor-pointer hover:border-teal-500/40 transition-all"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950">
                <img
                  src={featuredTrailer.thumbnail}
                  alt={featuredTrailer.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-lg">
                    <Play className="w-6 h-6 ml-0.5 fill-white" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  Featured Premiere
                </span>
                <h3 className="font-bold text-base md:text-lg text-slate-900 dark:text-white">
                  {featuredTrailer.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {featuredTrailer.description}
                </p>
                <div className="text-xs text-slate-400 pt-1">
                  {featuredTrailer.views.toLocaleString()} views • {featuredTrailer.uploadDate}
                </div>
              </div>
            </div>
          )}

          {/* Recent Uploads Row */}
          <div className="space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Recent Uploads</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {channelVideos.slice(0, 4).map(v => (
                <VideoCard key={v.id} video={v} showChannelAvatar={false} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIDEOS TAB */}
      {activeTab === 'videos' && (
        <div className="px-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">All Videos</h3>
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setVideoSort('latest')}
                className={`px-3 py-1 rounded-full ${videoSort === 'latest' ? 'bg-teal-500/20 text-teal-600 font-bold' : 'text-slate-500'}`}
              >
                Latest
              </button>
              <button
                onClick={() => setVideoSort('popular')}
                className={`px-3 py-1 rounded-full ${videoSort === 'popular' ? 'bg-teal-500/20 text-teal-600 font-bold' : 'text-slate-500'}`}
              >
                Most Popular
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sortedVideos.map(v => (
              <VideoCard key={v.id} video={v} showChannelAvatar={false} />
            ))}
          </div>
        </div>
      )}

      {/* SHORTS / FLITS TAB */}
      {activeTab === 'shorts' && (
        <div className="px-4 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {channelShorts.map(s => (
              <div
                key={s.id}
                onClick={() => setCurrentView('shorts')}
                className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-slate-950 cursor-pointer border border-slate-200 dark:border-slate-800"
              >
                <img
                  src={s.thumbnail}
                  alt={s.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5 text-white">
                  <span className="font-semibold text-xs line-clamp-2 leading-tight">{s.title}</span>
                  <span className="text-[10px] text-white/70">{(s.views / 1000).toFixed(0)}K views</span>
                </div>
              </div>
            ))}
          </div>

          {channelShorts.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              This creator hasn't published any Flits yet.
            </div>
          )}
        </div>
      )}

      {/* PLAYLISTS TAB */}
      {activeTab === 'playlists' && (
        <div className="px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {channelPlaylists.map(pl => (
            <div key={pl.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <img src={pl.thumbnail} alt="" referrerPolicy="no-referrer" className="w-full aspect-video rounded-xl object-cover" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{pl.title}</h4>
              <p className="text-xs text-slate-400">{pl.videoIds.length} videos</p>
            </div>
          ))}
          {channelPlaylists.length === 0 && (
            <div className="py-12 text-center text-slate-400 col-span-full">
              No public playlists available.
            </div>
          )}
        </div>
      )}

      {/* COMMUNITY TAB */}
      {activeTab === 'community' && (
        <div className="px-4 max-w-2xl space-y-4">
          {channelPosts.map((post) => (
            <div key={post.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <img src={post.creatorAvatar} alt="" referrerPolicy="no-referrer" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">{post.creatorName}</div>
                  <div className="text-[10px] text-slate-400">{post.timestamp}</div>
                </div>
              </div>

              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>

              {post.image && (
                <img src={post.image} alt="" referrerPolicy="no-referrer" className="w-full rounded-2xl object-cover max-h-96" />
              )}

              {/* Poll UI */}
              {post.poll && (
                <div className="space-y-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div className="font-semibold text-xs text-slate-900 dark:text-white">{post.poll.question}</div>
                  <div className="space-y-2">
                    {post.poll.options.map((opt) => {
                      const pct = post.poll && post.poll.totalVotes > 0 ? Math.round((opt.votes / post.poll.totalVotes) * 100) : 0;
                      const hasVoted = Boolean(post.poll?.userVote);
                      const isMyPick = post.poll?.userVote === opt.id;

                      return (
                        <div
                          key={opt.id}
                          onClick={() => votePoll(post.id, opt.id)}
                          className={`relative overflow-hidden p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                            isMyPick ? 'border-teal-500 bg-teal-500/10 font-bold' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          {hasVoted && (
                            <div 
                              className="absolute inset-y-0 left-0 bg-teal-500/20 pointer-events-none transition-all duration-500" 
                              style={{ width: `${pct}%` }} 
                            />
                          )}
                          <div className="relative flex justify-between">
                            <span>{opt.text}</span>
                            {hasVoted && <span className="font-bold">{pct}%</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-[10px] text-slate-400">{post.poll.totalVotes.toLocaleString()} total votes</div>
                </div>
              )}

              {/* Post Likes */}
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                <button
                  onClick={() => toggleLikePost(post.id)}
                  className={`flex items-center gap-1.5 p-1 rounded ${post.isLiked ? 'text-teal-600 font-bold' : ''}`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{post.likes}</span>
                </button>
              </div>
            </div>
          ))}

          {channelPosts.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              No community posts yet.
            </div>
          )}
        </div>
      )}

      {/* ABOUT TAB */}
      {activeTab === 'about' && (
        <div className="px-4 max-w-2xl space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">About {channel.name}</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {channel.bio || 'Digital creator on BulBul sharing original content.'}
            </p>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Joined BulBul</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{channel.joinedDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Total Lifetime Views</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{(channel.totalViews || 1400000).toLocaleString()} views</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
