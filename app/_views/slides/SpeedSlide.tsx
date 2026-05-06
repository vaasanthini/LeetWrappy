'use client';

import { motion } from 'framer-motion';
import SlideWrapper from '@/app/_views/SlideWrapper';
import { WrappedReport } from '@/lib/models/report';

interface Props {
  report: WrappedReport;
  direction?: number;
}

const SPEED_CARDS = [
  {
    key: 'quick' as const,
    label: 'Quick Draw',
    sub: '< 10 minutes',
    emoji: '⚡',
    color: 'var(--accent)',
    border: 'var(--speed-quick-border)',
    bg: 'var(--speed-quick-bg)',
  },
  {
    key: 'steady' as const,
    label: 'Steady Solver',
    sub: '10 – 30 minutes',
    emoji: '🎯',
    color: 'var(--accent-sun)',
    border: 'var(--speed-steady-border)',
    bg: 'var(--speed-steady-bg)',
  },
  {
    key: 'deep' as const,
    label: 'Deep Thinker',
    sub: '> 30 minutes',
    emoji: '🔬',
    color: 'var(--accent-warm)',
    border: 'var(--speed-deep-border)',
    bg: 'var(--speed-deep-bg)',
  },
];

export default function SpeedSlide({ report, direction }: Props) {
  const { speedStats } = report;
  const total = speedStats.quick + speedStats.steady + speedStats.deep;
  const dominant = SPEED_CARDS.reduce((prev, cur) =>
    speedStats[cur.key] > speedStats[prev.key] ? cur : prev
  );

  return (
    <SlideWrapper gradient="slide-gradient-7" direction={direction}>
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 py-12 w-full max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-4xl font-black mb-2 font-display" style={{ color: 'var(--foreground)' }}>
            Problem-Solving Speed
          </h2>
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
            Estimated from submission timestamps · {total} tracked sessions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          {SPEED_CARDS.map((card, i) => {
            const count = speedStats[card.key];
            const isDominant = card.key === dominant.key && total > 0;
            return (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.12 }}
                className="flex flex-col items-center gap-3 rounded-2xl p-6 text-center"
                style={{
                  background: card.bg,
                  border: `${isDominant ? 2 : 1}px solid ${isDominant ? card.color : card.border}`,
                  boxShadow: isDominant ? `0 0 20px ${card.bg}` : 'none',
                }}
              >
                <span className="text-4xl">{card.emoji}</span>
                <div>
                  <p className="font-bold text-base" style={{ color: 'var(--foreground)' }}>
                    {card.label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: card.color }}>{card.sub}</p>
                </div>
                <div className="text-4xl font-black" style={{ color: card.color }}>{count}</div>
                {isDominant && total > 0 && (
                  <div className="px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background: card.color, color: 'var(--button-primary-text)' }}>
                    Your style!
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {speedStats.medianMinutes > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="glass-card px-8 py-4 text-center"
          >
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm">Median solve time</p>
            <p className="text-3xl font-black" style={{ color: 'var(--foreground)' }}>
              {speedStats.medianMinutes} min
            </p>
          </motion.div>
        )}

        {total === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="glass-card px-8 py-6 text-center"
          >
            <p className="font-semibold" style={{ color: 'var(--foreground)' }}>
              Not enough submission data
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Speed is estimated when you attempt a problem multiple times. Keep solving!
            </p>
          </motion.div>
        )}
      </div>
    </SlideWrapper>
  );
}
