'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { searchCreators, getFeaturedCreators } from '@/lib/creators';
import type { SearchResult } from '@/types';

const APP_STORE_URL = 'https://apps.apple.com/app/zik4u/id6748722257';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.zik4u.app';

const WHAT_YOU_GET = [
  { emoji: '📡', text: "Real-time listening feed. What they play. For real." },
  { emoji: '🎵', text: "Exclusive Drops: tracks they share only with subscribers" },
  { emoji: '🎯', text: "Music compatibility score between you and your creator" },
  { emoji: '🃏', text: "Fan Card: shareable proof you're part of their world" },
];

export default function FansPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [creators, setCreators] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    getFeaturedCreators()
      .then(setCreators)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      getFeaturedCreators().then(setCreators);
      return;
    }
    const t = setTimeout(() => {
      setSearching(true);
      searchCreators(query)
        .then(setCreators)
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#0A0A1A',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#fff',
    }}>

      {/* Nav */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 32px',
        maxWidth: 1100,
        margin: '0 auto',
      }}>
        <button
          onClick={() => router.push('/')}
          style={{
            border: 'none',
            fontSize: 20,
            fontWeight: 900,
            letterSpacing: '0.2em',
            background: 'linear-gradient(90deg, #00D4FF, #00FFB2, #FF3CAC)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            cursor: 'pointer',
          }}
        >
          ZIK4U
        </button>
        <button
          onClick={() => router.push('/creators')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 14,
            color: 'rgba(255,255,255,0.4)',
            cursor: 'pointer',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
        >
          Are you a creator? →
        </button>
      </nav>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '40px 24px 120px' }}>

        {/* BLOC 1 — Hero */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 64 }}
        >
          <p style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.15em',
            color: '#00FFB2',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}>
            For Fans
          </p>
          <h1 style={{
            fontSize: 'clamp(40px, 6vw, 76px)',
            fontWeight: 900,
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            marginBottom: 24,
          }}>
            Your favorite creator
            <br />
            <span style={{
              background: 'linear-gradient(90deg, #00FFB2, #00D4FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              is on Zik4U.
            </span>
          </h1>
          <p style={{
            fontSize: 20,
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.7,
            maxWidth: 480,
          }}>
            See what they listen to.{' '}
            <span style={{ color: '#00FFB2', fontWeight: 700 }}>For real.</span>
            {' '}Before anyone else.
          </p>
        </motion.div>

        {/* BLOC 2 — Recherche */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ marginBottom: 48 }}
        >
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search a creator by name..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '20px 24px',
                background: '#12122A',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
                fontSize: 17,
                color: '#fff',
                fontFamily: 'Inter, system-ui, sans-serif',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
            {searching && (
              <div style={{
                position: 'absolute',
                right: 20,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 18,
                height: 18,
                border: '2px solid rgba(0,212,255,0.3)',
                borderTopColor: '#00D4FF',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
            )}
          </div>
        </motion.div>

        {/* BLOC 3 — Résultats */}
        <div style={{ marginBottom: 100 }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{
                  height: 80,
                  background: '#12122A',
                  borderRadius: 16,
                  opacity: 0.4,
                }} />
              ))}
            </div>
          ) : creators.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '40px 0' }}>
              No creator found for &ldquo;{query}&rdquo;
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {creators.map((creator, i) => (
                <motion.div
                  key={creator.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  onClick={() => router.push(`/creator/${creator.username}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '20px 24px',
                    background: '#12122A',
                    borderRadius: 16,
                    cursor: 'pointer',
                    border: '1px solid rgba(255,255,255,0.04)',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,212,255,0.2)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)')}
                >
                  {creator.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={creator.avatarUrl}
                      alt={creator.displayName}
                      width={48}
                      height={48}
                      style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    />
                  ) : (
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #FF3CAC, #7B2FFF)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      flexShrink: 0,
                    }}>
                      🎵
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: '#fff',
                      margin: 0,
                      marginBottom: 4,
                    }}>
                      {creator.displayName}
                    </p>
                    {creator.topArtists.length > 0 && (
                      <p style={{
                        fontSize: 13,
                        color: 'rgba(255,255,255,0.35)',
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {creator.topArtists.slice(0, 3).join(' · ')}
                      </p>
                    )}
                  </div>
                  {creator.isFeatured && (
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#fff',
                      background: 'linear-gradient(135deg, #FF3CAC, #7B2FFF)',
                      padding: '3px 10px',
                      borderRadius: 999,
                      flexShrink: 0,
                    }}>
                      ✦ Featured
                    </span>
                  )}
                  <span style={{
                    fontSize: 18,
                    color: 'rgba(255,255,255,0.2)',
                    flexShrink: 0,
                  }}>
                    →
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* BLOC 4 — Ce que tu obtiens */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 100 }}
        >
          <h2 style={{
            fontSize: 'clamp(24px, 3.5vw, 40px)',
            fontWeight: 900,
            marginBottom: 40,
            letterSpacing: '-0.02em',
          }}>
            When you subscribe, you get:
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {WHAT_YOU_GET.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}
              >
                <span style={{ fontSize: 24, minWidth: 32 }}>{item.emoji}</span>
                <p style={{
                  fontSize: 17,
                  color: 'rgba(255,255,255,0.65)',
                  lineHeight: 1.5,
                  margin: 0,
                }}>
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* BLOC 5 — CTA download */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center' }}
        >
          <h2 style={{
            fontSize: 'clamp(24px, 3.5vw, 40px)',
            fontWeight: 900,
            marginBottom: 12,
            letterSpacing: '-0.02em',
          }}>
            Subscribe on web.
            <br />
            <span style={{
              background: 'linear-gradient(90deg, #00FFB2, #00D4FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Listen on the app.
            </span>
          </h2>
          <p style={{
            fontSize: 16,
            color: 'rgba(255,255,255,0.4)',
            marginBottom: 40,
          }}>
            Download Zik4U. Free, always.
          </p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            maxWidth: 320,
            margin: '0 auto',
          }}>
            <a
              href={APP_STORE_URL}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                padding: '18px 32px',
                background: '#fff',
                borderRadius: 16,
                textDecoration: 'none',
                fontSize: 16,
                fontWeight: 700,
                color: '#0A0A1A',
              }}
            >
              <span style={{ fontSize: 22 }}>🍎</span>
              Download on App Store
            </a>
            <a
              href={PLAY_STORE_URL}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                padding: '18px 32px',
                background: 'linear-gradient(135deg, #00D4FF, #00FFB2)',
                borderRadius: 16,
                textDecoration: 'none',
                fontSize: 16,
                fontWeight: 700,
                color: '#0A0A1A',
              }}
            >
              <span style={{ fontSize: 22 }}>▶</span>
              Get it on Google Play
            </a>
          </div>
        </motion.div>

      </div>

      <style>{`
        @keyframes spin {
          to { transform: translateY(-50%) rotate(360deg); }
        }
      `}</style>

    </main>
  );
}
