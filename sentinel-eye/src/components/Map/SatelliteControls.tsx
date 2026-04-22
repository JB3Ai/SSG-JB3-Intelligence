'use client';

import { useState } from 'react';
import {
  SatelliteLayer,
  SATELLITE_LAYER_META,
  getDefaultDateRange,
} from '@/lib/satellite/sentinelHub';

interface SatelliteControlsProps {
  activeLayer: SatelliteLayer | null;
  onLayerChange: (layer: SatelliteLayer | null) => void;
  opacity: number;
  onOpacityChange: (value: number) => void;
  dateFrom: string;
  dateTo: string;
  onDateChange: (from: string, to: string) => void;
  configured: boolean; // whether Sentinel Hub instance ID is set
}

const OPTICAL_LAYERS: SatelliteLayer[] = [
  'TRUE_COLOR', 'FALSE_COLOR', 'NDVI', 'BSI',
  'GEOLOGY', 'MOISTURE_INDEX', 'AGRICULTURE', 'SWIR', 'ATMOSPHERIC_PENETRATION',
];
const SAR_LAYERS: SatelliteLayer[] = ['SAR_VV'];
const LAYER_GROUPS: { label: string; layers: SatelliteLayer[] }[] = [
  { label: 'Optical (Sentinel-2)', layers: OPTICAL_LAYERS },
  { label: 'Radar (Sentinel-1)',   layers: SAR_LAYERS },
];

export default function SatelliteControls({
  activeLayer,
  onLayerChange,
  opacity,
  onOpacityChange,
  dateFrom,
  dateTo,
  onDateChange,
  configured,
}: SatelliteControlsProps) {
  const [expanded, setExpanded] = useState(false);
  const defaults = getDefaultDateRange();

  return (
    <div className="absolute top-4 right-4 z-10 w-[240px]">
      {/* Toggle Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold tracking-wider transition-all ${
          expanded || activeLayer
            ? 'bg-cyan-900/80 text-cyan-300 border border-cyan-700'
            : 'bg-zinc-900/95 text-zinc-400 border border-zinc-700 hover:border-zinc-600'
        } backdrop-blur-sm`}
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
          </svg>
          <span>SATELLITE</span>
        </div>
        {activeLayer && (
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-800 text-cyan-200">
            {SATELLITE_LAYER_META[activeLayer].source}
          </span>
        )}
      </button>

      {/* Expanded Panel */}
      {expanded && (
        <div className="mt-1 bg-zinc-900/95 backdrop-blur-sm border border-zinc-700 rounded-lg p-3 space-y-3 max-h-[calc(100vh-120px)] overflow-y-auto">
          {!configured && (
            <div className="p-2 rounded bg-amber-900/30 border border-amber-800/50 text-[10px] text-amber-300 leading-relaxed">
              Add <code className="bg-amber-900/50 px-1 rounded">NEXT_PUBLIC_SENTINEL_HUB_INSTANCE_ID</code> to .env.local to enable live imagery.
              <br />
              <a href="https://www.sentinel-hub.com/" target="_blank" rel="noopener" className="underline text-amber-200 hover:text-white">
                Get free account
              </a>
            </div>
          )}

          {/* Layer Selection */}
          <div className="space-y-2">
            {LAYER_GROUPS.map((group) => (
              <div key={group.label}>
                <h4 className="text-[9px] text-zinc-500 font-bold tracking-widest uppercase mb-1">{group.label}</h4>
                <div className="space-y-0.5">
                  {group.layers.map((layer) => {
                    const meta = SATELLITE_LAYER_META[layer];
                    const isActive = activeLayer === layer;
                    return (
                      <button
                        key={layer}
                        onClick={() => onLayerChange(isActive ? null : layer)}
                        className={`w-full flex items-start gap-2 px-2 py-1.5 rounded text-left transition-all ${
                          isActive
                            ? 'bg-zinc-800 text-white'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                        }`}
                      >
                        <span
                          className={`mt-0.5 w-2.5 h-2.5 rounded-sm shrink-0 border ${
                            isActive ? 'border-transparent' : 'border-zinc-600'
                          }`}
                          style={{ backgroundColor: isActive ? meta.color : 'transparent' }}
                        />
                        <div>
                          <div className="text-[11px] font-medium">{meta.label}</div>
                          <div className="text-[9px] text-zinc-500 leading-tight">{meta.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Opacity Slider */}
          {activeLayer && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-[9px] text-zinc-500 font-bold tracking-widest uppercase">Opacity</h4>
                <span className="text-[10px] text-zinc-400 font-mono">{Math.round(opacity * 100)}%</span>
              </div>
              <input
                id="sat-opacity"
                name="sat-opacity"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={opacity}
                onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
                aria-label="Satellite layer opacity"
                className="w-full h-1 bg-zinc-700 rounded-full appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
          )}

          {/* Date Range */}
          <div>
            <h4 className="text-[9px] text-zinc-500 font-bold tracking-widest uppercase mb-1.5">Date Range</h4>
            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <label htmlFor="sat-date-from" className="text-[9px] text-zinc-600">From</label>
                <input
                  id="sat-date-from"
                  name="sat-date-from"
                  type="date"
                  value={dateFrom || defaults.from}
                  onChange={(e) => onDateChange(e.target.value, dateTo)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-1.5 py-1 text-[10px] text-zinc-300 focus:outline-none focus:border-cyan-600"
                />
              </div>
              <div>
                <label htmlFor="sat-date-to" className="text-[9px] text-zinc-600">To</label>
                <input
                  id="sat-date-to"
                  name="sat-date-to"
                  type="date"
                  value={dateTo || defaults.to}
                  onChange={(e) => onDateChange(dateFrom, e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-1.5 py-1 text-[10px] text-zinc-300 focus:outline-none focus:border-cyan-600"
                />
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex gap-1">
            {[
              { label: '7d', days: 7 },
              { label: '30d', days: 30 },
              { label: '90d', days: 90 },
              { label: '6m', days: 180 },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  const to = new Date().toISOString().split('T')[0];
                  const from = new Date(Date.now() - preset.days * 86400000).toISOString().split('T')[0];
                  onDateChange(from, to);
                }}
                className="flex-1 py-1 text-[9px] text-zinc-400 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
