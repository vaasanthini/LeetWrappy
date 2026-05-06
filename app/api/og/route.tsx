import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const username = searchParams.get('username') ?? 'LeetCoder';
  const solved = searchParams.get('solved') ?? '0';
  const archetype = searchParams.get('archetype') ?? 'Code Ninja';
  const emoji = searchParams.get('emoji') ?? '🥷';
  const year = searchParams.get('year') ?? String(new Date().getFullYear());
  const streak = searchParams.get('streak') ?? '0';
  const ranking = searchParams.get('ranking') ?? '0';
  const easy = searchParams.get('easy') ?? '0';
  const medium = searchParams.get('medium') ?? '0';
  const hard = searchParams.get('hard') ?? '0';

  const total = parseInt(solved);
  const e = parseInt(easy);
  const m = parseInt(medium);
  const h = parseInt(hard);

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #0d2b2a 50%, #0a0a0a 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow circles */}
        <div style={{
          position: 'absolute', top: '-100px', left: '-100px',
          width: '400px', height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,184,163,0.15) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', right: '-100px',
          width: '400px', height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,192,30,0.1) 0%, transparent 70%)',
        }} />

        {/* Year badge */}
        <div style={{
          position: 'absolute', top: '40px', right: '60px',
          background: 'rgba(0,184,163,0.2)',
          border: '1px solid rgba(0,184,163,0.4)',
          borderRadius: '20px',
          padding: '8px 20px',
          color: '#00b8a3',
          fontSize: '18px',
          fontWeight: 700,
        }}>
          {year} Wrapped
        </div>

        {/* Brand */}
        <div style={{ position: 'absolute', top: '40px', left: '60px', color: '#ffffff', fontSize: '22px', fontWeight: 800 }}>
          Leet<span style={{ color: '#00b8a3' }}>wrappy</span>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '60px' }}>
          {/* Left: user info */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ fontSize: '52px', fontWeight: 900, color: '#ffffff' }}>@{username}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '28px' }}>{emoji}</span>
              <span style={{ fontSize: '28px', color: '#00b8a3', fontWeight: 700 }}>{archetype}</span>
            </div>
            <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
              <div style={{ color: '#a0a0a0', fontSize: '16px' }}>
                <span style={{ color: '#ffffff', fontWeight: 700 }}>{streak}</span> day streak
              </div>
              <div style={{ color: '#a0a0a0', fontSize: '16px' }}>
                Rank <span style={{ color: '#ffffff', fontWeight: 700 }}>#{Number(ranking).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: '2px', height: '180px', background: 'rgba(255,255,255,0.1)' }} />

          {/* Right: stats */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '90px', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>{total}</div>
            <div style={{ fontSize: '18px', color: '#a0a0a0', fontWeight: 600 }}>problems solved</div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              <div style={{
                background: 'rgba(0,184,163,0.15)', border: '1px solid #00b8a3',
                borderRadius: '8px', padding: '6px 16px',
                color: '#00b8a3', fontWeight: 700, fontSize: '16px',
              }}>
                Easy {e}
              </div>
              <div style={{
                background: 'rgba(255,192,30,0.15)', border: '1px solid #ffc01e',
                borderRadius: '8px', padding: '6px 16px',
                color: '#ffc01e', fontWeight: 700, fontSize: '16px',
              }}>
                Med {m}
              </div>
              <div style={{
                background: 'rgba(255,55,95,0.15)', border: '1px solid #ff375f',
                borderRadius: '8px', padding: '6px 16px',
                color: '#ff375f', fontWeight: 700, fontSize: '16px',
              }}>
                Hard {h}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          position: 'absolute', bottom: '30px',
          color: 'rgba(255,255,255,0.3)', fontSize: '14px',
        }}>
          leetwrappy.vercel.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
