'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import SlideWrapper from '@/app/_views/SlideWrapper';
import { WrappedReport } from '@/lib/models/report';

interface Props {
  report: WrappedReport;
  direction?: number;
}

function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

export default function HeroSlide({ report, direction }: Props) {
  const { profile, year } = report;
  const displayCount = useCountUp(profile.totalSolved);

  return (
    <SlideWrapper gradient="slide-gradient-1" direction={direction}>
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(var(--hero-grid) 1px, transparent 1px), linear-gradient(90deg, var(--hero-grid) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 px-8 text-center">
        {/* Year badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-4 py-1.5 rounded-full text-sm font-semibold border"
          style={{ color: 'var(--accent)', borderColor: 'var(--accent-border)', background: 'var(--accent-soft)' }}
        >
          {year} · Leetwrappy
        </motion.div>

        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="float-anim"
        >
          <div className="glow-ring rounded-full p-1" style={{ background: 'var(--accent-soft)' }}>
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.username}
                
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-4xl"
                style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
              >
                {profile.username[0]?.toUpperCase()}
              </div>
            )}
          </div>
        </motion.div>

        {/* Username */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-2"
        >
          {profile.realName && (
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>{profile.realName}</p>
          )}
          <h1 className="text-5xl font-black font-display" style={{ color: 'var(--foreground)' }}>
            @{profile.username}
          </h1>
        </motion.div>

        {/* Big number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 150 }}
          className="flex flex-col items-center"
        >
          <span className="text-8xl font-black gradient-text">{displayCount}</span>
          <span className="text-xl mt-1" style={{ color: 'var(--text-secondary)' }}>problems solved</span>
        </motion.div>

        {/* Stat pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {[
            { label: `Rank #${profile.ranking.toLocaleString()}`, color: 'var(--accent-sun)' },
            { label: `${profile.streak} day streak`, color: 'var(--accent)' },
            { label: `${profile.acceptanceRate}% acceptance`, color: 'var(--accent-warm)' },
          ].map((pill) => (
            <div
              key={pill.label}
              className="px-5 py-2.5 rounded-full font-semibold text-sm glass-card"
              style={{ color: pill.color }}
            >
              {pill.label}
            </div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-base"
          style={{ color: 'var(--text-secondary)' }}
        >
          Swipe → to see your full year in review
        </motion.p>
      </div>
    </SlideWrapper>
  );
}
