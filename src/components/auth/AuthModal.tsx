'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  redirectMessage?: string;
}

export function AuthModal({ isOpen, onClose, onSuccess, redirectMessage }: Props) {
  const [mode, setMode] = useState<'choice' | 'email'>('choice');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.href },
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleEmail = async () => {
    setLoading(true);
    setError(null);
    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      if (isSignUp) {
        setSuccess(true);
      } else {
        onSuccess();
      }
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto rounded-3xl p-8"
            style={{ background: '#12122A', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-xl transition-colors hover:text-white"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              ✕
            </button>

            {success ? (
              <div className="text-center py-4">
                <p className="text-4xl mb-4">📧</p>
                <h3 className="text-xl font-black text-white mb-2">Check your email</h3>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  We sent a confirmation link to {email}
                </p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-black text-white mb-1">
                    {isSignUp ? 'Create your account' : 'Welcome back'}
                  </h3>
                  {redirectMessage && (
                    <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {redirectMessage}
                    </p>
                  )}
                </div>

                {mode === 'choice' ? (
                  <div className="space-y-3">
                    {/* Google */}
                    <button
                      onClick={handleGoogle}
                      disabled={loading}
                      className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-3 transition-all hover:scale-105"
                      style={{ background: '#1A1A35', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
                    >
                      <span>🔵</span> Continue with Google
                    </button>

                    {/* Email */}
                    <button
                      onClick={() => setMode('email')}
                      className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-3 transition-all hover:scale-105"
                      style={{ background: '#1A1A35', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
                    >
                      <span>✉️</span> Continue with Email
                    </button>

                    <div className="text-center pt-2">
                      <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-xs transition-colors hover:text-white"
                        style={{ color: 'rgba(255,255,255,0.4)' }}
                      >
                        {isSignUp
                          ? 'Already have an account? Sign in'
                          : "Don't have an account? Sign up"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-white outline-none text-sm"
                      style={{
                        background: '#0A0A1A',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#FFFFFF',
                      }}
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleEmail()}
                      className="w-full px-4 py-3 rounded-xl text-white outline-none text-sm"
                      style={{
                        background: '#0A0A1A',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#FFFFFF',
                      }}
                    />
                    {error && (
                      <p className="text-xs text-red-400">{error}</p>
                    )}
                    <button
                      onClick={handleEmail}
                      disabled={loading || !email || !password}
                      className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 disabled:opacity-50"
                      style={{ background: 'linear-gradient(135deg, #00D4FF, #00FFB2)', color: '#0A0A1A' }}
                    >
                      {loading ? '...' : isSignUp ? 'Create account' : 'Sign in'}
                    </button>
                    <button
                      onClick={() => setMode('choice')}
                      className="w-full text-xs transition-colors hover:text-white"
                      style={{ color: 'rgba(255,255,255,0.4)' }}
                    >
                      ← Back
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
