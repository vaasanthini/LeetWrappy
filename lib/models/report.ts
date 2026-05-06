import type { ContestRanking, UserProfile } from './leetcode';

export interface WrappedReport {
  profile: UserProfile;
  monthlyData: Array<{ month: string; total: number }>;
  heatmapData: Array<{ day: string; value: number }>;
  topicsData: Array<{ topic: string; solved: number }>;
  bestMonth: { month: string; count: number };
  difficultyProgression: Array<{ date: string; difficulty: number; title: string; timestamp: number }>;
  speedStats: { quick: number; steady: number; deep: number; medianMinutes: number };
  archetype: { archetype: string; description: string; emoji: string };
  strongestTopics: Array<{ name: string; count: number }>;
  weakestTopics: Array<{ name: string; count: number }>;
  year: number;
  contest: ContestRanking | null;
}
