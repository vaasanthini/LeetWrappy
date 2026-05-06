import { NextRequest, NextResponse } from 'next/server';
import { getAllUserData } from '@/lib/services/leetcode';
import { buildWrappedReport } from '@/lib/services/report';

function isValidUsername(username: string) {
  return /^[a-zA-Z0-9_-]{1,25}$/.test(username);
}

function parseYear(value: string | null) {
  const year = parseInt(value ?? String(new Date().getFullYear()), 10);
  return year;
}

export async function handleLeetcodeRequest(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const username = searchParams.get('username')?.trim() ?? '';
  const year = parseYear(searchParams.get('year'));

  if (!username || !isValidUsername(username)) {
    return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
  }

  if (isNaN(year) || year < 2015 || year > new Date().getFullYear()) {
    return NextResponse.json({ error: 'Invalid year' }, { status: 400 });
  }

  try {
    const raw = await getAllUserData(username, year);
    const report = buildWrappedReport(raw, year);

    return NextResponse.json(
      { data: report },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[leetwrappy] API error:', message);

    if (message.includes('not found') || message.toLowerCase().includes('user not found')) {
      return NextResponse.json({ error: 'User not found. Check the username and try again.' }, { status: 404 });
    }
    if (message.includes('private')) {
      return NextResponse.json({ error: 'This profile is private. Ask the user to make it public.' }, { status: 403 });
    }

    return NextResponse.json({ error: `Error: ${message}` }, { status: 500 });
  }
}

export async function handleCompareRequest(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const user1 = searchParams.get('user1')?.trim() ?? '';
  const user2 = searchParams.get('user2')?.trim() ?? '';
  const year = parseYear(searchParams.get('year'));

  if (!user1 || !isValidUsername(user1)) {
    return NextResponse.json({ error: 'Invalid username for user1' }, { status: 400 });
  }
  if (!user2 || !isValidUsername(user2)) {
    return NextResponse.json({ error: 'Invalid username for user2' }, { status: 400 });
  }
  if (user1.toLowerCase() === user2.toLowerCase()) {
    return NextResponse.json({ error: 'Enter two different usernames to compare' }, { status: 400 });
  }
  if (isNaN(year) || year < 2015 || year > new Date().getFullYear()) {
    return NextResponse.json({ error: 'Invalid year' }, { status: 400 });
  }

  try {
    const [raw1, raw2] = await Promise.all([
      getAllUserData(user1, year),
      getAllUserData(user2, year),
    ]);

    const report1 = buildWrappedReport(raw1, year);
    const report2 = buildWrappedReport(raw2, year);

    return NextResponse.json(
      { user1: report1, user2: report2 },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    if (message.includes('not found')) {
      return NextResponse.json({ error: `User not found: ${message}` }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to fetch comparison data. Try again shortly.' }, { status: 500 });
  }
}
