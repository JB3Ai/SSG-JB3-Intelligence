'use client';

import { MapLayer } from '@/lib/types';

export default function LayerToggle({ layers, onToggle }: { layers: MapLayer[]; onToggle: (id: string) => void }) {
  return (
    <div className="absolute top-4 left-4 z-10 bg-zinc-900/95 backdrop-blur-sm border border-zinc-700 rounded-lg p-3 min-w-[200px]">
      <h3 className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mb-2">Map Layers</h3>
      <div className="space-y-1">
        {layers.map((layer) => (
          <button key={layer.id} onClick={() => onToggle(layer.id)}
            className={`flex items-center gap-2 w-full px-2 py-1.5 rounded text-xs transition-all ${layer.visible ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}>
            <span className={`w-3 h-3 rounded-sm border transition-all ${layer.visible ? 'border-transparent' : 'border-zinc-600'}`}
              style={{ backgroundColor: layer.visible ? layer.color : 'transparent' }} />
            <span>{layer.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
