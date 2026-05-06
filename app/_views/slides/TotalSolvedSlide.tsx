'use client';

import { motion } from 'framer-motion';
import SlideWrapper from '@/app/_views/SlideWrapper';
import { WrappedReport } from '@/lib/models/report';

interface Props {
  report: WrappedReport;
  direction?: number;
}

function CircleProgress({ pct, color }: { pct: number; color: string }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <svg width="128" height="128" viewBox="0 0 128 128">
      <circle cx="64" cy="64" r={r} fill="none" stroke="var(--surface-muted)" strokeWidth="8" />
      <motion.circle
        cx="64" cy="64" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
        transform="rotate(-90 64 64)"
      />
      <text x="64" y="64" textAnchor="middle" dominantBaseline="central" fill="var(--foreground)" fontSize="20" fontWeight="bold">
        {pct}%
      </text>
    </svg>
  );
}

function getRankPercentile(ranking: number): string {
  if (ranking <= 100) return 'top 0.01%';
  if (ranking <= 1000) return 'top 0.1%';
  if (ranking <= 5000) return 'top 0.5%';
  if (ranking <= 10000) return 'top 1%';
  if (ranking <= 50000) return 'top 5%';
  if (ranking <= 100000) return 'top 10%';
  if (ranking <= 500000) return 'top 25%';
  return 'top 50%';
}

export default function TotalSolvedSlide({ report, direction }: Props) {
  const { profile } = report;
  const { easySolved, mediumSolved, hardSolved, totalSolved, ranking, acceptanceRate } = profile;

  const bars = [
    { label: 'Easy', count: easySolved, color: 'var(--easy)', total: totalSolved },
    { label: 'Medium', count: mediumSolved, color: 'var(--medium)', total: totalSolved },
    { label: 'Hard', count: hardSolved, color: 'var(--hard)', total: totalSolved },
  ];

  return (
    <SlideWrapper gradient="slide-gradient-2" direction={direction}>
      <div className="relative z-10 flex flex-col items-center gap-10 px-8 py-12 w-full max-w-2xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black text-center font-display"
          style={{ color: 'var(--foreground)' }}
        >
          Your Problem Stats
        </motion.h2>

        <div className="flex flex-col sm:flex-row items-center gap-10 w-full">
          {/* Circle acceptance rate */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-2"
          >
            <CircleProgress pct={acceptanceRate} color="var(--accent)" />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Acceptance Rate</span>
          </motion.div>

          {/* Bars */}
          <div className="flex flex-col gap-5 flex-1 w-full">
            {bars.map((bar, i) => (
              <motion.div
                key={bar.label}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.15 }}
                className="flex flex-col gap-1.5"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold" style={{ color: bar.color }}>{bar.label}</span>
                  <span className="font-bold" style={{ color: 'var(--foreground)' }}>{bar.count.toLocaleString()}</span>
                </div>
                <div className="w-full h-3 rounded-full" style={{ background: 'var(--surface-muted)' }}>
                  <motion.div
                    className="h-3 rounded-full"
                    style={{ background: bar.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${bar.total > 0 ? (bar.count / bar.total) * 100 : 0}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.3 + i * 0.15 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Rank badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card px-8 py-4 text-center"
        >
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-1">Global Ranking</p>
          <p className="text-3xl font-black" style={{ color: 'var(--foreground)' }}>
            #{ranking.toLocaleString()}
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--accent-sun)' }}>
            You are in the {getRankPercentile(ranking)} of all LeetCode users
          </p>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}
