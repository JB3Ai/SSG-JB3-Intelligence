'use client';

import { SystemStatus } from '@/lib/types';

function StatusDot({ state }: { state: string }) {
  const colors: Record<string, string> = {
    online: 'bg-emerald-400 shadow-emerald-400/50',
    running: 'bg-emerald-400 shadow-emerald-400/50 animate-pulse',
    idle: 'bg-cyan-400 shadow-cyan-400/50',
    degraded: 'bg-amber-400 shadow-amber-400/50 animate-pulse',
    offline: 'bg-red-500 shadow-red-500/50',
    error: 'bg-red-500 shadow-red-500/50 animate-pulse',
  };
  return <span className={`inline-block w-2 h-2 rounded-full shadow-lg ${colors[state] || colors.offline}`} />;
}

export default function StatusBar({ status }: { status: SystemStatus }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-zinc-950 border-b border-zinc-800">
      <div className="flex items-center gap-5">
        {/* Sentinel Eye Icon */}
        <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-zinc-950 animate-pulse" />
        </div>

        {/* Title + Brands */}
        <div>
          <h1 className="text-xl font-bold text-white tracking-widest leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            SENTINEL EYE
          </h1>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-sm font-semibold tracking-wide text-cyan-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              JB<sup className="text-[10px] font-bold" style={{ verticalAlign: 'super', lineHeight: 0 }}>3</sup>Ai
            </span>
            <span className="text-zinc-600 text-sm font-light">/</span>
            <span className="text-sm font-semibold tracking-wide text-emerald-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              OS<sup className="text-[10px] font-bold" style={{ verticalAlign: 'super', lineHeight: 0 }}>3</sup>
            </span>
            <span className="text-zinc-700 text-xs">|</span>
            <span className="text-xs text-zinc-500 tracking-wider font-medium uppercase">SSG Operations</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2"><StatusDot state={status.satelliteHealth} /><span className="text-xs text-zinc-400">SATELLITE</span></div>
        <div className="flex items-center gap-2"><StatusDot state={status.pipelineStatus} /><span className="text-xs text-zinc-400">PIPELINE</span></div>
        <div className="h-4 w-px bg-zinc-700" />
        <div className="text-xs text-zinc-400"><span className="text-cyan-400 font-mono font-bold">{status.activeZones}</span> Active Zones</div>
        <div className="text-xs text-zinc-400"><span className="text-amber-400 font-mono font-bold">{status.alertCount}</span> Alerts</div>
        <div className="h-4 w-px bg-zinc-700" />
        <div className="text-xs text-zinc-500">
          Last Scan: <span className="text-zinc-300 font-mono">
            {status.lastScanTime ? new Date(status.lastScanTime).toLocaleString('en-ZA', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Never'}
          </span>
        </div>
      </div>
    </header>
  );
}
