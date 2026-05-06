'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { WrappedReport } from '@/lib/models/report';

import HeroSlide from './slides/HeroSlide';
import TotalSolvedSlide from './slides/TotalSolvedSlide';
import MonthlyGraphSlide from './slides/MonthlyGraphSlide';
import HeatmapSlide from './slides/HeatmapSlide';
import TopicsSlide from './slides/TopicsSlide';
import DifficultyProgressionSlide from './slides/DifficultyProgressionSlide';
import SpeedSlide from './slides/SpeedSlide';
import ArchetypeSlide from './slides/ArchetypeSlide';
import SummarySlide from './slides/SummarySlide';
import CompareView from './CompareView';

interface Props {
  report: WrappedReport;
  compareReport?: WrappedReport;
  onReset: () => void;
  onYearChange?: (year: number) => void;
}

const SLIDE_TITLES = [
  'Overview',
  'Problem Stats',
  'Monthly Activity',
  'Heatmap',
  'Topics',
  'Difficulty Progression',
  'Solving Speed',
  'Your Archetype',
  'Year in Review',
];

const CURRENT_YEAR = new Date().getFullYear();
const AVAILABLE_YEARS = Array.from({ length: CURRENT_YEAR - 2019 }, (_, i) => CURRENT_YEAR - i);

export default function WrappedPlayer({ report, compareReport, onReset, onYearChange }: Props) {
  const [slide, setSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [compareMode, setCompareMode] = useState(!!compareReport);
  const TOTAL = SLIDE_TITLES.length;

  function goNext() {
    if (slide < TOTAL - 1) {
      setDirection(1);
      setSlide(slide + 1);
    }
  }

  function goPrev() {
    if (slide > 0) {
      setDirection(-1);
      setSlide(slide - 1);
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [slide]);

  const slides = [
    <HeroSlide key="hero" report={report} direction={direction} />,
    <TotalSolvedSlide key="total" report={report} direction={direction} />,
    <MonthlyGraphSlide key="monthly" report={report} direction={direction} />,
    <HeatmapSlide key="heatmap" report={report} direction={direction} />,
    <TopicsSlide key="topics" report={report} direction={direction} />,
    <DifficultyProgressionSlide key="diff" report={report} direction={direction} />,
    <SpeedSlide key="speed" report={report} direction={direction} />,
    <ArchetypeSlide key="archetype" report={report} direction={direction} />,
    <SummarySlide key="summary" report={report} direction={direction} onReset={onReset} />,
  ];

  return (
    <div
      className="relative w-full min-h-screen flex flex-col"
      style={{ background: 'var(--player-bg)' }}
    >
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex flex-col gap-2 px-4 pt-3 pb-2"
        style={{ background: 'var(--topbar-bg)' }}>
        {/* Progress segments */}
        <div className="flex gap-1.5">
          {SLIDE_TITLES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > slide ? 1 : -1); setSlide(i); }}
              className="flex-1 h-1 rounded-full transition-all"
              style={{
                background: i <= slide ? 'var(--accent)' : 'var(--progress-muted)',
                opacity: i === slide ? 1 : 0.7,
              }}
            />
          ))}
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            {slide + 1} / {TOTAL} · {SLIDE_TITLES[slide]}
          </span>

          <div className="flex items-center gap-2">
            {/* Year selector */}
            {onYearChange && (
              <select
                value={report.year}
                onChange={(e) => onYearChange(Number(e.target.value))}
                className="text-xs rounded-lg px-2 py-1 border outline-none"
                style={{
                  background: 'var(--input-bg)',
                  borderColor: 'var(--line)',
                  color: 'var(--foreground)',
                }}
              >
                {AVAILABLE_YEARS.map(y => (
                  <option key={y} value={y} style={{ background: 'var(--input-option-bg)' }}>{y}</option>
                ))}
              </select>
            )}

            {/* Compare toggle */}
            {compareReport && (
              <button
                onClick={() => setCompareMode(!compareMode)}
                className="text-xs px-3 py-1 rounded-full font-medium transition-colors"
                style={{
                  background: compareMode ? 'var(--accent)' : 'var(--chip-bg)',
                  color: compareMode ? 'var(--button-primary-text)' : 'var(--text-secondary)',
                }}
              >
                {compareMode ? 'Showing Comparison' : 'Compare'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Slide content */}
      <div className="flex-1 pt-16">
        {compareMode && compareReport ? (
          <div className="min-h-screen" style={{ background: 'var(--background)' }}>
            <CompareView report1={report} report2={compareReport} />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {slides[slide]}
          </AnimatePresence>
        )}
      </div>

      {/* Nav arrows */}
      {!compareMode && (
        <>
          {slide > 0 && (
            <button
              onClick={goPrev}
              className="fixed left-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'var(--card)', color: 'var(--foreground)', border: '1px solid var(--line)' }}
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          {slide < TOTAL - 1 && (
            <button
              onClick={goNext}
              className="fixed right-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{
                background: 'var(--button-primary-bg)',
                color: 'var(--button-primary-text)',
                border: '1px solid var(--accent-border)',
              }}
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </>
      )}

      {/* Swipe hint */}
      {slide === 0 && !compareMode && (
        <div className="fixed bottom-6 left-0 right-0 text-center z-40">
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Use arrow keys or click → to navigate
          </span>
        </div>
      )}
    </div>
  );
}
