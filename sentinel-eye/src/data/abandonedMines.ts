import { AbandonedMine } from '@/lib/types';

export const ABANDONED_MINES: AbandonedMine[] = [
  { id: 'SAM-001', name: 'Stilfontein Gold Mine', coordinate: { lng: 26.7383, lat: -26.8447 }, commodity: 'Gold', province: 'North West', status: 'abandoned', bufferRadiusM: 500, lastInspected: '2025-08-15' },
  { id: 'SAM-002', name: 'Buffelsfontein Gold Mine', coordinate: { lng: 26.7750, lat: -26.8800 }, commodity: 'Gold', province: 'North West', status: 'abandoned', bufferRadiusM: 500, lastInspected: '2025-06-10' },
  { id: 'SAM-003', name: 'Durban Roodepoort Deep', coordinate: { lng: 27.8601, lat: -26.2328 }, commodity: 'Gold', province: 'Gauteng', status: 'derelict', bufferRadiusM: 500, lastInspected: null },
  { id: 'SAM-004', name: 'Blyvooruitzicht Gold Mine', coordinate: { lng: 27.3170, lat: -26.1900 }, commodity: 'Gold', province: 'Gauteng', status: 'abandoned', bufferRadiusM: 500, lastInspected: '2025-11-22' },
  { id: 'SAM-005', name: 'Margaret Shaft (Carletonville)', coordinate: { lng: 27.3200, lat: -26.1800 }, commodity: 'Gold', province: 'Gauteng', status: 'abandoned', bufferRadiusM: 500, lastInspected: '2025-03-01' },
  { id: 'SAM-006', name: 'Simmer & Jack Mines', coordinate: { lng: 28.0800, lat: -26.2100 }, commodity: 'Gold', province: 'Gauteng', status: 'derelict', bufferRadiusM: 500, lastInspected: null },
  { id: 'SAM-007', name: 'ERPM (East Rand Proprietary Mines)', coordinate: { lng: 28.2300, lat: -26.2000 }, commodity: 'Gold', province: 'Gauteng', status: 'abandoned', bufferRadiusM: 500, lastInspected: '2024-12-05' },
  { id: 'SAM-008', name: 'Vlakfontein Gold Mine', coordinate: { lng: 27.4500, lat: -26.3200 }, commodity: 'Gold', province: 'Gauteng', status: 'abandoned', bufferRadiusM: 500, lastInspected: '2025-07-18' },
  { id: 'SAM-009', name: 'Kromdraai Mine (West Rand)', coordinate: { lng: 27.7200, lat: -26.0100 }, commodity: 'Gold', province: 'Gauteng', status: 'care_maintenance', bufferRadiusM: 500, lastInspected: '2026-01-12' },
  { id: 'SAM-010', name: 'Machavie Gold Mine', coordinate: { lng: 27.0700, lat: -26.7500 }, commodity: 'Gold', province: 'North West', status: 'abandoned', bufferRadiusM: 500, lastInspected: null },
  { id: 'SAM-011', name: 'Hartebeestfontein Mine', coordinate: { lng: 26.8100, lat: -26.8900 }, commodity: 'Gold', province: 'North West', status: 'abandoned', bufferRadiusM: 500, lastInspected: '2025-09-30' },
  { id: 'SAM-012', name: 'Consolidated Main Reef', coordinate: { lng: 27.9100, lat: -26.1900 }, commodity: 'Gold', province: 'Gauteng', status: 'derelict', bufferRadiusM: 500, lastInspected: null },
];

export function minesToGeoJSON(): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: ABANDONED_MINES.map((mine) => ({
      type: 'Feature' as const,
      properties: { id: mine.id, name: mine.name, commodity: mine.commodity, province: mine.province, status: mine.status, bufferRadiusM: mine.bufferRadiusM, lastInspected: mine.lastInspected },
      geometry: { type: 'Point' as const, coordinates: [mine.coordinate.lng, mine.coordinate.lat] },
    })),
  };
}

export function mineBuffersToGeoJSON(): GeoJSON.FeatureCollection {
  const features = ABANDONED_MINES.map((mine) => {
    const points = 64;
    const coords: number[][] = [];
    const radiusDeg = mine.bufferRadiusM / 111320;
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * 2 * Math.PI;
      coords.push([mine.coordinate.lng + radiusDeg * Math.cos(angle), mine.coordinate.lat + radiusDeg * Math.sin(angle)]);
    }
    return {
      type: 'Feature' as const,
      properties: { id: mine.id, name: mine.name, status: mine.status },
      geometry: { type: 'Polygon' as const, coordinates: [coords] },
    };
  });
  return { type: 'FeatureCollection', features };
}
