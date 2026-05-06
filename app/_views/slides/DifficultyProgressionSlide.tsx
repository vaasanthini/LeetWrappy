'use client';

import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import SlideWrapper from '@/app/_views/SlideWrapper';
import { WrappedReport } from '@/lib/models/report';

interface Props {
  report: WrappedReport;
  direction?: number;
}

const DIFFICULTY_LABELS: Record<number, string> = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };
const DIFFICULTY_COLORS: Record<number, string> = { 1: 'var(--easy)', 2: 'var(--medium)', 3: 'var(--hard)' };

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  const color = DIFFICULTY_COLORS[payload.difficulty] ?? 'var(--foreground)';
  return <circle cx={cx} cy={cy} r={4} fill={color} stroke="none" />;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const d = payload[0].payload;
    return (
      <div className="glass-card px-3 py-2 text-xs max-w-[180px]">
        <p className="font-bold truncate" style={{ color: 'var(--foreground)' }}>{d.title}</p>
        <p style={{ color: DIFFICULTY_COLORS[d.difficulty] }}>{DIFFICULTY_LABELS[d.difficulty]}</p>
        <p style={{ color: 'var(--text-secondary)' }}>{d.date}</p>
      </div>
    );
  }
  return null;
};

export default function DifficultyProgressionSlide({ report, direction }: Props) {
  const { difficultyProgression } = report;

  // Sample down to at most 50 points for readability
  const step = Math.max(1, Math.floor(difficultyProgression.length / 50));
  const data = difficultyProgression.filter((_, i) => i % step === 0).slice(0, 60);

  const hasHard = data.some(d => d.difficulty === 3);
  const hasMedium = data.some(d => d.difficulty === 2);

  if (data.length < 3) {
    return (
      <SlideWrapper gradient="slide-gradient-6" direction={direction}>
        <div className="z-10 flex flex-col items-center gap-6 px-8 text-center">
          <h2 className="text-4xl font-black font-display" style={{ color: 'var(--foreground)' }}>
            Difficulty Progression
          </h2>
          <div className="glass-card p-8 max-w-sm">
            <span className="text-5xl">🌱</span>
            <p className="mt-4 text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
              Just Getting Started!
            </p>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Solve more problems and come back to see your difficulty progression curve.
            </p>
          </div>
        </div>
      </SlideWrapper>
    );
  }

  return (
    <SlideWrapper gradient="slide-gradient-6" direction={direction}>
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 py-12 w-full max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-4xl font-black mb-2 font-display" style={{ color: 'var(--foreground)' }}>
            Difficulty Progression
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            {hasHard
              ? '🔥 You\'re tackling Hard problems!'
              : hasMedium
              ? '⚡ Crushing Mediums — Hards are next!'
              : '🌱 Building the foundation with Easies'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full h-64"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="date"
                tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => v.slice(5)}
                interval={Math.floor(data.length / 6)}
              />
              <YAxis
                domain={[0.5, 3.5]}
                ticks={[1, 2, 3]}
                tickFormatter={(v) => DIFFICULTY_LABELS[v] ?? ''}
                tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <ReferenceLine y={1} stroke="var(--grid-easy)" strokeDasharray="4 4" />
              <ReferenceLine y={2} stroke="var(--grid-medium)" strokeDasharray="4 4" />
              <ReferenceLine y={3} stroke="var(--grid-hard)" strokeDasharray="4 4" />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="difficulty"
                stroke="var(--accent)"
                strokeWidth={2}
                dot={<CustomDot />}
                activeDot={{ r: 6, fill: 'var(--foreground)' }}
                isAnimationActive
                animationDuration={1200}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-6 text-sm"
        >
          {Object.entries(DIFFICULTY_LABELS).map(([k, v]) => (
            <div key={k} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: DIFFICULTY_COLORS[Number(k)] }} />
              <span style={{ color: 'var(--text-secondary)' }}>{v}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </SlideWrapper>
  );
}
