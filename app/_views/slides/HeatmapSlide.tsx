'use client';

import { motion } from 'framer-motion';
import SlideWrapper from '@/app/_views/SlideWrapper';
import { WrappedReport } from '@/lib/models/report';

interface Props {
  report: WrappedReport;
  direction?: number;
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = ['S','M','T','W','T','F','S'];

function getColor(value: number, max: number): string {
  if (value === 0) return 'var(--heatmap-0)';
  const intensity = value / max;
  if (intensity < 0.25) return 'var(--heatmap-1)';
  if (intensity < 0.5) return 'var(--heatmap-2)';
  if (intensity < 0.75) return 'var(--heatmap-3)';
  return 'var(--heatmap-4)';
}

export default function HeatmapSlide({ report, direction }: Props) {
  const { heatmapData, profile, year } = report;

  // Build a map for quick lookup
  const dataMap: Record<string, number> = {};
  let max = 0;
  for (const d of heatmapData) {
    dataMap[d.day] = d.value;
    if (d.value > max) max = d.value;
  }

  // Build 52 weeks x 7 days grid for the selected year
  const startDate = new Date(`${year}-01-01`);
  const startDow = startDate.getDay(); // 0=Sun
  const weeks: Array<Array<{ day: string; value: number } | null>> = [];

  // Pad start
  let current: Array<{ day: string; value: number } | null> = [];
  for (let i = 0; i < startDow; i++) current.push(null);

  const endDate = new Date(`${year}-12-31`);
  const d = new Date(startDate);
  while (d <= endDate) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const key = `${yyyy}-${mm}-${dd}`;
    current.push({ day: key, value: dataMap[key] ?? 0 });
    if (current.length === 7) {
      weeks.push(current);
      current = [];
    }
    d.setDate(d.getDate() + 1);
  }
  if (current.length > 0) {
    while (current.length < 7) current.push(null);
    weeks.push(current);
  }

  // Month label positions: find first week index where month changes
  const monthLabels: Array<{ label: string; col: number }> = [];
  let lastMonth = -1;
  for (let w = 0; w < weeks.length; w++) {
    const firstCell = weeks[w].find(c => c !== null);
    if (firstCell) {
      const month = new Date(firstCell.day).getMonth();
      if (month !== lastMonth) {
        monthLabels.push({ label: MONTHS[month], col: w });
        lastMonth = month;
      }
    }
  }

  const CELL = 12;
  const GAP = 2;

  return (
    <SlideWrapper gradient="slide-gradient-4" direction={direction}>
      <div className="relative z-10 flex flex-col items-center gap-8 px-4 py-12 w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-4xl font-black mb-2 font-display" style={{ color: 'var(--foreground)' }}>
            Your Coding Heatmap
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>Every square is a day you showed up</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="overflow-x-auto w-full"
        >
          <div style={{ minWidth: weeks.length * (CELL + GAP) + 30 }}>
            {/* Month labels */}
            <div className="flex ml-8 mb-1" style={{ gap: 0 }}>
              {weeks.map((_, wi) => {
                const lbl = monthLabels.find(m => m.col === wi);
                return (
                  <div key={wi} style={{ width: CELL + GAP, fontSize: 9, color: 'var(--text-secondary)' }}>
                    {lbl?.label ?? ''}
                  </div>
                );
              })}
            </div>

            <div className="flex">
              {/* Day labels */}
              <div className="flex flex-col mr-1" style={{ gap: GAP }}>
                {DAYS.map((d, i) => (
                  <div key={i} style={{ height: CELL, fontSize: 9, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
                    {i % 2 === 1 ? d : ''}
                  </div>
                ))}
              </div>

              {/* Grid */}
              <div className="flex" style={{ gap: GAP }}>
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
                    {week.map((cell, di) => (
                      <div
                        key={di}
                        title={cell ? `${cell.day}: ${cell.value} submissions` : ''}
                        style={{
                          width: CELL,
                          height: CELL,
                          borderRadius: 2,
                          background: cell ? getColor(cell.value, max) : 'transparent',
                          cursor: cell ? 'default' : 'default',
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-6"
        >
          {[
            { label: 'Active Days', value: report.profile.streak > 0 ? `${report.profile.maxStreak} max` : '—', sub: `${heatmapData.filter(d => d.value > 0 && d.day.startsWith(String(year))).length} this year` },
            { label: 'Current Streak', value: `${profile.streak} days`, sub: '' },
            { label: 'Best Day', value: `${max} submissions`, sub: '' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card px-6 py-3 text-center">
              <p className="text-xs mb-0.5" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
              <p className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{stat.value}</p>
              {stat.sub && <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{stat.sub}</p>}
            </div>
          ))}
        </motion.div>
      </div>
    </SlideWrapper>
  );
}
