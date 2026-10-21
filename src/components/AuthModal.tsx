import React, { useState } from 'react';
import { User, Mail, Lock, Sparkles, Cloud, CheckCircle, ArrowRight, X, Shield, Star, Keyboard, Image } from 'lucide-react';
import { StorageService } from '../utils/storage';
import { UserAccount } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [stylePreference, setStylePreference] = useState<'cyberpunk' | 'minimalist' | 'mechanical'>('cyberpunk');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid email address');
        return;
      }
      if (!name.trim()) {
        setError('Please enter your designer display name');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        const user = StorageService.register(name, email, username || name.toLowerCase().replace(/\s+/g, ''));
        setLoading(false);
        onLoginSuccess(user);
        onClose();
      }, 500);
    } else {
      if (!email.trim()) {
        setError('Please enter your email or username');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        const user = StorageService.login(email);
        setLoading(false);
        onLoginSuccess(user);
        onClose();
      }, 450);
    }
  };

  const handleGuestContinue = () => {
    StorageService.markAuthPrompted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative glowing background accent */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-neutral-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 via-neutral-800 to-cyan-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-wider text-amber-400 uppercase">korme.com Studio</span>
                <span className="text-neutral-500 text-xs">·</span>
                <span className="text-xs text-neutral-400">Personalized Workspace</span>
              </div>
              <h2 className="text-xl font-bold text-neutral-100 mt-0.5">
                {mode === 'register' ? 'Create Your Personalized Account' : 'Welcome Back to korme.com'}
              </h2>
            </div>
          </div>
          <button
            onClick={handleGuestContinue}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors"
            title="Explore as guest"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Value Prop Banner */}
        <div className="px-6 py-3 bg-neutral-950/60 border-b border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-cyan-400" />
            <span>Cloud-based project sync enabled</span>
          </div>
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-amber-400" />
            <span>25+ Typography Styles</span>
          </div>
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-rose-400" />
            <span>4K Wallpaper Renders</span>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="px-6 pt-4">
          <div className="grid grid-cols-2 p-1 bg-neutral-950 rounded-lg border border-neutral-800">
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              className={`py-2 text-xs font-medium rounded-md transition-all ${
                mode === 'register'
                  ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Register New Account
            </button>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`py-2 text-xs font-medium rounded-md transition-all ${
                mode === 'login'
                  ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 py-4 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg text-xs text-rose-300">
              {error}
            </div>
          )}

          {mode === 'register' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Display Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="e.g. Elena Rostova"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/80"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-neutral-500">@</span>
                    <input
                      type="text"
                      placeholder="creator_handle"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/80"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/80"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/80"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  Design Interest & Workspace Preset
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'cyberpunk', label: 'Cyberpunk & Sci-Fi' },
                    { id: 'minimalist', label: 'Minimalist & Clean' },
                    { id: 'mechanical', label: 'Custom Keyboards' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setStylePreference(item.id as typeof stylePreference)}
                      className={`px-2.5 py-2 text-xs rounded-lg border text-left transition-colors ${
                        stylePreference === item.id
                          ? 'border-amber-500/80 bg-amber-500/10 text-amber-200'
                          : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="name@example.com or @handle"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/80"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/80"
                  />
                </div>
              </div>

              {/* Demo quick accounts */}
              <div className="pt-2">
                <span className="text-[11px] text-neutral-500 block mb-1.5">Or quick sign in as demo creator:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('kenji@korme.com');
                      setName('Kenji Sato');
                      setUsername('kenji_sato');
                    }}
                    className="flex-1 px-2.5 py-1.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-xs text-neutral-300 text-left"
                  >
                    @kenji_sato (Cyberpunk)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('elena@korme.com');
                      setName('Elena Rostova');
                      setUsername('elena_design');
                    }}
                    className="flex-1 px-2.5 py-1.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-xs text-neutral-300 text-left"
                  >
                    @elena_design (Minimalist)
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-semibold text-sm rounded-lg shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Syncing Cloud Account...</span>
              ) : mode === 'register' ? (
                <>
                  <span>Create Account & Start Designing</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Sign In to Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-neutral-500" />
            <span>Secure personalized cloud saves</span>
          </div>
          <button
            type="button"
            onClick={handleGuestContinue}
            className="text-neutral-400 hover:text-neutral-200 underline decoration-neutral-600 underline-offset-2"
          >
            Continue as Guest for now
          </button>
        </div>
      </div>
    </div>
  );
};
