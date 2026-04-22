'use client';

import { getSeverityLevel } from '@/lib/scoring/riskScore';

export default function RiskBadge({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' | 'lg' }) {
  const severity = getSeverityLevel(score);
  const sizeClasses = { sm: 'w-8 h-8 text-xs', md: 'w-12 h-12 text-sm', lg: 'w-16 h-16 text-lg' };

  return (
    <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold font-mono border-2 relative`}
      style={{ borderColor: severity.color, color: severity.color, boxShadow: `0 0 12px ${severity.color}40` }}>
      {score >= 80 && <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: severity.color }} />}
      <span className="relative z-10">{score}</span>
    </div>
  );
}

export function RiskBreakdownBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-0.5">
      <div className="flex justify-between text-[10px]">
        <span className="text-zinc-400">{label}</span>
        <span className="text-zinc-300 font-mono">{value}/{max}</span>
      </div>
      <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
