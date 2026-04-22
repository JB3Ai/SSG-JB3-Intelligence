'use client';

import { AlertZone } from '@/lib/types';
import { calculateRiskScore, getSeverityLevel } from '@/lib/scoring/riskScore';
import RiskBadge, { RiskBreakdownBar } from '@/components/RiskScore/RiskBadge';

function DataRow({ label, value, status }: { label: string; value: string; status: 'danger' | 'warn' | 'neutral' }) {
  const colors = { danger: 'text-red-400', warn: 'text-amber-400', neutral: 'text-zinc-300' };
  return (
    <div className="flex justify-between items-center">
      <span className="text-[11px] text-zinc-500">{label}</span>
      <span className={`text-xs font-mono font-bold ${colors[status]}`}>{value}</span>
    </div>
  );
}

export default function AlertDetail({ alert, onClose, onDispatch }: { alert: AlertZone; onClose: () => void; onDispatch: (a: AlertZone) => void }) {
  const severity = getSeverityLevel(alert.riskScore);
  const breakdown = calculateRiskScore(alert, 2, false);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 bg-zinc-950/98 backdrop-blur-md border-t border-zinc-700 max-h-[45vh] overflow-y-auto">
      <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <RiskBadge score={alert.riskScore} size="md" />
          <div>
            <h2 className="text-sm font-bold text-white">{alert.label}</h2>
            <p className="text-xs text-zinc-500">
              {alert.coordinate.lat.toFixed(6)}&deg;S, {alert.coordinate.lng.toFixed(6)}&deg;E
              {alert.shaftId && <span className="ml-2 text-amber-500">{alert.shaftProximity}m from {alert.shaftId}</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onDispatch(alert)} className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded transition-colors">DISPATCH ALERT</button>
          <button onClick={() => window.open(`https://www.google.com/maps?q=${alert.coordinate.lat},${alert.coordinate.lng}`, '_blank')}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded transition-colors">Google Maps</button>
          <button onClick={onClose} className="p-1.5 hover:bg-zinc-800 rounded transition-colors text-zinc-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 p-6">
        <div>
          <h3 className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mb-3">Risk Breakdown</h3>
          <div className="space-y-2">
            <RiskBreakdownBar label="Vegetation Loss (NDVI)" value={breakdown.ndviWeight} max={25} color="#10b981" />
            <RiskBreakdownBar label="Bare Soil (BSI)" value={breakdown.bsiWeight} max={20} color="#f59e0b" />
            <RiskBreakdownBar label="Plastic Index (PI)" value={breakdown.plasticWeight} max={20} color="#3b82f6" />
            <RiskBreakdownBar label="Shaft Proximity" value={breakdown.proximityWeight} max={15} color="#ef4444" />
            <RiskBreakdownBar label="Recurrence" value={breakdown.recurrenceWeight} max={10} color="#a855f7" />
            <RiskBreakdownBar label="Ownership Anomaly" value={breakdown.ownershipWeight} max={10} color="#ec4899" />
          </div>
        </div>
        <div>
          <h3 className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mb-3">Spectral Analysis</h3>
          <div className="space-y-3">
            <DataRow label="NDVI Change" value={`-${(alert.ndviDrop * 100).toFixed(1)}%`} status={alert.ndviDrop > 0.3 ? 'danger' : 'warn'} />
            <DataRow label="Bare Soil Index" value={alert.bsiLevel.toFixed(3)} status={alert.bsiLevel > 0.25 ? 'danger' : 'warn'} />
            <DataRow label="Plastic Index" value={alert.plasticIndex.toFixed(3)} status={alert.plasticIndex > 0.6 ? 'danger' : 'warn'} />
            <DataRow label="Affected Area" value={`${alert.areaM2} m\u00B2`} status="neutral" />
            <DataRow label="Detection Date" value={new Date(alert.detectedAt).toLocaleDateString('en-ZA')} status="neutral" />
            <DataRow label="Last Observed" value={new Date(alert.lastSeen).toLocaleDateString('en-ZA')} status="neutral" />
          </div>
        </div>
        <div>
          <h3 className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mb-3">Intelligence Notes</h3>
          <div className="space-y-2">
            {alert.notes.map((note, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-cyan-500 mt-0.5 text-xs">&#9656;</span>
                <p className="text-xs text-zinc-300 leading-relaxed">{note}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-2 rounded bg-zinc-900 border border-zinc-800">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Classification</p>
            <span className="text-xs font-bold" style={{ color: severity.color }}>{severity.label} PRIORITY</span>
          </div>
        </div>
      </div>
    </div>
  );
}
