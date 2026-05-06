'use client';

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import SlideWrapper from '@/app/_views/SlideWrapper';
import { WrappedReport } from '@/lib/models/report';

interface Props {
  report: WrappedReport;
  direction?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card px-3 py-2 text-sm">
        <p className="font-bold" style={{ color: 'var(--foreground)' }}>{label}</p>
        <p style={{ color: 'var(--accent)' }}>{payload[0].value} solved</p>
      </div>
    );
  }
  return null;
};

export default function MonthlyGraphSlide({ report, direction }: Props) {
  const { monthlyData, bestMonth } = report;

  return (
    <SlideWrapper gradient="slide-gradient-3" direction={direction}>
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 py-12 w-full max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-4xl font-black mb-2 font-display" style={{ color: 'var(--foreground)' }}>
            Monthly Activity
          </h2>
          <p style={{ color: 'var(--text-secondary)' }} className="text-base">
            Your best month was{' '}
            <span style={{ color: 'var(--accent-sun)' }} className="font-bold">
              {bestMonth.month}
            </span>{' '}
            with {bestMonth.count} submissions!
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            Counts all submissions including retries
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="month"
                tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--surface-muted)' }} />
              <Bar dataKey="total" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={800}>
                {monthlyData.map((entry) => (
                  <Cell
                    key={entry.month}
                    fill={entry.month === bestMonth.month.slice(0, 3) ? 'var(--accent-sun)' : 'var(--accent)'}
                    opacity={entry.total === 0 ? 0.2 : 0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-6 text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ background: 'var(--accent-sun)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Best month</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ background: 'var(--accent)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Other months</span>
          </div>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}
