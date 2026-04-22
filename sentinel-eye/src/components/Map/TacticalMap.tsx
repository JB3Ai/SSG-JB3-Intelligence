'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AlertZone, MapLayer } from '@/lib/types';
import { minesToGeoJSON, mineBuffersToGeoJSON } from '@/data/abandonedMines';
import { getSeverityLevel } from '@/lib/scoring/riskScore';
import LayerToggle from '@/components/LayerToggle/LayerToggle';
import SatelliteControls from '@/components/Map/SatelliteControls';
import {
  SatelliteLayer,
  buildWmsTileUrl,
  getInstanceIdForLayer,
  getDefaultDateRange,
} from '@/lib/satellite/sentinelHub';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
const SENTINEL_S2_INSTANCE = process.env.NEXT_PUBLIC_SENTINEL_S2_INSTANCE_ID || '';
const SENTINEL_S1_INSTANCE = process.env.NEXT_PUBLIC_SENTINEL_S1_INSTANCE_ID || '';

function alertsToGeoJSON(alerts: AlertZone[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: alerts.map((alert) => ({
      type: 'Feature' as const,
      properties: { id: alert.id, riskScore: alert.riskScore, label: alert.label, status: alert.status, color: getSeverityLevel(alert.riskScore).color, areaM2: alert.areaM2 },
      geometry: { type: 'Point' as const, coordinates: [alert.coordinate.lng, alert.coordinate.lat] },
    })),
  };
}

const DEFAULT_LAYERS: MapLayer[] = [
  { id: 'alerts', label: 'Alert Zones', visible: true, color: '#FF0040' },
  { id: 'mines', label: 'Abandoned Mines', visible: true, color: '#FF8C00' },
  { id: 'buffers', label: 'Buffer Zones (500m)', visible: true, color: '#FF8C0030' },
];

export default function TacticalMap({ alerts, selectedAlertId, onAlertSelect }: { alerts: AlertZone[]; selectedAlertId: string | null; onAlertSelect: (id: string) => void }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [layers, setLayers] = useState<MapLayer[]>(DEFAULT_LAYERS);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Satellite state
  const [activeSatLayer, setActiveSatLayer] = useState<SatelliteLayer | null>(null);
  const [satOpacity, setSatOpacity] = useState(0.7);
  const defaults = getDefaultDateRange();
  const [dateFrom, setDateFrom] = useState(defaults.from);
  const [dateTo, setDateTo] = useState(defaults.to);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    if (!MAPBOX_TOKEN) { console.error('[SENTINEL] No MAPBOX_TOKEN found'); return; }
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const m = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [27.5, -26.4],
      zoom: 8,
      pitch: 30,
      bearing: -10,
      antialias: true,
    });

    m.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'bottom-right');
    m.addControl(new mapboxgl.ScaleControl({ maxWidth: 200, unit: 'metric' }), 'bottom-left');

    m.on('load', () => {
      // Mine buffers
      m.addSource('mine-buffers', { type: 'geojson', data: mineBuffersToGeoJSON() });
      m.addLayer({ id: 'mine-buffers-fill', type: 'fill', source: 'mine-buffers', paint: { 'fill-color': '#FF8C00', 'fill-opacity': 0.08 } });
      m.addLayer({ id: 'mine-buffers-outline', type: 'line', source: 'mine-buffers', paint: { 'line-color': '#FF8C00', 'line-width': 1, 'line-opacity': 0.3, 'line-dasharray': [4, 4] } });

      // Mine points
      m.addSource('mines', { type: 'geojson', data: minesToGeoJSON() });
      m.addLayer({ id: 'mines-points', type: 'circle', source: 'mines', paint: { 'circle-radius': 5, 'circle-color': '#FF8C00', 'circle-stroke-color': '#FFB84D', 'circle-stroke-width': 1, 'circle-opacity': 0.8 } });
      m.addLayer({ id: 'mines-labels', type: 'symbol', source: 'mines', layout: { 'text-field': ['get', 'name'], 'text-size': 10, 'text-offset': [0, 1.5], 'text-anchor': 'top' }, paint: { 'text-color': '#FF8C00', 'text-halo-color': '#000', 'text-halo-width': 1, 'text-opacity': 0.7 } });

      // Alerts
      m.addSource('alerts', { type: 'geojson', data: alertsToGeoJSON(alerts) });
      m.addLayer({ id: 'alerts-pulse', type: 'circle', source: 'alerts', filter: ['>=', ['get', 'riskScore'], 80], paint: { 'circle-radius': 25, 'circle-color': '#FF0040', 'circle-opacity': 0.15 } });
      m.addLayer({ id: 'alerts-points', type: 'circle', source: 'alerts', paint: { 'circle-radius': ['interpolate', ['linear'], ['get', 'riskScore'], 0, 6, 50, 9, 100, 14], 'circle-color': ['get', 'color'], 'circle-stroke-color': '#FFF', 'circle-stroke-width': 2, 'circle-opacity': 0.9 } });
      m.addLayer({ id: 'alerts-labels', type: 'symbol', source: 'alerts', layout: { 'text-field': ['concat', ['get', 'label'], '\n', ['to-string', ['get', 'riskScore']]], 'text-size': 11, 'text-offset': [0, 2], 'text-anchor': 'top', 'text-font': ['DIN Pro Medium', 'Arial Unicode MS Regular'] }, paint: { 'text-color': '#FFF', 'text-halo-color': '#000', 'text-halo-width': 2 } });

      m.on('click', 'alerts-points', (e) => { if (e.features?.[0]?.properties?.id) onAlertSelect(e.features[0].properties.id); });
      m.on('mouseenter', 'alerts-points', () => { m.getCanvas().style.cursor = 'pointer'; });
      m.on('mouseleave', 'alerts-points', () => { m.getCanvas().style.cursor = ''; });

      m.on('click', 'mines-points', (e) => {
        if (e.features?.[0]) {
          const p = e.features[0].properties;
          const coords = (e.features[0].geometry as GeoJSON.Point).coordinates;
          new mapboxgl.Popup({ className: 'tactical-popup', closeButton: true, maxWidth: '280px' })
            .setLngLat(coords as [number, number])
            .setHTML(`<div style="background:#18181b;color:#fff;padding:8px 12px;border-radius:6px;font-size:12px;"><div style="font-weight:bold;color:#FF8C00;">${p?.name}</div><div style="color:#a1a1aa;margin-top:4px;">${p?.commodity} | ${p?.province}<br/>Status: ${p?.status}<br/>${p?.lastInspected ? `Last Inspected: ${p.lastInspected}` : 'Never Inspected'}</div></div>`)
            .addTo(m);
        }
      });
      m.on('mouseenter', 'mines-points', () => { m.getCanvas().style.cursor = 'pointer'; });
      m.on('mouseleave', 'mines-points', () => { m.getCanvas().style.cursor = ''; });

      setMapLoaded(true);
    });

    map.current = m;
    return () => { m.remove(); map.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update alert data
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    const source = map.current.getSource('alerts') as mapboxgl.GeoJSONSource;
    if (source) source.setData(alertsToGeoJSON(alerts));
  }, [alerts, mapLoaded]);

  // Fly to selected alert
  useEffect(() => {
    if (!map.current || !mapLoaded || !selectedAlertId) return;
    const alert = alerts.find((a) => a.id === selectedAlertId);
    if (alert) map.current.flyTo({ center: [alert.coordinate.lng, alert.coordinate.lat], zoom: 14, pitch: 45, duration: 1500 });
  }, [selectedAlertId, alerts, mapLoaded]);

  // Manage satellite raster layer
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    const m = map.current;
    const SAT_LAYER_ID = 'sentinel-raster';
    const SAT_SOURCE_ID = 'sentinel-source';

    // Remove existing satellite layer
    if (m.getLayer(SAT_LAYER_ID)) m.removeLayer(SAT_LAYER_ID);
    if (m.getSource(SAT_SOURCE_ID)) m.removeSource(SAT_SOURCE_ID);

    // Add new one if a layer is selected and configured
    if (activeSatLayer && (SENTINEL_S2_INSTANCE || SENTINEL_S1_INSTANCE)) {
      const instanceId = getInstanceIdForLayer(activeSatLayer, SENTINEL_S1_INSTANCE, SENTINEL_S2_INSTANCE);
      const tileUrl = buildWmsTileUrl(activeSatLayer, instanceId, dateFrom, dateTo);

      m.addSource(SAT_SOURCE_ID, {
        type: 'raster',
        tiles: [tileUrl],
        tileSize: 512,
      });

      // Insert satellite layer below mine buffers so overlays stay on top
      m.addLayer({
        id: SAT_LAYER_ID,
        type: 'raster',
        source: SAT_SOURCE_ID,
        paint: { 'raster-opacity': satOpacity },
      }, 'mine-buffers-fill');
    }
  }, [activeSatLayer, dateFrom, dateTo, mapLoaded]);

  // Update satellite opacity in real-time
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    if (map.current.getLayer('sentinel-raster')) {
      map.current.setPaintProperty('sentinel-raster', 'raster-opacity', satOpacity);
    }
  }, [satOpacity, mapLoaded]);

  // Toggle data layer visibility
  const handleToggle = useCallback((layerId: string) => {
    setLayers((prev) => prev.map((l) => (l.id === layerId ? { ...l, visible: !l.visible } : l)));
    if (!map.current || !mapLoaded) return;
    const visibility = layers.find((l) => l.id === layerId)?.visible ? 'none' : 'visible';
    const mapping: Record<string, string[]> = {
      alerts: ['alerts-points', 'alerts-labels', 'alerts-pulse'],
      mines: ['mines-points', 'mines-labels'],
      buffers: ['mine-buffers-fill', 'mine-buffers-outline'],
    };
    (mapping[layerId] || []).forEach((lid) => { if (map.current?.getLayer(lid)) map.current.setLayoutProperty(lid, 'visibility', visibility); });
  }, [layers, mapLoaded]);

  const handleDateChange = useCallback((from: string, to: string) => {
    setDateFrom(from);
    setDateTo(to);
  }, []);

  return (
    <div className="relative flex-1 h-full">
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Data Layer Controls (top-left) */}
      <LayerToggle layers={layers} onToggle={handleToggle} />

      {/* Satellite Imagery Controls (top-right) */}
      <SatelliteControls
        activeLayer={activeSatLayer}
        onLayerChange={setActiveSatLayer}
        opacity={satOpacity}
        onOpacityChange={setSatOpacity}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateChange={handleDateChange}
        configured={!!(SENTINEL_S2_INSTANCE && SENTINEL_S1_INSTANCE)}
      />

      {!MAPBOX_TOKEN && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-amber-900/90 text-amber-200 text-xs px-4 py-2 rounded-lg border border-amber-700">
          Mapbox token not set. Add <code className="bg-amber-800 px-1 rounded">NEXT_PUBLIC_MAPBOX_TOKEN</code> to <code className="bg-amber-800 px-1 rounded">.env.local</code>
        </div>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-zinc-900/80 backdrop-blur-sm text-zinc-400 text-[10px] font-mono px-3 py-1 rounded-full border border-zinc-800">
        WITWATERSRAND GOLD BELT | SENTINEL EYE ACTIVE
      </div>
    </div>
  );
}
