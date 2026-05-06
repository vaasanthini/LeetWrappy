export interface UserProfile {
  username: string;
  realName: string;
  avatar: string;
  ranking: number;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  acceptanceRate: number;
  totalSubmissions: number;
  streak: number;
  maxStreak: number;
}

export interface CalendarData {
  submissionCalendar: Record<string, number>;
  totalActiveDays: number;
  streak: number;
  maxStreak: number;
  activeYears: number[];
  effectiveYear: number; // actual year the calendar data is from
}

export interface SkillStats {
  advanced: Array<{ tagName: string; problemsSolved: number }>;
  intermediate: Array<{ tagName: string; problemsSolved: number }>;
  fundamental: Array<{ tagName: string; problemsSolved: number }>;
}

export interface RecentSubmission {
  id: string;
  title: string;
  titleSlug: string;
  timestamp: string;
  statusDisplay: string;
  lang: string;
}

export interface ContestRanking {
  attendedContestsCount: number;
  rating: number;
  globalRanking: number;
  topPercentage: number;
}
