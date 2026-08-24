import React, { useState } from 'react';
import { 
  Film, BarChart3, MessageSquare, ListVideo, 
  Settings, UploadCloud, Edit3, Trash2, Eye, 
  ThumbsUp, DollarSign, Users, Clock, Plus, 
  CheckCircle2, Globe, Lock, EyeOff, Save, X, ExternalLink 
} from 'lucide-react';
import { useBulBul } from '../context/BulBulContext';
import { Video, VideoVisibility, Playlist } from '../types';

export const StudioView: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    videos,
    deleteVideo,
    updateVideo,
    playlists,
    createPlaylist,
    deletePlaylist,
    comments,
    toggleHeartComment,
    togglePinComment,
    deleteComment,
    selectVideo,
    setUploadModalOpen
  } = useBulBul();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'content' | 'analytics' | 'comments' | 'playlists' | 'customization'>('dashboard');

  // Filter creator videos
  const creatorVideos = videos.filter(v => v.creatorId === currentUser.id);

  // Edit Video Modal state
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editVisibility, setEditVisibility] = useState<VideoVisibility>('Public');
  const [editTags, setEditTags] = useState('');

  // Channel Customization state
  const [customName, setCustomName] = useState(currentUser.name);
  const [customHandle, setCustomHandle] = useState(currentUser.handle);
  const [customBio, setCustomBio] = useState(currentUser.bio || '');
  const [customAvatar, setCustomAvatar] = useState(currentUser.avatar);
  const [customBanner, setCustomBanner] = useState(currentUser.banner || '');

  // Playlist creation inside studio
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [newPlaylistPrivate, setNewPlaylistPrivate] = useState(false);

  // Calculate totals
  const totalViews = creatorVideos.reduce((acc, v) => acc + v.views, 0) + (currentUser.totalViews || 0);
  const totalLikes = creatorVideos.reduce((acc, v) => acc + v.likes, 0);
  const totalWatchHours = Math.round(totalViews * 0.08);
  const estRevenue = (totalViews * 0.0024).toFixed(2);

  const openEditModal = (v: Video) => {
    setEditingVideo(v);
    setEditTitle(v.title);
    setEditDesc(v.description);
    setEditCategory(v.category);
    setEditVisibility(v.visibility);
    setEditTags(v.tags.join(', '));
  };

  const handleSaveVideoEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;
    updateVideo(editingVideo.id, {
      title: editTitle,
      description: editDesc,
      category: editCategory,
      visibility: editVisibility,
      tags: editTags.split(',').map(t => t.trim()).filter(Boolean)
    });
    setEditingVideo(null);
  };

  const handleSaveCustomization = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: customName,
      handle: customHandle,
      bio: customBio,
      avatar: customAvatar,
      banner: customBanner
    });
    alert('Channel branding updated successfully!');
  };

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistTitle.trim()) return;
    createPlaylist(newPlaylistTitle, newPlaylistDesc, newPlaylistPrivate);
    setNewPlaylistTitle('');
    setNewPlaylistDesc('');
  };

  return (
    <div id="bulbul-studio-view" className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-teal-900/40 via-slate-900/80 to-slate-950 border border-teal-500/30 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
            <Film className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black">BulBul Creator Studio</h1>
              <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 text-xs font-bold">PRO</span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Managing channel for <strong className="text-teal-400">{currentUser.name}</strong> ({currentUser.handle})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-bold text-xs md:text-sm flex items-center gap-2 shadow-md shadow-teal-500/25 active:scale-95 transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Video</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar text-xs md:text-sm font-semibold">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${activeTab === 'dashboard' ? 'bg-teal-500/20 text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${activeTab === 'content' ? 'bg-teal-500/20 text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          <Film className="w-4 h-4" />
          <span>Content ({creatorVideos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${activeTab === 'analytics' ? 'bg-teal-500/20 text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('comments')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${activeTab === 'comments' ? 'bg-teal-500/20 text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Comments</span>
        </button>

        <button
          onClick={() => setActiveTab('playlists')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${activeTab === 'playlists' ? 'bg-teal-500/20 text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          <ListVideo className="w-4 h-4" />
          <span>Playlists</span>
        </button>

        <button
          onClick={() => setActiveTab('customization')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${activeTab === 'customization' ? 'bg-teal-500/20 text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          <Settings className="w-4 h-4" />
          <span>Channel Branding</span>
        </button>
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                <span>Total Views</span>
                <Eye className="w-4 h-4 text-teal-500" />
              </div>
              <div className="my-2">
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {totalViews.toLocaleString()}
                </div>
                <div className="text-xs text-emerald-500 font-medium mt-0.5">
                  +18.4% vs last 28 days
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                <span>Watch Time</span>
                <Clock className="w-4 h-4 text-cyan-500" />
              </div>
              <div className="my-2">
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {totalWatchHours.toLocaleString()} hrs
                </div>
                <div className="text-xs text-emerald-500 font-medium mt-0.5">
                  +24.1% vs last 28 days
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                <span>Subscribers</span>
                <Users className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="my-2">
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {currentUser.subscribersCount.toLocaleString()}
                </div>
                <div className="text-xs text-emerald-500 font-medium mt-0.5">
                  +340 new this week
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                <span>Estimated Revenue</span>
                <DollarSign className="w-4 h-4 text-amber-500" />
              </div>
              <div className="my-2">
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  ${estRevenue}
                </div>
                <div className="text-xs text-teal-500 font-medium mt-0.5">
                  BulBul Partner Program Active
                </div>
              </div>
            </div>
          </div>

          {/* 28-day analytics interactive visual mockup */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Audience Retention & Daily Views
                </h3>
                <p className="text-xs text-slate-400">Past 28 Days Activity Breakdown</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold">
                Realtime Sync
              </span>
            </div>

            {/* Custom Bar Graph */}
            <div className="h-44 w-full flex items-end gap-1.5 pt-6 pb-2">
              {[42, 58, 65, 50, 72, 85, 94, 60, 75, 88, 110, 95, 120, 140, 135, 115, 160, 175, 190, 180, 210, 230, 205, 240, 270, 290, 310, 340].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group/bar relative">
                  <div 
                    className="w-full rounded-t-md bg-gradient-to-t from-teal-600 to-cyan-400 group-hover/bar:from-amber-400 group-hover/bar:to-pink-500 transition-all duration-200"
                    style={{ height: `${(val / 350) * 100}%` }}
                  />
                  <div className="absolute -top-7 opacity-0 group-hover/bar:opacity-100 px-2 py-0.5 rounded bg-black text-white text-[10px] font-bold pointer-events-none whitespace-nowrap z-20">
                    Day {i + 1}: {val * 100} views
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CONTENT / VIDEOS MANAGER TAB */}
      {activeTab === 'content' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Channel Videos ({creatorVideos.length})
            </h3>
            <button
              onClick={() => setUploadModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Video</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Video</th>
                    <th className="py-3 px-4">Visibility</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Views</th>
                    <th className="py-3 px-4">Likes</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {creatorVideos.map((video) => (
                    <tr key={video.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={video.thumbnail}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-20 aspect-video rounded-lg object-cover bg-slate-950 shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <div className="font-semibold text-slate-900 dark:text-white truncate">
                              {video.title}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {video.isShort ? '⚡ Flit (Short)' : '📹 Long-Form'} • {video.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold">
                          <Globe className="w-3 h-3" />
                          <span>{video.visibility}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{video.uploadDate}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{video.views.toLocaleString()}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{video.likes.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => selectVideo(video.id)}
                          title="Watch Video"
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-teal-500"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(video)}
                          title="Edit Video Details"
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-cyan-500"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete video "${video.title}"?`)) {
                              deleteVideo(video.id);
                            }
                          }}
                          title="Delete Video"
                          className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-500 hover:text-rose-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Channel Traffic Sources & Demographics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2">
                <div className="text-xs font-semibold text-slate-400">Traffic Source</div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-medium">
                    <span>BulBul Recommendation</span>
                    <span className="font-bold text-teal-500">62%</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>BulBul Search</span>
                    <span className="font-bold text-cyan-500">24%</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Flits Feed</span>
                    <span className="font-bold text-amber-500">14%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2">
                <div className="text-xs font-semibold text-slate-400">Top Geographies</div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-medium">
                    <span>United States</span>
                    <span className="font-bold">41%</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>United Kingdom</span>
                    <span className="font-bold">18%</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Germany / Europe</span>
                    <span className="font-bold">15%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2">
                <div className="text-xs font-semibold text-slate-400">Subscriber Engagement</div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-medium">
                    <span>Subscribed Viewers</span>
                    <span className="font-bold text-emerald-500">54%</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Non-Subscribed</span>
                    <span className="font-bold text-slate-400">46%</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Avg Watch Duration</span>
                    <span className="font-bold text-indigo-400">6m 42s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMMENTS MODERATION TAB */}
      {activeTab === 'comments' && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            Community Comments Moderation
          </h3>
          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-4">
                <img
                  src={c.userAvatar}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{c.userName}</span>
                    <span className="text-[11px] text-slate-400">{c.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300">{c.text}</p>
                  <div className="flex items-center gap-3 pt-1 text-xs">
                    <button
                      onClick={() => toggleHeartComment(c.id)}
                      className={`flex items-center gap-1 font-semibold ${c.isHeartedByCreator ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
                    >
                      <span>Creator Heart</span>
                    </button>
                    <button
                      onClick={() => togglePinComment(c.id)}
                      className={`flex items-center gap-1 font-semibold ${c.isPinned ? 'text-teal-500' : 'text-slate-400 hover:text-teal-500'}`}
                    >
                      <span>Pin</span>
                    </button>
                    <button
                      onClick={() => deleteComment(c.id)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PLAYLISTS MANAGER TAB */}
      {activeTab === 'playlists' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">Create New Playlist</h3>
            <form onSubmit={handleCreatePlaylist} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Playlist Title"
                value={newPlaylistTitle}
                onChange={(e) => setNewPlaylistTitle(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
              />
              <input
                type="text"
                placeholder="Description"
                value={newPlaylistDesc}
                onChange={(e) => setNewPlaylistDesc(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-500"
              >
                Create Playlist
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map((pl) => (
              <div key={pl.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <img
                  src={pl.thumbnail}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-full aspect-video rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{pl.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{pl.videoIds.length} videos • {pl.isPrivate ? 'Private' : 'Public'}</p>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => deletePlaylist(pl.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-xs font-semibold"
                  >
                    Delete Playlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CHANNEL BRANDING / CUSTOMIZATION TAB */}
      {activeTab === 'customization' && (
        <form onSubmit={handleSaveCustomization} className="space-y-6 max-w-2xl bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Channel Customization & Branding</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Channel Name</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Channel Handle</label>
              <input
                type="text"
                value={customHandle}
                onChange={(e) => setCustomHandle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Bio / About</label>
              <textarea
                rows={3}
                value={customBio}
                onChange={(e) => setCustomBio(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Avatar Image URL</label>
              <input
                type="text"
                value={customAvatar}
                onChange={(e) => setCustomAvatar(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Banner Image URL</label>
              <input
                type="text"
                value={customBanner}
                onChange={(e) => setCustomBanner(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* Video Details Edit Modal */}
      {editingVideo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-xl w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white">Edit Video Details</h3>
              <button onClick={() => setEditingVideo(null)} className="p-1 rounded-full text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVideoEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Category</label>
                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Visibility</label>
                  <select
                    value={editVisibility}
                    onChange={(e) => setEditVisibility(e.target.value as VideoVisibility)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <option value="Public">Public</option>
                    <option value="Unlisted">Unlisted</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
