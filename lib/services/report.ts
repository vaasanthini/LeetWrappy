import type {
  CalendarData,
  ContestRanking,
  RecentSubmission,
  SkillStats,
  UserProfile,
} from '../models/leetcode';
import type { WrappedReport } from '../models/report';

export function getMonthlyData(calendar: CalendarData): Array<{ month: string; total: number }> {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const counts = new Array(12).fill(0);

  const effectiveYear = calendar.effectiveYear;

  for (const [ts, count] of Object.entries(calendar.submissionCalendar)) {
    const date = new Date(Number(ts) * 1000);
    if (date.getFullYear() === effectiveYear) {
      counts[date.getMonth()] += count;
    }
  }

  return months.map((month, i) => ({ month, total: counts[i] }));
}

export function getHeatmapData(calendar: CalendarData): Array<{ day: string; value: number }> {
  return Object.entries(calendar.submissionCalendar).map(([ts, count]) => {
    const date = new Date(Number(ts) * 1000);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return { day: `${yyyy}-${mm}-${dd}`, value: count };
  });
}

export function getTopicsRadarData(skills: SkillStats): Array<{ topic: string; solved: number }> {
  const all = [
    ...skills.advanced,
    ...skills.intermediate,
    ...skills.fundamental,
  ].sort((a, b) => b.problemsSolved - a.problemsSolved);

  return all.slice(0, 8).map((t) => ({ topic: t.tagName, solved: t.problemsSolved }));
}

export function getBestMonth(calendar: CalendarData): { month: string; count: number } {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const data = getMonthlyData(calendar);
  const best = data.reduce((prev, cur) => (cur.total > prev.total ? cur : prev), data[0]);

  const fullMonth = months[data.indexOf(best)];
  return { month: fullMonth ?? best.month, count: best.total };
}

export function getDifficultyProgression(submissions: RecentSubmission[]): Array<{
  date: string;
  difficulty: number;
  title: string;
  timestamp: number;
}> {
  const sorted = [...submissions].sort((a, b) => Number(a.timestamp) - Number(b.timestamp));

  return sorted.map((s, i) => {
    const date = new Date(Number(s.timestamp) * 1000);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    const pct = i / sorted.length;
    let difficulty = 1;
    if (pct > 0.7) difficulty = 2;
    if (pct > 0.9) difficulty = 3;

    const lower = s.title.toLowerCase();
    if (lower.includes('hard') || lower.includes('iii') || lower.includes('iv')) difficulty = 3;
    else if (lower.includes('ii') || lower.includes('medium')) difficulty = 2;

    return {
      date: `${yyyy}-${mm}-${dd}`,
      difficulty,
      title: s.title,
      timestamp: Number(s.timestamp),
    };
  });
}

export function getSolvingSpeedStats(submissions: RecentSubmission[]): {
  quick: number;
  steady: number;
  deep: number;
  medianMinutes: number;
} {
  const bySlug: Record<string, number[]> = {};
  for (const s of submissions) {
    if (!bySlug[s.titleSlug]) bySlug[s.titleSlug] = [];
    bySlug[s.titleSlug].push(Number(s.timestamp));
  }

  const gaps: number[] = [];
  for (const times of Object.values(bySlug)) {
    if (times.length >= 2) {
      const sorted = times.sort((a, b) => a - b);
      for (let i = 1; i < sorted.length; i++) {
        const gapSec = sorted[i] - sorted[i - 1];
        if (gapSec > 60 && gapSec < 7200) {
          gaps.push(gapSec);
        }
      }
    }
  }

  if (gaps.length === 0) {
    return { quick: 0, steady: 0, deep: 0, medianMinutes: 0 };
  }

  gaps.sort((a, b) => a - b);
  const median = gaps[Math.floor(gaps.length / 2)];

  let quick = 0;
  let steady = 0;
  let deep = 0;
  for (const g of gaps) {
    const min = g / 60;
    if (min < 10) quick++;
    else if (min < 30) steady++;
    else deep++;
  }

  return { quick, steady, deep, medianMinutes: Math.round(median / 60) };
}

const ARCHETYPES: Array<{
  topics: string[];
  archetype: string;
  description: string;
  emoji: string;
}> = [
  { topics: ['Dynamic Programming', 'dp'], archetype: 'DP Wizard', description: 'You see overlapping subproblems where others see chaos. Memoization is your superpower.', emoji: '🧙‍♂️' },
  { topics: ['Tree', 'Binary Tree', 'Binary Search Tree'], archetype: 'Tree Climber', description: 'From roots to leaves, you navigate hierarchies with graceful recursion.', emoji: '🌳' },
  { topics: ['Graph', 'BFS', 'DFS'], archetype: 'Graph Explorer', description: 'You traverse networks others fear to enter. Every node is a new adventure.', emoji: '🗺️' },
  { topics: ['Array', 'String'], archetype: 'Array Artisan', description: 'You wield arrays and strings with precision. Linear thinking at its finest.', emoji: '⚡' },
  { topics: ['Hash Table', 'HashMap'], archetype: 'Hash Map Hero', description: 'O(1) lookup is your default weapon. You trade space for speed without hesitation.', emoji: '🗡️' },
  { topics: ['Binary Search'], archetype: 'Binary Search Sniper', description: 'You eliminate half the possibilities with every move. Divide and conquer is your creed.', emoji: '🎯' },
  { topics: ['Two Pointers', 'Sliding Window'], archetype: 'Pointer Puppeteer', description: 'Two pointers, one vision. You compress complexity into elegant dual-cursor solutions.', emoji: '🎭' },
  { topics: ['Math', 'Bit Manipulation'], archetype: 'Bit Tinkerer', description: 'You speak in binary. Bit shifts and XOR are your favorite tricks.', emoji: '🔬' },
  { topics: ['Backtracking'], archetype: 'Backtrack Artist', description: 'You explore every path, retreat gracefully, and always find the solution.', emoji: '🎨' },
  { topics: ['Stack', 'Queue'], archetype: 'Stack Master', description: 'LIFO or FIFO — you know exactly when to push and when to pop.', emoji: '📚' },
];

export function getPersonalityArchetype(skills: SkillStats): {
  archetype: string;
  description: string;
  emoji: string;
} {
  const allTags = [
    ...skills.advanced,
    ...skills.intermediate,
    ...skills.fundamental,
  ].sort((a, b) => b.problemsSolved - a.problemsSolved);

  const topTag = allTags[0]?.tagName ?? '';

  for (const a of ARCHETYPES) {
    if (a.topics.some((t) => topTag.toLowerCase().includes(t.toLowerCase()))) {
      return { archetype: a.archetype, description: a.description, emoji: a.emoji };
    }
  }

  return {
    archetype: 'Code Ninja',
    description: 'Versatile and relentless. No algorithm can stop you.',
    emoji: '🥷',
  };
}

export function getAcceptanceRate(profile: UserProfile): number {
  return profile.acceptanceRate;
}

export function getStrongestTopics(skills: SkillStats): Array<{ name: string; count: number }> {
  const all = [
    ...skills.advanced,
    ...skills.intermediate,
    ...skills.fundamental,
  ].sort((a, b) => b.problemsSolved - a.problemsSolved);

  return all.slice(0, 5).map((t) => ({ name: t.tagName, count: t.problemsSolved }));
}

export function getWeakestTopics(skills: SkillStats): Array<{ name: string; count: number }> {
  const all = [
    ...skills.advanced,
    ...skills.intermediate,
    ...skills.fundamental,
  ].filter((t) => t.problemsSolved > 0).sort((a, b) => a.problemsSolved - b.problemsSolved);

  return all.slice(0, 5).map((t) => ({ name: t.tagName, count: t.problemsSolved }));
}

export function buildWrappedReport(
  data: {
    profile: UserProfile;
    calendar: CalendarData;
    skills: SkillStats;
    submissions: RecentSubmission[];
    contest: ContestRanking | null;
  },
  year: number
): WrappedReport {
  const effectiveYear = data.calendar.effectiveYear;

  const yearStart = new Date(effectiveYear, 0, 1).getTime() / 1000;
  const yearEnd = new Date(effectiveYear + 1, 0, 1).getTime() / 1000;
  const yearSubmissions = data.submissions.filter((s) => {
    const ts = Number(s.timestamp);
    return ts >= yearStart && ts < yearEnd;
  });

  const submissionsToUse = yearSubmissions.length > 0 ? yearSubmissions : data.submissions;

  return {
    profile: data.profile,
    monthlyData: getMonthlyData(data.calendar),
    heatmapData: getHeatmapData(data.calendar),
    topicsData: getTopicsRadarData(data.skills),
    bestMonth: getBestMonth(data.calendar),
    difficultyProgression: getDifficultyProgression(submissionsToUse),
    speedStats: getSolvingSpeedStats(submissionsToUse),
    archetype: getPersonalityArchetype(data.skills),
    strongestTopics: getStrongestTopics(data.skills),
    weakestTopics: getWeakestTopics(data.skills),
    year: effectiveYear,
    contest: data.contest,
  };
}
