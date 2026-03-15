'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CreatorCard } from '@/components/landing/CreatorCard';
import { searchCreators, getFeaturedCreators } from '@/lib/creators';
import type { SearchResult } from '@/types';

export default function UsersPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [creators, setCreators] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    getFeaturedCreators()
      .then(setCreators)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      getFeaturedCreators().then(setCreators).catch(console.error);
      return;
    }
    const timer = setTimeout(() => {
      setSearching(true);
      searchCreators(query)
        .then(setCreators)
        .catch(console.error)
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#0A0A1A' }}>

      {/* Header */}
      <header
        className="flex items-center justify-between px-6 md:px-8 py-4 md:py-6"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <button
          onClick={() => router.push('/')}
          className="text-xl font-black tracking-widest gradient-text"
        >
          ZIK4U
        </button>
        <button
          onClick={() => router.push('/creators')}
          className="text-sm transition-colors"
          style={{ color: 'rgba(255,255,255,0.4)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
        >
          Are you a creator? →
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-4 md:px-6">

        {/* Hero — compact on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 md:mb-12 pt-8 md:pt-12"
        >
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: '#00D4FF' }}
          >
            For listeners
          </p>
          <h1 className="text-3xl md:text-6xl font-black mb-3 md:mb-4">
            Find creators who{' '}
            <span className="gradient-text">listen like you</span>
          </h1>
          {/* Subtitle hidden on mobile */}
          <p className="hidden md:block text-lg max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Search by artist, genre or name. Subscribe to their world.
            Hear what moves them.
          </p>
        </motion.div>

        {/* Search bar — sticky on mobile */}
        <div
          className="sticky top-0 z-10 py-3 -mx-4 md:mx-0 px-4 md:px-0 mb-6 md:mb-10"
          style={{ background: 'rgba(10,10,26,0.95)', backdropFilter: 'blur(12px)' }}
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="text-lg" style={{ color: 'rgba(255,255,255,0.4)' }}>🔍</span>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by artist, creator name..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-white outline-none transition-all text-base md:text-lg"
              style={{
                background: '#12122A',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#FFFFFF',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(0,212,255,0.5)';
                e.target.style.boxShadow = '0 0 20px rgba(0,212,255,0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                e.target.style.boxShadow = 'none';
              }}
            />
            {searching && (
              <div className="absolute inset-y-0 right-4 flex items-center">
                <div
                  className="w-5 h-5 rounded-full border-2 animate-spin"
                  style={{ borderColor: '#00D4FF', borderTopColor: 'transparent' }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Section title */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <p
            className="text-xs md:text-sm font-semibold uppercase tracking-widest"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            {query.trim() ? `Results for "${query}"` : '🔥 Featured creators'}
          </p>
          {creators.length > 0 && (
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {creators.length} creator{creators.length > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl animate-pulse"
                style={{ background: '#12122A', height: 140 }}
              />
            ))}
          </div>
        ) : creators.length === 0 ? (
          <div className="text-center py-16 md:py-20">
            <p className="text-4xl mb-4">🎵</p>
            <p className="text-white font-bold text-xl mb-2">No creators found</p>
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {creators.map((creator, index) => (
              <CreatorCard key={creator.id} creator={creator} index={index} />
            ))}
          </div>
        )}

        {/* CTA download app */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 md:mt-20 mb-10 text-center rounded-3xl p-6 md:p-10"
          style={{ background: '#12122A', border: '1px solid rgba(0,212,255,0.1)' }}
        >
          <p className="text-xl md:text-2xl font-black text-white mb-2">
            Get the full experience
          </p>
          <p className="mb-6 text-sm md:text-base" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Real-time listening data, Now Cards, Wrapped — all on mobile.
          </p>
          {/* Mobile: single button */}
          <div
            className="md:hidden px-6 py-3 rounded-full font-bold text-sm cursor-pointer inline-block"
            style={{ background: 'linear-gradient(135deg, #00D4FF, #00FFB2)', color: '#0A0A1A', minHeight: '44px', lineHeight: '22px' }}
          >
            📱 Download the app
          </div>
          {/* Desktop: two buttons */}
          <div className="hidden md:flex items-center justify-center gap-4">
            <div
              className="px-6 py-3 rounded-full font-bold text-sm cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #00D4FF, #00FFB2)', color: '#0A0A1A' }}
            >
              📱 Download on iOS
            </div>
            <div
              className="px-6 py-3 rounded-full font-bold text-white text-sm cursor-pointer"
              style={{ background: '#1A1A35', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              🤖 Get on Android
            </div>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
