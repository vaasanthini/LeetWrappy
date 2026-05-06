'use client';

import { motion } from 'framer-motion';
import SlideWrapper from '@/app/_views/SlideWrapper';
import { WrappedReport } from '@/lib/models/report';

interface Props {
  report: WrappedReport;
  direction?: number;
}

const ARCHETYPE_ACCENTS: Record<string, string> = {
  'DP Wizard': '#7e6bb3',
  'Tree Climber': '#4f8f6a',
  'Graph Explorer': '#4c7ea9',
  'Array Artisan': '#c88f3c',
  'Hash Map Hero': '#b35c5c',
  'Binary Search Sniper': '#4f9c93',
  'Pointer Puppeteer': '#9a6bb1',
  'Bit Tinkerer': '#4f8f6a',
  'Backtrack Artist': '#c76d4a',
  'Stack Master': '#4f9c93',
};

export default function ArchetypeSlide({ report, direction }: Props) {
  const { archetype, profile, contest } = report;
  const accent = ARCHETYPE_ACCENTS[archetype.archetype] ?? '#6b8fab';
  const bg = `radial-gradient(ellipse at center, ${accent}33 0%, var(--background) 70%)`;

  return (
    <SlideWrapper direction={direction}>
      {/* Custom background */}
      <div className="absolute inset-0" style={{ background: bg }} />

      <div className="relative z-10 flex flex-col items-center gap-8 px-8 py-12 text-center max-w-xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sm font-semibold tracking-widest uppercase"
          style={{ color: 'var(--text-secondary)' }}
        >
          You are a...
        </motion.p>

        {/* Big emoji */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 180 }}
          className="float-anim text-9xl select-none"
        >
          {archetype.emoji}
        </motion.div>

        {/* Archetype name */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-5xl font-black leading-tight font-display"
          style={{ color: 'var(--foreground)' }}
        >
          {archetype.archetype}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-lg leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {archetype.description}
        </motion.p>

        {/* Contest stats if available */}
        {contest && contest.attendedContestsCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex gap-6"
          >
            {[
              { label: 'Contest Rating', value: contest.rating },
              { label: 'Contests', value: contest.attendedContestsCount },
              { label: 'Top', value: `${contest.topPercentage?.toFixed(1)}%` },
            ].map((stat) => (
              <div key={stat.label} className="glass-card px-4 py-3 text-center">
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
                <p className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{stat.value}</p>
              </div>
            ))}
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="text-sm"
          style={{ color: 'var(--text-secondary)' }}
        >
          @{profile.username} · Leetwrappy {report.year}
        </motion.p>
      </div>
    </SlideWrapper>
  );
}
