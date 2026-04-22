'use client';

import { AlertZone } from '@/lib/types';
import { getSeverityLevel } from '@/lib/scoring/riskScore';
import RiskBadge from '@/components/RiskScore/RiskBadge';

function StatusChip({ status }: { status: AlertZone['status'] }) {
  const styles: Record<AlertZone['status'], string> = {
    new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    active: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    escalated: 'bg-red-500/20 text-red-400 border-red-500/30',
    resolved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    false_positive: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
  };
  return <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${styles[status]}`}>{status.replace('_', ' ')}</span>;
}

function MiniBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[9px] text-zinc-600">{label}</span>
      <div className="w-10 h-1 bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${Math.min(value * 100, 100)}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export default function AlertPanel({ alerts, selectedId, onSelect }: { alerts: AlertZone[]; selectedId: string | null; onSelect: (id: string) => void }) {
  const sortedAlerts = [...alerts].sort((a, b) => b.riskScore - a.riskScore);

  return (
    <aside className="w-[380px] bg-zinc-950 border-l border-zinc-800 flex flex-col min-h-0 h-full overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-800">
        <h2 className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">Intelligence Feed</h2>
        <p className="text-xs text-zinc-400 mt-0.5">{alerts.length} active zone{alerts.length !== 1 ? 's' : ''} detected</p>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        {sortedAlerts.map((alert) => {
          const severity = getSeverityLevel(alert.riskScore);
          const isSelected = alert.id === selectedId;
          return (
            <button key={alert.id} onClick={() => onSelect(alert.id)}
              className={`w-full text-left px-4 py-3 border-b border-zinc-800/50 transition-all hover:bg-zinc-900 ${isSelected ? 'bg-zinc-900 border-l-2' : 'border-l-2 border-l-transparent'}`}
              style={{ borderLeftColor: isSelected ? severity.color : 'transparent' }}>
              <div className="flex items-start gap-3">
                <RiskBadge score={alert.riskScore} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-xs font-semibold text-white truncate">{alert.label}</h3>
                    <StatusChip status={alert.status} />
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                    <span>{alert.areaM2}m&sup2;</span>
                    {alert.shaftId && <span className="text-amber-500/70">{alert.shaftProximity}m from {alert.shaftId}</span>}
                  </div>
                  <div className="flex gap-3 mt-1.5">
                    <MiniBar label="NDVI" value={alert.ndviDrop} color="#10b981" />
                    <MiniBar label="BSI" value={alert.bsiLevel} color="#f59e0b" />
                    <MiniBar label="PI" value={alert.plasticIndex} color="#3b82f6" />
                  </div>
                  {alert.notes.length > 0 && <p className="text-[10px] text-zinc-600 mt-1 truncate">{alert.notes[0]}</p>}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="px-4 py-2 border-t border-zinc-800 bg-zinc-950">
        <div className="flex justify-between text-[10px] text-zinc-500">
          <span>CRITICAL: <span className="text-red-400 font-bold">{alerts.filter(a => a.riskScore >= 80).length}</span></span>
          <span>HIGH: <span className="text-orange-400 font-bold">{alerts.filter(a => a.riskScore >= 60 && a.riskScore < 80).length}</span></span>
          <span>MED: <span className="text-amber-400 font-bold">{alerts.filter(a => a.riskScore >= 40 && a.riskScore < 60).length}</span></span>
          <span>LOW: <span className="text-emerald-400 font-bold">{alerts.filter(a => a.riskScore < 40).length}</span></span>
        </div>
      </div>
    </aside>
  );
}
