import React, { useState } from 'react';
import { 
  X, Copy, Check, Share2, Code, 
  Send, Twitter, MessageCircle, Mail 
} from 'lucide-react';
import { useBulBul } from '../context/BulBulContext';

export const ShareModal: React.FC = () => {
  const { isShareModalOpen, shareTargetVideo, closeShareModal } = useBulBul();
  const [copied, setCopied] = useState(false);
  const [startAt, setStartAt] = useState(false);
  const [timestampSeconds, setTimestampSeconds] = useState('0:30');
  const [activeTab, setActiveTab] = useState<'link' | 'embed'>('link');

  if (!isShareModalOpen || !shareTargetVideo) return null;

  const baseUrl = `https://bulbul.app/watch?v=${shareTargetVideo.id}`;
  const shareUrl = startAt ? `${baseUrl}&t=${timestampSeconds}` : baseUrl;
  const embedCode = `<iframe width="560" height="315" src="${shareTargetVideo.videoUrl}" title="${shareTargetVideo.title}" frameborder="0" allowfullscreen></iframe>`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socials = [
    { name: 'X / Twitter', color: 'bg-black text-white', icon: Twitter, url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Watch "${shareTargetVideo.title}" on BulBul`)}&url=${encodeURIComponent(shareUrl)}` },
    { name: 'WhatsApp', color: 'bg-emerald-600 text-white', icon: MessageCircle, url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`Watch "${shareTargetVideo.title}" on BulBul: ${shareUrl}`)}` },
    { name: 'Telegram', color: 'bg-cyan-500 text-white', icon: Send, url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTargetVideo.title)}` },
    { name: 'Email', color: 'bg-slate-700 text-white', icon: Mail, url: `mailto:?subject=${encodeURIComponent(shareTargetVideo.title)}&body=${encodeURIComponent(shareUrl)}` }
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-teal-500" />
            <h3 className="font-bold text-slate-900 dark:text-white">Share Video</h3>
          </div>
          <button onClick={closeShareModal} className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video preview mini */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
          <img src={shareTargetVideo.thumbnail} alt="" referrerPolicy="no-referrer" className="w-16 aspect-video rounded-lg object-cover shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="font-bold text-xs text-slate-900 dark:text-white truncate">{shareTargetVideo.title}</div>
            <div className="text-[10px] text-slate-400">By {shareTargetVideo.creatorName}</div>
          </div>
        </div>

        {/* Social Share Grid */}
        <div className="grid grid-cols-4 gap-3">
          {socials.map((s) => {
            const Icon = s.icon;
            return (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${s.color} shadow-sm`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 truncate max-w-full">{s.name}</span>
              </a>
            );
          })}
        </div>

        {/* Share Link Copy */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <input
              type="text"
              readOnly
              value={activeTab === 'link' ? shareUrl : embedCode}
              className="flex-1 bg-transparent text-xs text-slate-800 dark:text-slate-200 focus:outline-none px-2 font-mono"
            />
            <button
              onClick={() => handleCopy(activeTab === 'link' ? shareUrl : embedCode)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={startAt}
                onChange={(e) => setStartAt(e.target.checked)}
                className="rounded text-teal-500"
              />
              <span>Start at timestamp</span>
            </label>

            {startAt && (
              <input
                type="text"
                value={timestampSeconds}
                onChange={(e) => setTimestampSeconds(e.target.value)}
                className="w-16 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-center font-mono border border-slate-200 dark:border-slate-700"
              />
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
