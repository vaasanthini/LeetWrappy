'use client';

import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { WrappedReport } from '@/lib/models/report';

interface Props {
  report1: WrappedReport;
  report2: WrappedReport;
}

function UserCard({ report }: { report: WrappedReport }) {
  return (
    <div className="glass-card p-5 flex flex-col items-center gap-3 text-center">
      {report.profile.avatar ? (
        <img src={report.profile.avatar} alt={report.profile.username} className="w-16 h-16 rounded-full" />
      ) : (
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
          style={{ background: 'var(--chip-bg)', color: 'var(--accent)' }}
        >
          {report.profile.username[0]?.toUpperCase()}
        </div>
      )}
      <div>
        <p className="font-bold" style={{ color: 'var(--foreground)' }}>@{report.profile.username}</p>
        <p className="text-sm" style={{ color: 'var(--accent)' }}>{report.archetype.emoji} {report.archetype.archetype}</p>
      </div>
    </div>
  );
}

interface CompareRowProps {
  label: string;
  v1: string | number;
  v2: string | number;
  higher?: 'v1' | 'v2' | 'none';
}

function CompareRow({ label, v1, v2, higher }: CompareRowProps) {
  return (
    <div
      className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-3"
      style={{ borderBottom: '1px solid var(--line)' }}
    >
      <div className="text-right flex items-center justify-end gap-1">
        {higher === 'v1' && <Trophy size={14} style={{ color: 'var(--accent-sun)' }} />}
        <span
          className="font-semibold text-sm"
          style={{ color: higher === 'v1' ? 'var(--foreground)' : 'var(--text-secondary)' }}
        >
          {typeof v1 === 'number' ? v1.toLocaleString() : v1}
        </span>
      </div>
      <div className="text-center text-xs px-2 py-0.5 rounded font-medium"
        style={{ color: 'var(--text-secondary)', background: 'var(--chip-bg)', whiteSpace: 'nowrap' }}>
        {label}
      </div>
      <div className="text-left flex items-center gap-1">
        <span
          className="font-semibold text-sm"
          style={{ color: higher === 'v2' ? 'var(--foreground)' : 'var(--text-secondary)' }}
        >
          {typeof v2 === 'number' ? v2.toLocaleString() : v2}
        </span>
        {higher === 'v2' && <Trophy size={14} style={{ color: 'var(--accent-sun)' }} />}
      </div>
    </div>
  );
}

function winner(a: number, b: number): 'v1' | 'v2' | 'none' {
  if (a > b) return 'v1';
  if (b > a) return 'v2';
  return 'none';
}

export default function CompareView({ report1, report2 }: Props) {
  const p1 = report1.profile;
  const p2 = report2.profile;
  const totalYear1 = report1.monthlyData.reduce((s, m) => s + m.total, 0);
  const totalYear2 = report2.monthlyData.reduce((s, m) => s + m.total, 0);

  const rows: CompareRowProps[] = [
    { label: 'Total Solved', v1: p1.totalSolved, v2: p2.totalSolved, higher: winner(p1.totalSolved, p2.totalSolved) },
    { label: 'Easy', v1: p1.easySolved, v2: p2.easySolved, higher: winner(p1.easySolved, p2.easySolved) },
    { label: 'Medium', v1: p1.mediumSolved, v2: p2.mediumSolved, higher: winner(p1.mediumSolved, p2.mediumSolved) },
    { label: 'Hard', v1: p1.hardSolved, v2: p2.hardSolved, higher: winner(p1.hardSolved, p2.hardSolved) },
    { label: 'Acceptance %', v1: `${p1.acceptanceRate}%`, v2: `${p2.acceptanceRate}%`, higher: winner(p1.acceptanceRate, p2.acceptanceRate) },
    { label: `${report1.year} Submissions`, v1: totalYear1, v2: totalYear2, higher: winner(totalYear1, totalYear2) },
    { label: 'Max Streak', v1: `${p1.maxStreak}d`, v2: `${p2.maxStreak}d`, higher: winner(p1.maxStreak, p2.maxStreak) },
    { label: 'Global Rank', v1: `#${p1.ranking.toLocaleString()}`, v2: `#${p2.ranking.toLocaleString()}`, higher: winner(p2.ranking, p1.ranking) },
    ...(report1.contest && report2.contest ? [{
      label: 'Contest Rating',
      v1: report1.contest.rating,
      v2: report2.contest.rating,
      higher: winner(report1.contest.rating, report2.contest.rating),
    }] : []),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto px-6 py-12 flex flex-col gap-8"
    >
      <h2 className="text-4xl font-black text-center font-display" style={{ color: 'var(--foreground)' }}>
        Head-to-Head
      </h2>

      {/* User cards */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <UserCard report={report1} />
        <div className="text-2xl font-black" style={{ color: 'var(--text-secondary)' }}>vs</div>
        <UserCard report={report2} />
      </div>

      {/* Comparison rows */}
      <div className="glass-card p-4">
        {rows.map((row) => (
          <CompareRow key={row.label} {...row} />
        ))}
      </div>

      {/* Top topic comparison */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { report: report1, label: 'Best at' },
          { report: report2, label: 'Best at' },
        ].map(({ report, label }, i) => (
          <div key={i} className="glass-card p-4 text-center">
            <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</p>
            <p className="font-bold" style={{ color: 'var(--foreground)' }}>
              {report.strongestTopics[0]?.name ?? '—'}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--accent)' }}>
              {report.strongestTopics[0]?.count ?? 0} solved
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
