import React, { useState } from 'react';
import { 
  ThumbsUp, ThumbsDown, Heart, Pin, Reply, 
  MoreVertical, Trash2, CheckCircle2, MessageSquare, 
  Smile, Send, ChevronDown, ChevronUp 
} from 'lucide-react';
import { Comment } from '../types';
import { useBulBul } from '../context/BulBulContext';

interface CommentSectionProps {
  videoId: string;
  creatorId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ videoId, creatorId }) => {
  const {
    comments,
    addComment,
    addReply,
    toggleLikeComment,
    toggleHeartComment,
    togglePinComment,
    deleteComment,
    currentUser,
    selectChannel
  } = useBulBul();

  const [newCommentText, setNewCommentText] = useState('');
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sortBy, setSortBy] = useState<'top' | 'newest'>('top');
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

  // Filter video comments
  const videoComments = comments.filter(c => c.videoId === videoId);

  // Sort comments
  const sortedComments = [...videoComments].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    if (sortBy === 'top') return b.likes - a.likes;
    return b.id.localeCompare(a.id);
  });

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    addComment(videoId, newCommentText);
    setNewCommentText('');
  };

  const handlePostReply = (commentId: string) => {
    if (!replyText.trim()) return;
    addReply(commentId, replyText);
    setReplyText('');
    setReplyingCommentId(null);
    setExpandedReplies(prev => ({ ...prev, [commentId]: true }));
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const isVideoCreator = currentUser.id === creatorId || currentUser.role === 'Admin';

  const quickEmojis = ['🔥', '🚀', '❤️', '👏', '🧠', '✨', '💯'];

  return (
    <div id="bulbul-comments-section" className="space-y-6 pt-4">
      {/* Comments Header & Sorting */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-teal-500" />
            <span>{videoComments.length} Comments</span>
          </h3>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-slate-400">Sort by:</span>
          <button
            onClick={() => setSortBy('top')}
            className={`px-3 py-1 rounded-full transition-colors ${sortBy === 'top' ? 'bg-teal-500/20 text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            Top Comments
          </button>
          <button
            onClick={() => setSortBy('newest')}
            className={`px-3 py-1 rounded-full transition-colors ${sortBy === 'newest' ? 'bg-teal-500/20 text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            Newest First
          </button>
        </div>
      </div>

      {/* Add New Comment Box */}
      <form onSubmit={handlePostComment} className="flex gap-3 items-start">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          referrerPolicy="no-referrer"
          className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
        />
        
        <div className="flex-1 space-y-2">
          <textarea
            id="comment-input-field"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Add a public comment or thought..."
            rows={2}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 resize-none transition-all"
          />

          {newCommentText.length > 0 && (
            <div className="flex items-center justify-between animate-in fade-in duration-150">
              {/* Quick Emojis */}
              <div className="flex items-center gap-1">
                {quickEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setNewCommentText(prev => prev + emoji)}
                    className="p-1 hover:scale-125 transition-transform text-sm"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setNewCommentText('')}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="px-4 py-1.5 rounded-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-bold shadow-xs shadow-teal-500/30 flex items-center gap-1.5 transition-all"
                >
                  <Send className="w-3 h-3" />
                  <span>Comment</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800/60">
        {sortedComments.map((comment) => (
          <div key={comment.id} className="pt-4 first:pt-0 space-y-2 group">
            {/* Pinned label if pinned */}
            {comment.isPinned && (
              <div className="flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 font-semibold mb-1">
                <Pin className="w-3.5 h-3.5 fill-current" />
                <span>Pinned by creator</span>
              </div>
            )}

            <div className="flex gap-3">
              <img
                src={comment.userAvatar}
                alt={comment.userName}
                referrerPolicy="no-referrer"
                onClick={() => selectChannel(comment.userId)}
                className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0 cursor-pointer hover:ring-2 hover:ring-teal-500/40 transition-all"
              />

              <div className="flex-1 min-w-0">
                {/* User Header */}
                <div className="flex items-center gap-2">
                  <span 
                    onClick={() => selectChannel(comment.userId)}
                    className="font-semibold text-xs text-slate-900 dark:text-white cursor-pointer hover:underline flex items-center gap-1"
                  >
                    {comment.userName}
                    {comment.isCreator && (
                      <span className="px-1.5 py-0.2 rounded-sm bg-teal-500 text-white text-[9px] font-bold">
                        Creator
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {comment.timestamp}
                  </span>
                </div>

                {/* Comment Text */}
                <p className="text-sm text-slate-800 dark:text-slate-200 mt-1 whitespace-pre-wrap leading-relaxed">
                  {comment.text}
                </p>

                {/* Comment Actions */}
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {/* Like Button */}
                  <button
                    onClick={() => toggleLikeComment(comment.id)}
                    className={`flex items-center gap-1 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${comment.isLikedByUser ? 'text-teal-600 dark:text-teal-400 font-bold' : ''}`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${comment.isLikedByUser ? 'fill-current' : ''}`} />
                    <span>{comment.likes > 0 ? comment.likes : ''}</span>
                  </button>

                  <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Creator Heart */}
                  {comment.isHeartedByCreator && (
                    <span 
                      title="Hearted by creator"
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 text-[10px] font-bold"
                    >
                      <Heart className="w-3 h-3 fill-current" />
                      <span>Creator Heart</span>
                    </span>
                  )}

                  {/* Reply Button */}
                  <button
                    onClick={() => setReplyingCommentId(replyingCommentId === comment.id ? null : comment.id)}
                    className="flex items-center gap-1 font-semibold hover:text-slate-900 dark:hover:text-white"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </button>

                  {/* Creator Controls (Heart, Pin, Delete) */}
                  {isVideoCreator && (
                    <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => toggleHeartComment(comment.id)}
                        title="Give creator heart"
                        className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      >
                        <Heart className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => togglePinComment(comment.id)}
                        title="Pin/Unpin comment"
                        className="p-1 rounded text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-950/40"
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteComment(comment.id)}
                        title="Delete comment"
                        className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Inline Reply Input */}
                {replyingCommentId === comment.id && (
                  <div className="mt-3 flex gap-2 items-start pl-2 border-l-2 border-teal-500/40 animate-in fade-in duration-150">
                    <img
                      src={currentUser.avatar}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Reply to ${comment.userName}...`}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-teal-500"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setReplyingCommentId(null)}
                          className="px-2.5 py-1 text-xs text-slate-500"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handlePostReply(comment.id)}
                          disabled={!replyText.trim()}
                          className="px-3 py-1 rounded-full bg-teal-600 text-white text-xs font-bold disabled:opacity-50"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Nested Replies List */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3">
                    <button
                      onClick={() => toggleReplies(comment.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                    >
                      {expandedReplies[comment.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      <span>{comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}</span>
                    </button>

                    {expandedReplies[comment.id] && (
                      <div className="mt-2 pl-4 space-y-3 border-l-2 border-slate-200 dark:border-slate-800">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-2.5">
                            <img
                              src={reply.userAvatar}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="w-7 h-7 rounded-full object-cover shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-1">
                                  {reply.userName}
                                  {reply.isCreator && (
                                    <span className="px-1 py-0.2 rounded bg-teal-500 text-white text-[8px] font-bold">Creator</span>
                                  )}
                                </span>
                                <span className="text-[10px] text-slate-400">{reply.timestamp}</span>
                              </div>
                              <p className="text-xs text-slate-800 dark:text-slate-200 mt-0.5">
                                {reply.text}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
