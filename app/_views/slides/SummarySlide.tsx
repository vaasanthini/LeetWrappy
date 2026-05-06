'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import SlideWrapper from '@/app/_views/SlideWrapper';
import { WrappedReport } from '@/lib/models/report';

interface Props {
  report: WrappedReport;
  direction?: number;
  onReset: () => void;
}

const CONFETTI_COLORS = ['#00b8a3', '#ffc01e', '#ff375f', '#a78bfa', '#34d399', '#fb923c'];

function Confetti() {
  const pieces = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2}s`,
    duration: `${2.5 + Math.random() * 2}s`,
    size: `${8 + Math.random() * 8}px`,
    rotate: Math.random() > 0.5 ? 'rotate(45deg)' : 'rotate(0deg)',
  }));

  return (
    <>
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDuration: p.duration,
            animationDelay: p.delay,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
            transform: p.rotate,
          }}
        />
      ))}
    </>
  );
}

export default function SummarySlide({ report, direction, onReset }: Props) {
  const { profile, bestMonth, archetype, year } = report;
  const cardRef = useRef<HTMLDivElement>(null);
  const [copying, setCopying] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const t = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(t);
  }, []);

  async function handleDownload() {
    const { default: html2canvas } = await import('html2canvas');
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, { backgroundColor: getComputedStyle(document.body).backgroundColor, scale: 2 });
    const link = document.createElement('a');
    link.download = `leetwrappy-${profile.username}-${year}.png`;
    link.href = canvas.toDataURL();
    link.click();
  }

  function handleTwitter() {
    const text = encodeURIComponent(
      `My #LeetCode ${year} Wrapped: ${profile.totalSolved} problems solved, ${profile.streak} day streak, and I'm a ${archetype.archetype} ${archetype.emoji}\n\nCheck yours at leetwrappy.vercel.app`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  }

  function handleLinkedIn() {
    const url = encodeURIComponent(`https://leetwrappy.vercel.app`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  }

  const stats = [
    { label: 'Total Solved', value: profile.totalSolved.toLocaleString(), color: 'var(--accent)' },
    { label: 'Acceptance Rate', value: `${profile.acceptanceRate}%`, color: 'var(--accent-sun)' },
    { label: 'Best Month', value: bestMonth.month, color: 'var(--accent-warm)' },
    { label: 'Longest Streak', value: `${profile.maxStreak}d`, color: 'var(--easy)' },
    { label: 'Archetype', value: `${archetype.emoji} ${archetype.archetype}`, color: 'var(--accent-rose)' },
    { label: 'Global Rank', value: `#${profile.ranking.toLocaleString()}`, color: 'var(--accent-warm)' },
  ];

  return (
    <SlideWrapper gradient="slide-gradient-8" direction={direction}>
      {showConfetti && <Confetti />}

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 py-12 w-full max-w-2xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black text-center font-display"
          style={{ color: 'var(--foreground)' }}
        >
          {year} by the Numbers 🎉
        </motion.h2>

        {/* Shareable card */}
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full rounded-2xl p-6"
          style={{ background: 'var(--card)', border: '1px solid var(--line)' }}
        >
          <div className="flex items-center gap-3 mb-5">
            {profile.avatar && (
              <img src={profile.avatar} alt={profile.username} className="w-10 h-10 rounded-full" />
            )}
            <div>
              <p className="font-bold" style={{ color: 'var(--foreground)' }}>
                @{profile.username}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Leetwrappy {year}
              </p>
            </div>
            <div className="ml-auto text-2xl">{archetype.emoji}</div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="rounded-xl p-3"
                style={{ background: 'var(--card-muted)', border: '1px solid var(--line)' }}
              >
                <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
                <p className="font-bold text-sm" style={{ color: stat.color }}>{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <p className="text-xs mt-4 text-center" style={{ color: 'var(--text-secondary)' }}>
            leetwrappy.vercel.app
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <button
            onClick={handleDownload}
            className="px-5 py-2.5 rounded-full font-semibold text-sm transition-opacity hover:opacity-80"
            style={{ background: 'var(--button-primary-bg)', color: 'var(--button-primary-text)' }}
          >
            📥 Download Image
          </button>
          <button
            onClick={handleTwitter}
            className="px-5 py-2.5 rounded-full font-semibold text-sm text-white transition-opacity hover:opacity-80"
            style={{ background: '#1d9bf0' }}
          >
            𝕏 Share on X
          </button>
          <button
            onClick={handleLinkedIn}
            className="px-5 py-2.5 rounded-full font-semibold text-sm text-white transition-opacity hover:opacity-80"
            style={{ background: '#0077b5' }}
          >
            in Share on LinkedIn
          </button>
          <button
            onClick={onReset}
            className="px-5 py-2.5 rounded-full font-semibold text-sm transition-colors"
            style={{ background: 'var(--chip-bg)', color: 'var(--text-secondary)' }}
          >
            ↩ Try Another User
          </button>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}
