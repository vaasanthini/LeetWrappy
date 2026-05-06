'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { WrappedReport } from '@/lib/models/report';

const WrappedPlayer = dynamic(() => import('@/app/_views/WrappedPlayer'), { ssr: false });

const EXAMPLE_USERS = ['neal_wu', 'tourist', 'jiangly', 'uwi'];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 2019 }, (_, i) => CURRENT_YEAR - i);
const STORAGE_KEY = 'leetwrappy:usernames';
const MAX_SUGGESTIONS = 8;

type Mode = 'single' | 'compare';

function LoadingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-6"
      style={{ background: 'var(--background)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
        <p className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>Crunching your submissions...</p>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Fetching data from LeetCode</p>
      </div>
    </div>
  );
}

export default function Home() {
  const [mode, setMode] = useState<Mode>('single');
  const [username, setUsername] = useState('');
  const [username2, setUsername2] = useState('');
  const [year, setYear] = useState(CURRENT_YEAR);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState<WrappedReport | null>(null);
  const [compareReport, setCompareReport] = useState<WrappedReport | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setSuggestions(parsed.filter((v) => typeof v === 'string').slice(0, MAX_SUGGESTIONS));
      }
    } catch {
      setSuggestions([]);
    }
  }, []);

  function addSuggestion(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    const lower = trimmed.toLowerCase();
    const next = [trimmed, ...suggestions.filter((s) => s.toLowerCase() !== lower)]
      .slice(0, MAX_SUGGESTIONS);
    setSuggestions(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setReport(null);
    setCompareReport(null);

    try {
      if (mode === 'compare') {
        const res = await fetch(`/api/leetcode/compare?user1=${encodeURIComponent(username)}&user2=${encodeURIComponent(username2)}&year=${year}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? 'Failed to fetch');
        setReport(json.user1);
        setCompareReport(json.user2);
        addSuggestion(username);
        addSuggestion(username2);
      } else {
        const res = await fetch(`/api/leetcode?username=${encodeURIComponent(username)}&year=${year}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? 'Failed to fetch');
        setReport(json.data);
        addSuggestion(username);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setReport(null);
    setCompareReport(null);
    setError('');
  }

  async function handleYearChange(newYear: number) {
    if (!username || !report) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/leetcode?username=${encodeURIComponent(username)}&year=${newYear}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setYear(newYear);
      setReport(json.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSkeleton />;

  if (report) {
    return (
      <WrappedPlayer
        report={report}
        compareReport={compareReport ?? undefined}
        onReset={handleReset}
        onYearChange={handleYearChange}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden"
      style={{
        background: 'var(--page-bg)',
      }}>
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-40 blur-3xl"
          style={{ background: 'var(--page-glow-1)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-45 blur-3xl"
          style={{ background: 'var(--page-glow-2)' }} />
        <div className="absolute top-8 right-12 w-40 h-40 rounded-full opacity-45 blur-2xl"
          style={{ background: 'var(--page-glow-3)' }} />
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-6xl font-black font-display" style={{ color: 'var(--foreground)' }}>
            Leet<span>Wrapped</span>
          </h1>
          <p className="mt-3 text-lg" style={{ color: 'var(--text-secondary)' }}>
            Your LeetCode journey, beautifully visualized
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {/* Mode toggle */}
          <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: 'var(--line)' }}>
            {(['single', 'compare'] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className="flex-1 py-2.5 text-sm font-semibold transition-colors capitalize"
                style={{
                  background: mode === m ? 'var(--accent-soft)' : 'transparent',
                  color: mode === m ? 'var(--accent)' : 'var(--text-secondary)',
                }}
              >
                {m === 'single' ? 'Single User' : 'Compare Two Users'}
              </button>
            ))}
          </div>

          {/* Username inputs */}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="LeetCode username"
            list="username-suggestions"
            required
            maxLength={25}
            className="w-full px-4 py-3.5 rounded-xl outline-none text-base font-medium transition-all"
            style={{
              background: 'var(--input-bg)',
              border: '1px solid var(--line)',
              color: 'var(--foreground)',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--line)')}
          />

          {mode === 'compare' && (
            <input
              type="text"
              value={username2}
              onChange={(e) => setUsername2(e.target.value)}
              placeholder="Second username"
              list="username-suggestions"
              required
              maxLength={25}
              className="w-full px-4 py-3.5 rounded-xl outline-none text-base font-medium transition-all"
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--line)',
                color: 'var(--foreground)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--line)')}
            />
          )}

          {/* Year selector */}
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full px-4 py-3.5 rounded-xl outline-none text-base font-medium"
            style={{
              background: 'var(--input-bg)',
              border: '1px solid var(--line)',
              color: 'var(--foreground)',
            }}
          >
            {YEARS.map(y => (
              <option key={y} value={y} style={{ background: 'var(--input-option-bg)' }}>{y} Wrapped</option>
            ))}
          </select>

          {error && (
            <div
              className="px-4 py-3 rounded-xl text-sm"
              style={{
                background: 'var(--error-bg)',
                color: 'var(--error-text)',
                border: '1px solid var(--error-border)',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 rounded-xl font-bold text-base transition-opacity hover:opacity-90 active:scale-95"
            style={{ background: 'var(--button-primary-bg)', color: 'var(--button-primary-text)' }}
          >
            Generate My Wrapped →
          </button>

          <datalist id="username-suggestions">
            {suggestions.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </form>

        {/* Example users */}
        <div className="flex flex-col items-center gap-2 w-full">
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Try an example</p>
          <div className="flex flex-wrap justify-center gap-2">
            {EXAMPLE_USERS.map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUsername(u)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                style={{
                  background: 'var(--input-bg)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--line)',
                }}
              >
                @{u}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="absolute bottom-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
        Not affiliated with LeetCode · Open source
      </p>
    </div>
  );
}
