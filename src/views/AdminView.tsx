import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, Users, Film, 
  CheckCircle2, XCircle, Trash2, Eye, Ban, 
  Bell, Send, Award, Sparkles 
} from 'lucide-react';
import { useBulBul } from '../context/BulBulContext';
import { UserRole } from '../types';

export const AdminView: React.FC = () => {
  const {
    currentUser,
    allUsers,
    videos,
    reports,
    deleteVideo,
    resolveReport,
    selectVideo
  } = useBulBul();

  const [adminTab, setAdminTab] = useState<'overview' | 'reports' | 'users' | 'broadcast'>('overview');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Totals
  const totalPlatformViews = videos.reduce((acc, v) => acc + v.views, 0);
  const totalLikes = videos.reduce((acc, v) => acc + v.likes, 0);
  const pendingReports = reports.filter(r => r.status === 'pending');

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastTitle('');
      setBroadcastMessage('');
    }, 3000);
  };

  return (
    <div id="bulbul-admin-view" className="max-w-7xl mx-auto space-y-6 pb-16">
      
      {/* Admin Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black">BulBul Admin & Moderation Center</h1>
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/30 text-indigo-300 text-xs font-bold">SUPERADMIN</span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Platform governance, moderation, trust & safety tools
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs md:text-sm font-semibold">
        <button
          onClick={() => setAdminTab('overview')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${adminTab === 'overview' ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          <span>Overview</span>
        </button>

        <button
          onClick={() => setAdminTab('reports')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${adminTab === 'reports' ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          <span>Reports & Moderation</span>
          {pendingReports.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
              {pendingReports.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('users')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${adminTab === 'users' ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          <span>Users & Verification ({allUsers.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('broadcast')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${adminTab === 'broadcast' ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          <span>System Broadcast</span>
        </button>
      </div>

      {/* OVERVIEW */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-xs text-slate-400 font-bold">Total Platform Views</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalPlatformViews.toLocaleString()}</div>
              <div className="text-[11px] text-emerald-500 mt-1">● Healthy Stream Traffic</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-xs text-slate-400 font-bold">Published Videos</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{videos.length}</div>
              <div className="text-[11px] text-teal-500 mt-1">100% transcode operational</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-xs text-slate-400 font-bold">Registered Users</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{allUsers.length}</div>
              <div className="text-[11px] text-indigo-500 mt-1">Global Creators & Viewers</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-xs text-slate-400 font-bold">Pending Reports</div>
              <div className="text-2xl font-black text-rose-500 mt-1">{pendingReports.length}</div>
              <div className="text-[11px] text-slate-400 mt-1">Requires human review</div>
            </div>
          </div>
        </div>
      )}

      {/* REPORTS & MODERATION */}
      {adminTab === 'reports' && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Flagged Content Moderation Queue</h3>
          
          <div className="space-y-3">
            {reports.map((report) => {
              const video = videos.find(v => v.id === report.videoId);
              return (
                <div key={report.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-500">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Report Reason: {report.reason}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${report.status === 'pending' ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                      {report.status}
                    </span>
                  </div>

                  {video && (
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                      <img src={video.thumbnail} alt="" referrerPolicy="no-referrer" className="w-24 aspect-video rounded-xl object-cover shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-slate-900 dark:text-white truncate">{video.title}</div>
                        <div className="text-[11px] text-slate-400">By {video.creatorName} • {video.views.toLocaleString()} views</div>
                      </div>
                      <button
                        onClick={() => selectVideo(video.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-semibold"
                      >
                        Inspect
                      </button>
                    </div>
                  )}

                  {report.details && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 italic bg-slate-100/50 dark:bg-slate-800/40 p-2.5 rounded-xl">
                      "{report.details}"
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>Reported {report.timestamp}</span>

                    {report.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => resolveReport(report.id, 'dismiss')}
                          className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold"
                        >
                          Dismiss Report
                        </button>
                        <button
                          onClick={() => resolveReport(report.id, 'remove_video')}
                          className="px-3.5 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold"
                        >
                          Take Down Video
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {reports.length === 0 && (
              <div className="py-16 text-center text-slate-400">
                All clean! No flagged reports currently in moderation.
              </div>
            )}
          </div>
        </div>
      )}

      {/* USERS & VERIFICATION */}
      {adminTab === 'users' && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Platform User Directory</h3>
          
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Subscribers</th>
                    <th className="py-3 px-4">Verified Badge</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {allUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} alt="" referrerPolicy="no-referrer" className="w-8 h-8 rounded-full object-cover shrink-0" />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                              <span>{user.name}</span>
                              {user.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />}
                            </div>
                            <div className="text-[10px] text-slate-400">{user.handle} • {user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold">{user.subscribersCount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        {user.isVerified ? (
                          <span className="text-emerald-500 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                          </span>
                        ) : (
                          <span className="text-slate-400">Standard</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* BROADCAST */}
      {adminTab === 'broadcast' && (
        <form onSubmit={handleBroadcast} className="max-w-2xl bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-indigo-500">
            <Bell className="w-5 h-5" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Broadcast Platform Announcement</h3>
          </div>
          <p className="text-xs text-slate-500">Sends a live push notification to all active BulBul users.</p>

          <div>
            <label className="block text-xs font-bold mb-1">Announcement Title</label>
            <input
              type="text"
              placeholder="e.g., BulBul 2.0 Creator Monetization Update"
              value={broadcastTitle}
              onChange={(e) => setBroadcastTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Message Body</label>
            <textarea
              rows={3}
              placeholder="Write the platform update details..."
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
              required
            />
          </div>

          {broadcastSent && (
            <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Broadcast dispatched to all users successfully!</span>
            </div>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Send Broadcast</span>
          </button>
        </form>
      )}

    </div>
  );
};
