'use client';

import { useState } from 'react';
import { BookMarked, BookOpen, Plus, Sparkles } from 'lucide-react';
import { VocabularyWord } from '../../types';
import { useOverviewSection } from './hooks/useOverviewSection';

type OverviewSectionProps = {
  words: VocabularyWord[];
  onAdd?: () => void;
};

type ChartMetric = 'word' | 'use';

export default function OverviewSection({ words, onAdd }: OverviewSectionProps) {
  const stats = useOverviewSection(words);
  const [hoveredChartPoint, setHoveredChartPoint] = useState<{ index: number; metric: ChartMetric } | null>(null);
  const max = Math.max(1, ...stats.monthlyProgress.flatMap((item) => [item.wordCount, item.useCount]));
  const wordPoints = stats.monthlyProgress.map((item, index) => `${index * 80 + 12},${112 - (item.wordCount / max) * 88}`).join(' ');
  const usePoints = stats.monthlyProgress.map((item, index) => `${index * 80 + 18},${112 - (item.useCount / max) * 88}`).join(' ');

  return (
    <section className="grid gap-4 xl:grid-cols-[1.1fr_.8fr_1.35fr]">
      <div className="relative overflow-hidden rounded-[28px] bg-[#155e6c] p-6 text-white shadow-[0_18px_45px_rgba(29,89,97,.16)]">
        <div className="absolute -right-10 -top-14 h-40 w-40 rounded-full bg-white/10" />
        <div className="relative flex h-full min-h-52 flex-col justify-between">
          <div className="flex items-start justify-between"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15"><BookOpen className="h-6 w-6" /></span><span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold tracking-wide">V2 PREVIEW</span></div>
          <div><p className="text-sm text-[#c9e3e5]">Your personal word collection</p><h1 className="mt-1 font-[Georgia,serif] text-3xl font-bold">Vocabulary Lab</h1>{onAdd && <button onClick={onAdd} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#f5c66d] px-4 py-2.5 text-sm font-bold text-[#244d53] transition hover:bg-[#ffd583]"><Plus className="h-4 w-4" /> Add vocabulary</button>}</div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
        <div className="rounded-[28px] border border-[#d8e5e5] bg-white p-5"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#789093]">Today</p><p className="mt-3 font-[Georgia,serif] text-2xl font-bold text-[#214f57]">23 August</p><p className="text-sm text-[#829497]">Sunday, 2026</p></div>
        <div className="rounded-[28px] border border-[#d8e5e5] bg-white p-5"><div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#789093]">Words collected</p><BookMarked className="h-5 w-5 text-[#2d7881]" /></div><p className="mt-2 font-[Georgia,serif] text-4xl font-bold text-[#214f57]">{stats.totalWords}</p><p className="text-sm text-[#829497]">{stats.totalUses} different uses</p></div>
      </div>

      <div className="rounded-[28px] border border-[#d8e5e5] bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#789093]">Vocabulary activity</p><h2 className="mt-1 font-[Georgia,serif] text-xl font-bold text-[#214f57]">Words & use cases / month</h2></div><Sparkles className="h-5 w-5 text-[#d69d3d]" /></div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-[#668286]"><span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-[#277884]" />Words (parent)</span><span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-[#d69d3d]/45" />Use cases (arti + POS)</span></div>
        <svg viewBox="0 0 430 145" className="mt-4 h-32 w-full overflow-visible" aria-label="Monthly vocabulary chart">
          {[24, 68, 112].map((y) => <line key={y} x1="15" y1={y} x2="415" y2={y} stroke="#e8eeee" strokeWidth="1" />)}
          <polyline points={wordPoints} fill="none" stroke="#277884" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={usePoints} fill="none" stroke="#d69d3d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.45" />
          {stats.monthlyProgress.map((item, index) => {
            const x = index * 80 + 15;
            const wordX = x - 3;
            const useX = x + 3;
            const wordY = 112 - (item.wordCount / max) * 88;
            const useY = 112 - (item.useCount / max) * 88;
            const tooltipX = Math.max(5, Math.min(x - 55, 315));
            const tooltipY = Math.min(wordY, useY) < 56 ? Math.max(wordY, useY) + 12 : Math.min(wordY, useY) - 50;
            const activeMetric = hoveredChartPoint?.index === index ? hoveredChartPoint.metric : null;
            const isHovered = activeMetric !== null;

            return (
              <g key={item.month} className="cursor-pointer">
                <title>{`${item.label}: ${item.wordCount} word entries and ${item.useCount} use cases added`}</title>
                <circle cx={wordX} cy={wordY} r={activeMetric === 'word' ? '7' : '5'} fill="#277884" stroke="white" strokeWidth="3" onMouseEnter={() => setHoveredChartPoint({ index, metric: 'word' })} onMouseLeave={() => setHoveredChartPoint(null)} />
                <circle cx={useX} cy={useY} r={activeMetric === 'use' ? '5.5' : '4'} fill="#d69d3d" stroke="white" strokeWidth="2" opacity="0.55" onMouseEnter={() => setHoveredChartPoint({ index, metric: 'use' })} onMouseLeave={() => setHoveredChartPoint(null)} />
                <text x={x} y="140" textAnchor="middle" fontSize="11" fill="#789093">{item.month}</text>
                {isHovered && (
                  <g pointerEvents="none">
                    <rect x={tooltipX} y={tooltipY} width="110" height="42" rx="7" fill="#163e44" />
                    <text x={tooltipX + 55} y={tooltipY + 12} textAnchor="middle" fontSize="9" fontWeight="600" fill="white">{item.label}</text>
                    <text x={tooltipX + 55} y={tooltipY + 24} textAnchor="middle" fontSize={activeMetric === 'word' ? '10' : '9'} fontWeight={activeMetric === 'word' ? '700' : '400'} fill="#c9e3e5">Words (parent): {item.wordCount}</text>
                    <text x={tooltipX + 55} y={tooltipY + 35} textAnchor="middle" fontSize={activeMetric === 'use' ? '10' : '9'} fontWeight={activeMetric === 'use' ? '700' : '400'} fill="#efdba8">Use cases (child): {item.useCount}</text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
        <div className="grid grid-cols-3 gap-2 border-t border-[#e9eeee] pt-4 text-center"><div><strong className="text-lg text-[#5270a5]">{stats.newCount}</strong><p className="text-xs text-[#849597]">New</p></div><div><strong className="text-lg text-[#a7731c]">{stats.learningCount}</strong><p className="text-xs text-[#849597]">Learning</p></div><div><strong className="text-lg text-[#30725e]">{stats.familiarCount}</strong><p className="text-xs text-[#849597]">Familiar+</p></div></div>
      </div>
    </section>
  );
}
