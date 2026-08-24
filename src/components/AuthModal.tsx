import React, { useState } from 'react';
import { 
  X, User, Mail, Shield, CheckCircle2, 
  Sparkles, Lock, ArrowRight, UserCheck 
} from 'lucide-react';
import { useBulBul } from '../context/BulBulContext';
import { UserRole } from '../types';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setAuthModalOpen,
    currentUser,
    allUsers,
    switchUser,
    registerUser
  } = useBulBul();

  const [mode, setMode] = useState<'switch' | 'register'>('switch');
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Creator');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80');

  if (!isAuthModalOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !handle.trim()) return;
    registerUser({
      name,
      handle: handle.startsWith('@') ? handle : `@${handle}`,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@bulbul.com`,
      avatar,
      role
    });
    setAuthModalOpen(false);
  };

  const presetAvatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">
              {mode === 'switch' ? 'Switch Account / Persona' : 'Create BulBul Account'}
            </h2>
            <p className="text-xs text-slate-500">
              {mode === 'switch' ? 'Experience BulBul as Creator, Viewer, or Admin' : 'Join BulBul as a new Creator or Viewer'}
            </p>
          </div>

          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1">
          <button
            onClick={() => setMode('switch')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'switch' ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs' : 'text-slate-500'}`}
          >
            Switch Profile
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'register' ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs' : 'text-slate-500'}`}
          >
            New Account
          </button>
        </div>

        {mode === 'switch' ? (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {allUsers.map((user) => {
              const isActive = currentUser.id === user.id;
              return (
                <div
                  key={user.id}
                  onClick={() => {
                    switchUser(user.id);
                    setAuthModalOpen(false);
                  }}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    isActive 
                      ? 'bg-teal-500/10 border-teal-500 ring-1 ring-teal-500' 
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1">
                        <span>{user.name}</span>
                        {user.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />}
                      </div>
                      <div className="text-[11px] text-slate-400">{user.handle}</div>
                      <div className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">{user.role} Role</div>
                    </div>
                  </div>

                  {isActive ? (
                    <span className="px-2 py-1 rounded-full bg-teal-500 text-white text-[10px] font-bold">Active</span>
                  ) : (
                    <span className="text-xs text-slate-400">Select →</span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Select Avatar</label>
              <div className="flex gap-2">
                {presetAvatars.map((av, idx) => (
                  <img
                    key={idx}
                    src={av}
                    alt=""
                    referrerPolicy="no-referrer"
                    onClick={() => setAvatar(av)}
                    className={`w-10 h-10 rounded-full object-cover cursor-pointer border-2 transition-all ${avatar === av ? 'border-teal-500 scale-110' : 'border-transparent opacity-70'}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Handle (@username)</label>
              <input
                type="text"
                required
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@alexmorgan"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
              >
                <option value="Creator">Creator (Publish videos & studio access)</option>
                <option value="Viewer">Viewer (Watch, like, comment, subscribe)</option>
                <option value="Admin">Admin (Moderation & platform tools)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-xs shadow-md"
            >
              Create Account
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
