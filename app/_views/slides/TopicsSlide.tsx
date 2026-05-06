'use client';

import { motion } from 'framer-motion';
import SlideWrapper from '@/app/_views/SlideWrapper';
import { WrappedReport } from '@/lib/models/report';

interface Props {
  report: WrappedReport;
  direction?: number;
}

function TopicBar({ name, count, max, color, delay }: {
  name: string; count: number; max: number; color: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex flex-col gap-1"
    >
      <div className="flex justify-between text-sm">
        <span className="font-medium truncate max-w-[140px]" style={{ color: 'var(--foreground)' }}>
          {name}
        </span>
        <span style={{ color }} className="font-bold">{count}</span>
      </div>
      <div className="w-full h-2 rounded-full" style={{ background: 'var(--surface-muted)' }}>
        <motion.div
          className="h-2 rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${max > 0 ? (count / max) * 100 : 0}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay }}
        />
      </div>
    </motion.div>
  );
}

export default function TopicsSlide({ report, direction }: Props) {
  const { strongestTopics, weakestTopics } = report;

  const strongMax = strongestTopics[0]?.count ?? 1;
  const weakMax = weakestTopics[weakestTopics.length - 1]?.count ?? 1;

  return (
    <SlideWrapper gradient="slide-gradient-5" direction={direction}>
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 py-12 w-full max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-4xl font-black font-display" style={{ color: 'var(--foreground)' }}>
            Where You Shine vs. Where to Grow
          </h2>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            All-time problem counts by topic
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
          {/* Strongest */}
          <div className="glass-card p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💪</span>
              <h3 className="text-lg font-bold" style={{ color: 'var(--accent)' }}>Strongest Topics</h3>
            </div>
            <div className="flex flex-col gap-4">
              {strongestTopics.map((t, i) => (
                <TopicBar
                  key={t.name}
                  name={t.name}
                  count={t.count}
                  max={strongMax}
                  color="var(--accent)"
                  delay={0.2 + i * 0.1}
                />
              ))}
              {strongestTopics.length === 0 && (
                <p style={{ color: 'var(--text-secondary)' }} className="text-sm">No data yet — keep grinding!</p>
              )}
            </div>
          </div>

          {/* Weakest */}
          <div className="glass-card p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📈</span>
              <h3 className="text-lg font-bold" style={{ color: 'var(--accent-rose)' }}>Growth Areas</h3>
            </div>
            <div className="flex flex-col gap-4">
              {weakestTopics.map((t, i) => (
                <TopicBar
                  key={t.name}
                  name={t.name}
                  count={t.count}
                  max={weakMax}
                  color="var(--accent-rose)"
                  delay={0.3 + i * 0.1}
                />
              ))}
              {weakestTopics.length === 0 && (
                <p style={{ color: 'var(--text-secondary)' }} className="text-sm">Practice more topics to see growth areas!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </SlideWrapper>
  );
}
