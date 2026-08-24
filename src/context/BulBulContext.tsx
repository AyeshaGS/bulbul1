import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Video, User, Comment, Playlist, NotificationItem, 
  CommunityPost, ReportItem, AppView, VideoVisibility, BellNotificationSetting 
} from '../types';
import { 
  INITIAL_USERS, INITIAL_VIDEOS, INITIAL_COMMENTS, 
  INITIAL_PLAYLISTS, INITIAL_NOTIFICATIONS, INITIAL_COMMUNITY_POSTS, 
  INITIAL_REPORTS, CATEGORIES 
} from '../data/mockData';
import confetti from 'canvas-confetti';

interface BulBulContextType {
  // Navigation & View
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedVideoId: string | null;
  selectedVideo: Video | null;
  selectVideo: (videoId: string, queue?: string[]) => void;
  selectedChannelId: string | null;
  selectChannel: (channelId: string) => void;
  selectedPlaylistId: string | null;
  selectPlaylist: (playlistId: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  triggerSearch: (query: string) => void;
  
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Sidebar
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Authentication & Users
  currentUser: User;
  allUsers: User[];
  loginAs: (userId: string) => void;
  loginUser: (email: string, name: string) => void;
  logoutUser: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  
  // Videos
  videos: Video[];
  featuredVideo: Video | null;
  addVideo: (video: Omit<Video, 'id' | 'views' | 'likes' | 'dislikes' | 'uploadDate'>) => Video;
  updateVideo: (videoId: string, updates: Partial<Video>) => void;
  deleteVideo: (videoId: string) => void;
  incrementVideoViews: (videoId: string) => void;
  
  // Engagement (Likes/Dislikes)
  likedVideoIds: string[];
  dislikedVideoIds: string[];
  toggleLikeVideo: (videoId: string) => void;
  toggleDislikeVideo: (videoId: string) => void;

  // Subscriptions
  subscribedChannelIds: string[];
  channelBellSettings: Record<string, BellNotificationSetting>;
  toggleSubscribe: (channelId: string) => void;
  setChannelBellSetting: (channelId: string, setting: BellNotificationSetting) => void;
  isSubscribed: (channelId: string) => boolean;

  // Watch History & Watch Later
  watchHistory: { videoId: string; watchedAt: string; progress: number }[];
  addToHistory: (videoId: string, progress?: number) => void;
  removeFromHistory: (videoId: string) => void;
  clearHistory: () => void;
  watchLaterVideoIds: string[];
  toggleWatchLater: (videoId: string) => void;
  isInWatchLater: (videoId: string) => boolean;

  // Playlists
  playlists: Playlist[];
  createPlaylist: (title: string, description: string, isPrivate: boolean, initialVideoId?: string) => Playlist;
  addVideoToPlaylist: (playlistId: string, videoId: string) => void;
  removeVideoFromPlaylist: (playlistId: string, videoId: string) => void;
  deletePlaylist: (playlistId: string) => void;
  currentPlaylistQueue: string[];
  playlistQueueIndex: number;
  playNextInQueue: () => void;
  playPreviousInQueue: () => void;

  // Comments
  comments: Comment[];
  addComment: (videoId: string, text: string) => void;
  addReply: (commentId: string, text: string) => void;
  toggleLikeComment: (commentId: string) => void;
  toggleHeartComment: (commentId: string) => void;
  togglePinComment: (commentId: string) => void;
  deleteComment: (commentId: string) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;

  // Community Posts
  communityPosts: CommunityPost[];
  addCommunityPost: (content: string, image?: string, pollQuestion?: string, pollOptions?: string[]) => void;
  votePoll: (postId: string, optionId: string) => void;
  toggleLikePost: (postId: string) => void;

  // Modals & Action overlays
  isUploadModalOpen: boolean;
  setUploadModalOpen: (open: boolean) => void;
  isShareModalOpen: boolean;
  setShareModalOpen: (open: boolean) => void;
  shareTargetVideo: Video | null;
  openShareModal: (video: Video) => void;
  isReportModalOpen: boolean;
  setReportModalOpen: (open: boolean) => void;
  reportTargetVideo: Video | null;
  openReportModal: (video: Video) => void;
  isAddToPlaylistModalOpen: boolean;
  setAddToPlaylistModalOpen: (open: boolean) => void;
  playlistTargetVideoId: string | null;
  openAddToPlaylistModal: (videoId: string) => void;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;

  // Admin & Reports
  reports: ReportItem[];
  submitReport: (targetId: string, type: 'video' | 'comment' | 'user', title: string, reason: ReportItem['reason'], details: string) => void;
  resolveReport: (reportId: string, resolution: 'resolved' | 'dismissed') => void;
  adminBanUser: (userId: string) => void;
  adminToggleVerifyUser: (userId: string) => void;
  adminChangeUserRole: (userId: string, role: User['role']) => void;
  categories: string[];
  addCategory: (categoryName: string) => void;
  removeCategory: (categoryName: string) => void;
}

const BulBulContext = createContext<BulBulContextType | undefined>(undefined);

export const BulBulProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('bulbul_theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('bulbul_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Sidebar toggle
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);

  // Navigation / View state
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>('vid_1');
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Authentication & Users
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('bulbul_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('bulbul_current_user_id');
    const found = allUsers.find(u => u.id === saved);
    return found || allUsers[0];
  });

  useEffect(() => {
    localStorage.setItem('bulbul_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('bulbul_current_user_id', currentUser.id);
  }, [currentUser]);

  const loginAs = (userId: string) => {
    const target = allUsers.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  const loginUser = (email: string, name: string) => {
    const existing = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
    } else {
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: name || email.split('@')[0],
        handle: `@${(name || email.split('@')[0]).toLowerCase().replace(/\s+/g, '')}`,
        email,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${name || email}`,
        banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
        bio: 'BulBul explorer and creator.',
        role: 'Creator',
        isVerified: false,
        subscribersCount: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        totalViews: 0
      };
      setAllUsers(prev => [newUser, ...prev]);
      setCurrentUser(newUser);
    }
    setAuthModalOpen(false);
  };

  const logoutUser = () => {
    loginAs('user_current');
  };

  const updateUserProfile = (updates: Partial<User>) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...updates };
      setAllUsers(all => all.map(u => u.id === prev.id ? updated : u));
      return updated;
    });
  };

  // Videos
  const [videos, setVideos] = useState<Video[]>(() => {
    const saved = localStorage.getItem('bulbul_videos');
    return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
  });

  useEffect(() => {
    localStorage.setItem('bulbul_videos', JSON.stringify(videos));
  }, [videos]);

  const featuredVideo = videos.find(v => v.featured && !v.isShort) || videos[0];

  const addVideo = (videoData: Omit<Video, 'id' | 'views' | 'likes' | 'dislikes' | 'uploadDate'>): Video => {
    const newVideo: Video = {
      ...videoData,
      id: `vid_${Date.now()}`,
      views: 0,
      likes: 0,
      dislikes: 0,
      uploadDate: 'Just now',
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      creatorHandle: currentUser.handle,
      creatorAvatar: currentUser.avatar,
      creatorVerified: currentUser.isVerified
    };

    setVideos(prev => [newVideo, ...prev]);
    
    // Add notification to own notifications
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: currentUser.id,
      type: 'video_upload',
      title: 'Video Uploaded Successfully!',
      message: `"${newVideo.title}" is now published on BulBul.`,
      thumbnail: newVideo.thumbnail,
      avatar: currentUser.avatar,
      timestamp: 'Just now',
      read: false,
      targetId: newVideo.id
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newVideo;
  };

  const updateVideo = (videoId: string, updates: Partial<Video>) => {
    setVideos(prev => prev.map(v => v.id === videoId ? { ...v, ...updates } : v));
  };

  const deleteVideo = (videoId: string) => {
    setVideos(prev => prev.filter(v => v.id !== videoId));
  };

  const incrementVideoViews = (videoId: string) => {
    setVideos(prev => prev.map(v => v.id === videoId ? { ...v, views: v.views + 1 } : v));
  };

  // Likes & Dislikes
  const [likedVideoIds, setLikedVideoIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('bulbul_liked_videos');
    return saved ? JSON.parse(saved) : ['vid_1', 'vid_2', 'short_1'];
  });

  const [dislikedVideoIds, setDislikedVideoIds] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem('bulbul_liked_videos', JSON.stringify(likedVideoIds));
  }, [likedVideoIds]);

  const toggleLikeVideo = (videoId: string) => {
    const isCurrentlyLiked = likedVideoIds.includes(videoId);
    if (isCurrentlyLiked) {
      setLikedVideoIds(prev => prev.filter(id => id !== videoId));
      setVideos(prev => prev.map(v => v.id === videoId ? { ...v, likes: Math.max(0, v.likes - 1) } : v));
    } else {
      setLikedVideoIds(prev => [...prev, videoId]);
      setDislikedVideoIds(prev => prev.filter(id => id !== videoId));
      setVideos(prev => prev.map(v => v.id === videoId ? { ...v, likes: v.likes + 1 } : v));
    }
  };

  const toggleDislikeVideo = (videoId: string) => {
    const isCurrentlyDisliked = dislikedVideoIds.includes(videoId);
    if (isCurrentlyDisliked) {
      setDislikedVideoIds(prev => prev.filter(id => id !== videoId));
      setVideos(prev => prev.map(v => v.id === videoId ? { ...v, dislikes: Math.max(0, v.dislikes - 1) } : v));
    } else {
      setDislikedVideoIds(prev => [...prev, videoId]);
      if (likedVideoIds.includes(videoId)) {
        setLikedVideoIds(prev => prev.filter(id => id !== videoId));
        setVideos(prev => prev.map(v => v.id === videoId ? { ...v, likes: Math.max(0, v.likes - 1), dislikes: v.dislikes + 1 } : v));
      } else {
        setVideos(prev => prev.map(v => v.id === videoId ? { ...v, dislikes: v.dislikes + 1 } : v));
      }
    }
  };

  // Subscriptions
  const [subscribedChannelIds, setSubscribedChannelIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('bulbul_subscriptions');
    return saved ? JSON.parse(saved) : ['creator_1', 'creator_2', 'creator_3'];
  });

  const [channelBellSettings, setChannelBellSettings] = useState<Record<string, BellNotificationSetting>>({
    'creator_1': 'all',
    'creator_2': 'personalized',
    'creator_3': 'all'
  });

  useEffect(() => {
    localStorage.setItem('bulbul_subscriptions', JSON.stringify(subscribedChannelIds));
  }, [subscribedChannelIds]);

  const toggleSubscribe = (channelId: string) => {
    const isSubbed = subscribedChannelIds.includes(channelId);
    if (isSubbed) {
      setSubscribedChannelIds(prev => prev.filter(id => id !== channelId));
      setAllUsers(prev => prev.map(u => u.id === channelId ? { ...u, subscribersCount: Math.max(0, u.subscribersCount - 1) } : u));
    } else {
      setSubscribedChannelIds(prev => [...prev, channelId]);
      setAllUsers(prev => prev.map(u => u.id === channelId ? { ...u, subscribersCount: u.subscribersCount + 1 } : u));
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#0D9488', '#06B6D4', '#F59E0B', '#10B981']
        });
      } catch {
        // confetti fallback safe
      }
    }
  };

  const setChannelBellSetting = (channelId: string, setting: BellNotificationSetting) => {
    setChannelBellSettings(prev => ({ ...prev, [channelId]: setting }));
  };

  const isSubscribed = (channelId: string) => subscribedChannelIds.includes(channelId);

  // Watch History & Watch Later
  const [watchHistory, setWatchHistory] = useState<{ videoId: string; watchedAt: string; progress: number }[]>(() => {
    const saved = localStorage.getItem('bulbul_history');
    return saved ? JSON.parse(saved) : [
      { videoId: 'vid_1', watchedAt: 'Today', progress: 85 },
      { videoId: 'vid_2', watchedAt: 'Yesterday', progress: 40 },
      { videoId: 'vid_3', watchedAt: '3 days ago', progress: 100 }
    ];
  });

  useEffect(() => {
    localStorage.setItem('bulbul_history', JSON.stringify(watchHistory));
  }, [watchHistory]);

  const addToHistory = (videoId: string, progress = 0) => {
    setWatchHistory(prev => {
      const filtered = prev.filter(item => item.videoId !== videoId);
      return [{ videoId, watchedAt: 'Just now', progress }, ...filtered];
    });
  };

  const removeFromHistory = (videoId: string) => {
    setWatchHistory(prev => prev.filter(item => item.videoId !== videoId));
  };

  const clearHistory = () => {
    setWatchHistory([]);
  };

  const [watchLaterVideoIds, setWatchLaterVideoIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('bulbul_watch_later');
    return saved ? JSON.parse(saved) : ['vid_3', 'vid_4'];
  });

  useEffect(() => {
    localStorage.setItem('bulbul_watch_later', JSON.stringify(watchLaterVideoIds));
  }, [watchLaterVideoIds]);

  const toggleWatchLater = (videoId: string) => {
    setWatchLaterVideoIds(prev => 
      prev.includes(videoId) ? prev.filter(id => id !== videoId) : [...prev, videoId]
    );
  };

  const isInWatchLater = (videoId: string) => watchLaterVideoIds.includes(videoId);

  // Playlists
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const saved = localStorage.getItem('bulbul_playlists');
    return saved ? JSON.parse(saved) : INITIAL_PLAYLISTS;
  });

  useEffect(() => {
    localStorage.setItem('bulbul_playlists', JSON.stringify(playlists));
  }, [playlists]);

  const [currentPlaylistQueue, setCurrentPlaylistQueue] = useState<string[]>([]);
  const [playlistQueueIndex, setPlaylistQueueIndex] = useState<number>(0);

  const createPlaylist = (title: string, description: string, isPrivate: boolean, initialVideoId?: string): Playlist => {
    const newPl: Playlist = {
      id: `pl_${Date.now()}`,
      userId: currentUser.id,
      title,
      description,
      isPrivate,
      videoIds: initialVideoId ? [initialVideoId] : [],
      thumbnail: initialVideoId 
        ? (videos.find(v => v.id === initialVideoId)?.thumbnail || 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=800&auto=format&fit=crop&q=80')
        : 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=800&auto=format&fit=crop&q=80',
      updatedDate: new Date().toISOString().split('T')[0]
    };
    setPlaylists(prev => [newPl, ...prev]);
    return newPl;
  };

  const addVideoToPlaylist = (playlistId: string, videoId: string) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        if (!p.videoIds.includes(videoId)) {
          return {
            ...p,
            videoIds: [...p.videoIds, videoId],
            updatedDate: new Date().toISOString().split('T')[0]
          };
        }
      }
      return p;
    }));
  };

  const removeVideoFromPlaylist = (playlistId: string, videoId: string) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        return {
          ...p,
          videoIds: p.videoIds.filter(id => id !== videoId),
          updatedDate: new Date().toISOString().split('T')[0]
        };
      }
      return p;
    }));
  };

  const deletePlaylist = (playlistId: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== playlistId));
  };

  const playNextInQueue = () => {
    if (currentPlaylistQueue.length > 0 && playlistQueueIndex < currentPlaylistQueue.length - 1) {
      const nextIndex = playlistQueueIndex + 1;
      setPlaylistQueueIndex(nextIndex);
      setSelectedVideoId(currentPlaylistQueue[nextIndex]);
    }
  };

  const playPreviousInQueue = () => {
    if (currentPlaylistQueue.length > 0 && playlistQueueIndex > 0) {
      const prevIndex = playlistQueueIndex - 1;
      setPlaylistQueueIndex(prevIndex);
      setSelectedVideoId(currentPlaylistQueue[prevIndex]);
    }
  };

  // Comments
  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('bulbul_comments');
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  useEffect(() => {
    localStorage.setItem('bulbul_comments', JSON.stringify(comments));
  }, [comments]);

  const addComment = (videoId: string, text: string) => {
    if (!text.trim()) return;
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      videoId,
      userId: currentUser.id,
      userName: currentUser.name,
      userHandle: currentUser.handle,
      userAvatar: currentUser.avatar,
      isCreator: currentUser.role === 'Creator',
      text,
      timestamp: 'Just now',
      likes: 0,
      replies: []
    };
    setComments(prev => [newComment, ...prev]);
  };

  const addReply = (commentId: string, text: string) => {
    if (!text.trim()) return;
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        const replies = c.replies || [];
        return {
          ...c,
          replies: [
            ...replies,
            {
              id: `reply_${Date.now()}`,
              commentId,
              userId: currentUser.id,
              userName: currentUser.name,
              userHandle: currentUser.handle,
              userAvatar: currentUser.avatar,
              isCreator: currentUser.role === 'Creator',
              text,
              timestamp: 'Just now',
              likes: 0
            }
          ]
        };
      }
      return c;
    }));
  };

  const toggleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        const isLiked = c.isLikedByUser;
        return {
          ...c,
          isLikedByUser: !isLiked,
          likes: isLiked ? Math.max(0, c.likes - 1) : c.likes + 1
        };
      }
      return c;
    }));
  };

  const toggleHeartComment = (commentId: string) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        return { ...c, isHeartedByCreator: !c.isHeartedByCreator };
      }
      return c;
    }));
  };

  const togglePinComment = (commentId: string) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        return { ...c, isPinned: !c.isPinned };
      }
      return c;
    }));
  };

  const deleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('bulbul_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('bulbul_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Community Posts
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);

  const addCommunityPost = (content: string, image?: string, pollQuestion?: string, pollOptions?: string[]) => {
    const newPost: CommunityPost = {
      id: `post_${Date.now()}`,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      creatorHandle: currentUser.handle,
      creatorAvatar: currentUser.avatar,
      content,
      timestamp: 'Just now',
      likes: 0,
      image,
      poll: pollQuestion && pollOptions && pollOptions.length > 0 ? {
        question: pollQuestion,
        options: pollOptions.filter(o => o.trim()).map((opt, i) => ({
          id: `opt_${i}`,
          text: opt,
          votes: 0
        })),
        totalVotes: 0
      } : undefined
    };
    setCommunityPosts(prev => [newPost, ...prev]);
  };

  const votePoll = (postId: string, optionId: string) => {
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId && p.poll && !p.poll.userVote) {
        return {
          ...p,
          poll: {
            ...p.poll,
            userVote: optionId,
            totalVotes: p.poll.totalVotes + 1,
            options: p.poll.options.map(opt => opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt)
          }
        };
      }
      return p;
    }));
  };

  const toggleLikePost = (postId: string) => {
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = p.isLiked;
        return {
          ...p,
          isLiked: !isLiked,
          likes: isLiked ? Math.max(0, p.likes - 1) : p.likes + 1
        };
      }
      return p;
    }));
  };

  // Modals state
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [shareTargetVideo, setShareTargetVideo] = useState<Video | null>(null);
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const [reportTargetVideo, setReportTargetVideo] = useState<Video | null>(null);
  const [isAddToPlaylistModalOpen, setAddToPlaylistModalOpen] = useState(false);
  const [playlistTargetVideoId, setPlaylistTargetVideoId] = useState<string | null>(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  const openShareModal = (video: Video) => {
    setShareTargetVideo(video);
    setShareModalOpen(true);
  };

  const openReportModal = (video: Video) => {
    setReportTargetVideo(video);
    setReportModalOpen(true);
  };

  const openAddToPlaylistModal = (videoId: string) => {
    setPlaylistTargetVideoId(videoId);
    setAddToPlaylistModalOpen(true);
  };

  // Reports & Admin
  const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS);
  const [categories, setCategories] = useState<string[]>(CATEGORIES);

  const submitReport = (
    targetId: string, 
    type: 'video' | 'comment' | 'user', 
    title: string, 
    reason: ReportItem['reason'], 
    details: string
  ) => {
    const newReport: ReportItem = {
      id: `rep_${Date.now()}`,
      targetId,
      type,
      targetTitle: title,
      reportedBy: currentUser.handle,
      reason,
      details,
      timestamp: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setReports(prev => [newReport, ...prev]);
    setReportModalOpen(false);
  };

  const resolveReport = (reportId: string, resolution: 'resolved' | 'dismissed' | 'dismiss' | 'remove_video') => {
    if (resolution === 'remove_video') {
      const rep = reports.find(r => r.id === reportId);
      if (rep) {
        deleteVideo(rep.targetId);
      }
    }
    const finalStatus: 'resolved' | 'dismissed' = (resolution === 'dismiss' || resolution === 'dismissed') ? 'dismissed' : 'resolved';
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: finalStatus } : r));
  };

  const adminBanUser = (userId: string) => {
    setAllUsers(prev => prev.filter(u => u.id !== userId));
    setVideos(prev => prev.filter(v => v.creatorId !== userId));
  };

  const adminToggleVerifyUser = (userId: string) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, isVerified: !u.isVerified } : u));
    setVideos(prev => prev.map(v => v.creatorId === userId ? { ...v, creatorVerified: !v.creatorVerified } : v));
  };

  const adminChangeUserRole = (userId: string, role: User['role']) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, role }));
    }
  };

  const addCategory = (categoryName: string) => {
    if (categoryName && !categories.includes(categoryName)) {
      setCategories(prev => [...prev, categoryName]);
    }
  };

  const removeCategory = (categoryName: string) => {
    setCategories(prev => prev.filter(c => c !== categoryName));
  };

  // Video Selection
  const selectedVideo = videos.find(v => v.id === selectedVideoId) || videos[0] || null;

  const selectVideo = (videoId: string, queue?: string[]) => {
    setSelectedVideoId(videoId);
    if (queue && queue.length > 0) {
      setCurrentPlaylistQueue(queue);
      const idx = queue.indexOf(videoId);
      setPlaylistQueueIndex(idx >= 0 ? idx : 0);
    }
    incrementVideoViews(videoId);
    addToHistory(videoId);
    setCurrentView('watch');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectChannel = (channelId: string) => {
    setSelectedChannelId(channelId);
    setCurrentView('channel');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectPlaylist = (playlistId: string) => {
    setSelectedPlaylistId(playlistId);
    setCurrentView('playlist-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentView('search');
  };

  return (
    <BulBulContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedVideoId,
        selectedVideo,
        selectVideo,
        selectedChannelId,
        selectChannel,
        selectedPlaylistId,
        selectPlaylist,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        triggerSearch,
        isDarkMode,
        toggleDarkMode,
        isSidebarCollapsed,
        toggleSidebar,
        currentUser,
        allUsers,
        loginAs,
        loginUser,
        logoutUser,
        updateUserProfile,
        videos,
        featuredVideo,
        addVideo,
        updateVideo,
        deleteVideo,
        incrementVideoViews,
        likedVideoIds,
        dislikedVideoIds,
        toggleLikeVideo,
        toggleDislikeVideo,
        subscribedChannelIds,
        channelBellSettings,
        toggleSubscribe,
        setChannelBellSetting,
        isSubscribed,
        watchHistory,
        addToHistory,
        removeFromHistory,
        clearHistory,
        watchLaterVideoIds,
        toggleWatchLater,
        isInWatchLater,
        playlists,
        createPlaylist,
        addVideoToPlaylist,
        removeVideoFromPlaylist,
        deletePlaylist,
        currentPlaylistQueue,
        playlistQueueIndex,
        playNextInQueue,
        playPreviousInQueue,
        comments,
        addComment,
        addReply,
        toggleLikeComment,
        toggleHeartComment,
        togglePinComment,
        deleteComment,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        communityPosts,
        addCommunityPost,
        votePoll,
        toggleLikePost,
        isUploadModalOpen,
        setUploadModalOpen,
        isShareModalOpen,
        setShareModalOpen,
        shareTargetVideo,
        openShareModal,
        isReportModalOpen,
        setReportModalOpen,
        reportTargetVideo,
        openReportModal,
        isAddToPlaylistModalOpen,
        setAddToPlaylistModalOpen,
        playlistTargetVideoId,
        openAddToPlaylistModal,
        isAuthModalOpen,
        setAuthModalOpen,
        reports,
        submitReport,
        resolveReport,
        adminBanUser,
        adminToggleVerifyUser,
        adminChangeUserRole,
        categories,
        addCategory,
        removeCategory
      }}
    >
      {children}
    </BulBulContext.Provider>
  );
};

export const useBulBul = () => {
  const context = useContext(BulBulContext);
  if (!context) {
    throw new Error('useBulBul must be used within a BulBulProvider');
  }
  return context;
};
