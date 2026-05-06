import type {
  CalendarData,
  ContestRanking,
  RecentSubmission,
  SkillStats,
  UserProfile,
} from '../models/leetcode';

const LEETCODE_URL = 'https://leetcode.com/graphql';

const HEADERS = {
  'Content-Type': 'application/json',
  Referer: 'https://leetcode.com',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  Origin: 'https://leetcode.com',
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function gql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const retries = 2;
  const timeoutMs = 12000;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(LEETCODE_URL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ query, variables }),
        cache: 'no-store',
        signal: controller.signal,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        const transient = [502, 503, 504].includes(res.status);
        if (transient && attempt < retries) {
          await sleep(300 * (attempt + 1));
          continue;
        }
        throw new Error(`LeetCode API returned ${res.status}: ${text.slice(0, 200)}`);
      }

      const json = await res.json();

      if (json.errors) {
        throw new Error(json.errors[0]?.message ?? 'GraphQL error');
      }

      return json.data as T;
    } catch (err: unknown) {
      const isAbort = err instanceof Error && err.name === 'AbortError';
      if ((isAbort || err instanceof TypeError) && attempt < retries) {
        await sleep(300 * (attempt + 1));
        continue;
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  throw new Error('LeetCode API request failed after retries');
}

export async function getUserProfile(username: string): Promise<UserProfile> {
  const data = await gql<{ matchedUser: any }>(
    `query userPublicProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          realName
          userAvatar
          ranking
        }
        submitStats: submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
      }
    }`,
    { username }
  );

  if (!data.matchedUser) {
    throw new Error('User not found');
  }

  const { matchedUser } = data;
  const stats: any[] = matchedUser.submitStats?.acSubmissionNum ?? [];

  const all = stats.find((s) => s.difficulty === 'All') ?? { count: 0, submissions: 0 };
  const easy = stats.find((s) => s.difficulty === 'Easy') ?? { count: 0 };
  const med = stats.find((s) => s.difficulty === 'Medium') ?? { count: 0 };
  const hard = stats.find((s) => s.difficulty === 'Hard') ?? { count: 0 };

  const totalSolved = all.count;
  const totalSubmissions = all.submissions;
  const acceptanceRate = totalSubmissions > 0
    ? Math.round((totalSolved / totalSubmissions) * 100)
    : 0;

  return {
    username: matchedUser.username,
    realName: matchedUser.profile?.realName ?? '',
    avatar: matchedUser.profile?.userAvatar ?? '',
    ranking: matchedUser.profile?.ranking ?? 0,
    totalSolved,
    easySolved: easy.count,
    mediumSolved: med.count,
    hardSolved: hard.count,
    acceptanceRate,
    totalSubmissions,
    streak: 0,
    maxStreak: 0,
  };
}

const CALENDAR_QUERY = `
  query userCalendar($username: String!, $year: Int) {
    matchedUser(username: $username) {
      userCalendar(year: $year) {
        activeYears
        streak
        totalActiveDays
        submissionCalendar
      }
    }
  }
`;

async function fetchCalendarForYear(username: string, year: number | null) {
  const data = await gql<{ matchedUser: any }>(
    CALENDAR_QUERY,
    { username, year }
  );
  if (!data.matchedUser) throw new Error('User not found');
  const cal = data.matchedUser.userCalendar;
  const raw: Record<string, number> = JSON.parse(cal?.submissionCalendar ?? '{}');
  return {
    raw,
    streak: cal?.streak ?? 0,
    totalActiveDays: cal?.totalActiveDays ?? 0,
    activeYears: (cal?.activeYears ?? []) as number[],
  };
}

function computeMaxStreak(raw: Record<string, number>): number {
  const sortedDays = Object.keys(raw).map(Number).sort((a, b) => a - b);
  let maxStreak = 0;
  let curStreak = 0;
  let prevDay: number | null = null;
  for (const ts of sortedDays) {
    const dayNum = Math.floor(ts / 86400);
    if (prevDay !== null && dayNum === prevDay + 1) {
      curStreak++;
    } else {
      curStreak = 1;
    }
    maxStreak = Math.max(maxStreak, curStreak);
    prevDay = dayNum;
  }
  return maxStreak;
}

export async function getCalendarData(username: string, requestedYear: number): Promise<CalendarData> {
  const first = await fetchCalendarForYear(username, requestedYear);

  let raw = first.raw;
  let streak = first.streak;
  let activeDays = first.totalActiveDays;
  let activeYears = first.activeYears;
  let effectiveYear = requestedYear;

  if (Object.keys(raw).length === 0 && activeYears.length > 0) {
    const fallbackYear = [...activeYears].sort((a, b) => b - a)[0];
    if (fallbackYear !== requestedYear) {
      const fallback = await fetchCalendarForYear(username, fallbackYear);
      raw = fallback.raw;
      streak = fallback.streak;
      activeDays = fallback.totalActiveDays;
      activeYears = fallback.activeYears;
      effectiveYear = fallbackYear;
    }
  }

  return {
    submissionCalendar: raw,
    totalActiveDays: activeDays,
    streak,
    maxStreak: computeMaxStreak(raw),
    activeYears,
    effectiveYear,
  };
}

export async function getSkillStats(username: string): Promise<SkillStats> {
  const data = await gql<{ matchedUser: any }>(
    `query skillStats($username: String!) {
      matchedUser(username: $username) {
        tagProblemCounts {
          advanced { tagName tagSlug problemsSolved }
          intermediate { tagName tagSlug problemsSolved }
          fundamental { tagName tagSlug problemsSolved }
        }
      }
    }`,
    { username }
  );

  if (!data.matchedUser) throw new Error('User not found');

  const tags = data.matchedUser.tagProblemCounts ?? {};
  const map = (arr: any[]) =>
    arr.map((t) => ({ tagName: t.tagName, problemsSolved: t.problemsSolved }));

  return {
    advanced: map(tags.advanced ?? []),
    intermediate: map(tags.intermediate ?? []),
    fundamental: map(tags.fundamental ?? []),
  };
}

export async function getRecentSubmissions(username: string, limit = 100): Promise<RecentSubmission[]> {
  const data = await gql<{ recentAcSubmissionList: any[] }>(
    `query recentAcSubmissions($username: String!, $limit: Int!) {
      recentAcSubmissionList(username: $username, limit: $limit) {
        id title titleSlug timestamp statusDisplay lang
      }
    }`,
    { username, limit }
  );

  return (data.recentAcSubmissionList ?? []).map((s: any) => ({
    id: s.id,
    title: s.title,
    titleSlug: s.titleSlug,
    timestamp: s.timestamp,
    statusDisplay: s.statusDisplay,
    lang: s.lang,
  }));
}

export async function getContestRanking(username: string): Promise<ContestRanking | null> {
  try {
    const data = await gql<{ userContestRanking: any }>(
      `query userContestRankingInfo($username: String!) {
        userContestRanking(username: $username) {
          attendedContestsCount rating globalRanking totalParticipants topPercentage
        }
      }`,
      { username }
    );

    if (!data.userContestRanking) return null;
    const r = data.userContestRanking;
    return {
      attendedContestsCount: r.attendedContestsCount,
      rating: Math.round(r.rating),
      globalRanking: r.globalRanking,
      topPercentage: r.topPercentage,
    };
  } catch {
    return null;
  }
}

export async function getAllUserData(username: string, year: number) {
  const currentYear = new Date().getFullYear();
  const needsCurrentStreak = year !== currentYear;

  const [profile, calendar, skills, submissions, contest, currentCal] = await Promise.all([
    getUserProfile(username),
    getCalendarData(username, year),
    getSkillStats(username),
    getRecentSubmissions(username, 100),
    getContestRanking(username),
    needsCurrentStreak ? fetchCalendarForYear(username, currentYear) : Promise.resolve(null),
  ]);

  if (needsCurrentStreak && currentCal) {
    profile.streak = currentCal.streak;
  } else if (!needsCurrentStreak && calendar.effectiveYear !== currentYear) {
    profile.streak = 0;
  } else {
    profile.streak = calendar.streak;
  }

  profile.maxStreak = calendar.maxStreak;

  return { profile, calendar, skills, submissions, contest };
}
