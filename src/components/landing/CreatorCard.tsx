'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { SearchResult } from '@/types';

interface Props {
  creator: SearchResult;
  index: number;
}

export function CreatorCard({ creator, index }: Props) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={() => router.push(`/creator/${creator.username}`)}
      className="cursor-pointer rounded-2xl p-4 md:p-5 transition-all hover:scale-105"
      style={{
        background: '#12122A',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
      whileHover={{
        borderColor: 'rgba(0,212,255,0.3)',
        boxShadow: '0 0 30px rgba(0,212,255,0.1)',
      }}
    >
      {/* Avatar + name */}
      <div className="flex items-center gap-3 mb-3 md:mb-4">
        <div
          className="w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg font-black flex-shrink-0 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #FF3CAC, #7B2FFF)' }}
        >
          {creator.avatarUrl ? (
            <Image
              src={creator.avatarUrl}
              alt={creator.displayName}
              width={48}
              height={48}
              className="rounded-full object-cover w-full h-full"
            />
          ) : (
            creator.displayName.charAt(0).toUpperCase()
          )}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-white truncate text-sm md:text-base">{creator.displayName}</p>
          <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>
            @{creator.username}
          </p>
        </div>
        <div
          className="ml-auto text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0"
          style={{ background: 'rgba(255,60,172,0.15)', color: '#FF3CAC' }}
        >
          CREATOR
        </div>
      </div>

      {/* Top artists — 2 on mobile, 3 on desktop */}
      {creator.topArtists.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3 md:mb-4">
          {/* Mobile: first 2 */}
          {creator.topArtists.slice(0, 2).map((artist) => (
            <span
              key={artist}
              className="text-xs px-2 py-1 rounded-full md:hidden"
              style={{ background: 'rgba(0,212,255,0.1)', color: '#00D4FF' }}
            >
              🎵 {artist}
            </span>
          ))}
          {/* Desktop: all 3 */}
          {creator.topArtists.slice(0, 3).map((artist) => (
            <span
              key={`d-${artist}`}
              className="text-xs px-2 py-1 rounded-full hidden md:inline-block"
              style={{ background: 'rgba(0,212,255,0.1)', color: '#00D4FF' }}
            >
              🎵 {artist}
            </span>
          ))}
        </div>
      )}

      {/* Price + CTA — min 44px tap target */}
      <div className="flex items-center justify-between mt-1">
        {creator.minTierPrice !== null ? (
          <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            From{' '}
            <span className="text-white font-bold">
              ${creator.minTierPrice}/mo
            </span>
          </span>
        ) : (
          <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Free to follow
          </span>
        )}
        <span
          className="text-xs font-bold px-3 rounded-full flex items-center"
          style={{
            background: 'linear-gradient(135deg, #00D4FF, #00FFB2)',
            color: '#0A0A1A',
            minHeight: '44px',
          }}
        >
          View profile →
        </span>
      </div>
    </motion.div>
  );
}
