import React, { useState } from 'react';
import { 
  X, UploadCloud, Film, Image as ImageIcon, 
  Sparkles, CheckCircle2, Globe, Lock, EyeOff, Zap 
} from 'lucide-react';
import { useBulBul } from '../context/BulBulContext';
import { VideoVisibility } from '../types';

export const UploadModal: React.FC = () => {
  const {
    isUploadModalOpen,
    setUploadModalOpen,
    uploadVideo,
    categories,
    currentUser
  } = useBulBul();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[1] || 'Technology');
  const [tagsInput, setTagsInput] = useState('');
  const [visibility, setVisibility] = useState<VideoVisibility>('Public');
  const [isShort, setIsShort] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  if (!isUploadModalOpen) return null;

  // Preset sample videos for fast testing
  const sampleVideos = [
    { label: 'Wildlife Cinematic (Nature)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', thumb: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80', isShort: false },
    { label: 'Urban Sunset Timelapse', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', thumb: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80', isShort: false },
    { label: 'Vertical Coffee Art (Flit)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', thumb: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80', isShort: true },
    { label: 'Cyberpunk Drone (Flit)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', thumb: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80', isShort: true }
  ];

  const handleApplyPreset = (preset: typeof sampleVideos[0]) => {
    setVideoUrl(preset.url);
    setThumbnailUrl(preset.thumb);
    setIsShort(preset.isShort);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsUploading(true);

    setTimeout(() => {
      uploadVideo({
        title,
        description,
        thumbnail: thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        videoUrl: videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        duration: isShort ? 45 : 340,
        durationFormatted: isShort ? '0:45' : '5:40',
        views: 0,
        likes: 0,
        dislikes: 0,
        creatorId: currentUser.id,
        creatorName: currentUser.name,
        creatorAvatar: currentUser.avatar,
        creatorHandle: currentUser.handle,
        creatorVerified: currentUser.isVerified,
        category,
        tags: tagsInput.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean),
        isShort,
        visibility
      });

      setIsUploading(false);
      setUploadModalOpen(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-900 dark:text-white">Upload to BulBul</h2>
              <p className="text-xs text-slate-500">Publish video or vertical Flit (Short)</p>
            </div>
          </div>

          <button
            onClick={() => setUploadModalOpen(false)}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Sample Presets */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-500">Quick Test Media Presets:</label>
          <div className="grid grid-cols-2 gap-2">
            {sampleVideos.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(s)}
                className="p-2 text-left rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-slate-200 dark:border-slate-700 text-xs font-medium truncate transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Format Toggle (Regular Video vs Flit Short) */}
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Format:</span>
            <button
              type="button"
              onClick={() => setIsShort(false)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${!isShort ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs' : 'text-slate-500'}`}
            >
              <Film className="w-4 h-4" />
              <span>Standard (16:9)</span>
            </button>
            <button
              type="button"
              onClick={() => setIsShort(true)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${isShort ? 'bg-white dark:bg-slate-900 text-amber-500 shadow-xs' : 'text-slate-500'}`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Flit / Short (9:16)</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a catchy title that describes your video..."
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell viewers about your video, topics covered, links, timestamps..."
              className="w-full px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
              >
                {categories.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Visibility</label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as VideoVisibility)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="Public">Public (Anyone can search and watch)</option>
                <option value="Unlisted">Unlisted (Anyone with link)</option>
                <option value="Private">Private (Only you)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Thumbnail Image URL (Optional)
            </label>
            <input
              type="text"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Video Source File URL (MP4 / WebM)
            </label>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://commondatastorage.googleapis.com/..."
              className="w-full px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="ai, technology, cinematography, tutorial"
              className="w-full px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setUploadModalOpen(false)}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isUploading || !title.trim()}
              className="px-7 py-2.5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 disabled:opacity-50 text-white font-bold text-xs md:text-sm shadow-md shadow-teal-500/25 flex items-center gap-2"
            >
              {isUploading ? (
                <span>Publishing to BulBul...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish Video</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
