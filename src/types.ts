export type VideoQuality = '1080p' | '720p' | '480p' | '360p' | 'Auto';
export type VideoVisibility = 'Public' | 'Unlisted' | 'Private';
export type UserRole = 'User' | 'Creator' | 'Admin' | 'Moderator';
export type BellNotificationSetting = 'all' | 'personalized' | 'none';

export interface User {
  id: string;
  name: string;
  handle: string;
  email: string;
  avatar: string;
  banner?: string;
  bio?: string;
  role: UserRole;
  isVerified?: boolean;
  subscribersCount: number;
  joinedDate: string;
  totalViews?: number;
  socialLinks?: {
    website?: string;
    twitter?: string;
    github?: string;
  };
}

export interface Chapter {
  title: string;
  time: number; // in seconds
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: number; // in seconds
  durationFormatted: string;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  creatorVerified?: boolean;
  views: number;
  likes: number;
  dislikes: number;
  uploadDate: string;
  category: string;
  tags: string[];
  isShort?: boolean;
  visibility: VideoVisibility;
  featured?: boolean;
  chapters?: Chapter[];
  transcript?: { time: string; text: string }[];
  audioTrackName?: string;
}

export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userHandle: string;
  isCreator?: boolean;
  text: string;
  timestamp: string;
  likes: number;
  isLikedByUser?: boolean;
  isDislikedByUser?: boolean;
  isHeartedByCreator?: boolean;
  isPinned?: boolean;
  replies?: CommentReply[];
}

export interface CommentReply {
  id: string;
  commentId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userHandle: string;
  isCreator?: boolean;
  text: string;
  timestamp: string;
  likes: number;
  isLikedByUser?: boolean;
}

export interface Playlist {
  id: string;
  userId: string;
  title: string;
  description: string;
  videoIds: string[];
  thumbnail: string;
  isPrivate: boolean;
  updatedDate: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'video_upload' | 'comment_reply' | 'subscriber' | 'like' | 'mention' | 'system';
  title: string;
  message: string;
  avatar?: string;
  timestamp: string;
  read: boolean;
  targetId?: string; // videoId or channelId
  thumbnail?: string;
}

export interface ReportItem {
  id: string;
  type: 'video' | 'comment' | 'user';
  targetId: string;
  targetTitle: string;
  reportedBy: string;
  reason: 'spam' | 'harassment' | 'copyright' | 'misinformation' | 'inappropriate' | 'other';
  details: string;
  timestamp: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface CommunityPost {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  creatorHandle: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  poll?: {
    question: string;
    options: { id: string; text: string; votes: number }[];
    totalVotes: number;
    userVote?: string;
  };
  image?: string;
}

export type AppView = 
  | 'home'
  | 'shorts'
  | 'watch'
  | 'subscriptions'
  | 'library'
  | 'history'
  | 'watch-later'
  | 'liked'
  | 'playlists'
  | 'playlist-detail'
  | 'channel'
  | 'studio'
  | 'admin'
  | 'trending'
  | 'category'
  | 'search';
