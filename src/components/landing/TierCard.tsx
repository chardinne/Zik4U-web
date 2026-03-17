'use client';

import { motion } from 'framer-motion';
import type { CreatorTier } from '@/types';

interface Props {
  tier: CreatorTier;
  index: number;
  creatorId: string;
  creatorName: string;
  onSubscribe: (tier: CreatorTier) => void;
  isPopular?: boolean;
}

export function TierCard({ tier, index, onSubscribe, isPopular }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative rounded-2xl p-6 flex flex-col"
      style={{
        background: isPopular
          ? 'linear-gradient(135deg, rgba(255,60,172,0.15), rgba(123,47,255,0.1))'
          : '#12122A',
        border: isPopular
          ? '1px solid rgba(255,60,172,0.4)'
          : '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Popular badge */}
      {isPopular && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1 rounded-full text-white"
          style={{ background: 'linear-gradient(135deg, #FF3CAC, #7B2FFF)' }}
        >
          ⭐ Most popular
        </div>
      )}

      {/* Tier name + price */}
      <div className="mb-4">
        <p
          className="text-xs font-bold tracking-widest uppercase mb-1"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          {tier.name}
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black text-white">
            ${tier.priceWeb.toFixed(2)}
          </span>
          <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>/month</span>
        </div>
      </div>

      {/* Description */}
      {tier.description && (
        <p className="text-sm mb-4 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {tier.description}
        </p>
      )}

      {/* Perks */}
      <ul className="flex-1 space-y-2 mb-6">
        {tier.perks.map((perk, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-white">
            <span className="mt-0.5 flex-shrink-0" style={{ color: '#00FFB2' }}>✓</span>
            <span>{perk}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={() => onSubscribe(tier)}
        className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95"
        style={
          isPopular
            ? { background: 'linear-gradient(135deg, #FF3CAC, #7B2FFF)', color: '#fff' }
            : { background: 'transparent', color: '#00D4FF', border: '1px solid rgba(0,212,255,0.35)' }
        }
      >
        Subscribe for ${tier.priceWeb.toFixed(2)}/mo →
      </button>
    </motion.div>
  );
}
