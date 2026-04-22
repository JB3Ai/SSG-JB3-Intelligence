import { AlertZone, SystemStatus } from '@/lib/types';

export const MOCK_ALERTS: AlertZone[] = [
  {
    id: 'ALT-2026-001', coordinate: { lng: 27.3180, lat: -26.1850 }, riskScore: 87,
    ndviDrop: 0.42, bsiLevel: 0.35, plasticIndex: 0.72, shaftProximity: 120, shaftId: 'SAM-004',
    detectedAt: '2026-04-01T03:00:00Z', lastSeen: '2026-04-06T03:00:00Z', status: 'escalated',
    areaM2: 450, label: 'Blyvooruitzicht NE Clearing',
    notes: ['Blue tarp cluster detected - 6+ structures', 'New footpath from R500 confirmed', 'NDVI drop accelerating week-on-week'],
  },
  {
    id: 'ALT-2026-002', coordinate: { lng: 26.7400, lat: -26.8460 }, riskScore: 74,
    ndviDrop: 0.31, bsiLevel: 0.28, plasticIndex: 0.55, shaftProximity: 230, shaftId: 'SAM-001',
    detectedAt: '2026-03-28T03:00:00Z', lastSeen: '2026-04-06T03:00:00Z', status: 'active',
    areaM2: 280, label: 'Stilfontein Shaft 4 Perimeter',
    notes: ['Moderate plastic signature', 'Ground disturbance confirmed via BSI', 'Vehicle tracks visible in HR imagery'],
  },
  {
    id: 'ALT-2026-003', coordinate: { lng: 27.8620, lat: -26.2340 }, riskScore: 62,
    ndviDrop: 0.25, bsiLevel: 0.22, plasticIndex: 0.48, shaftProximity: 380, shaftId: 'SAM-003',
    detectedAt: '2026-04-03T03:00:00Z', lastSeen: '2026-04-06T03:00:00Z', status: 'new',
    areaM2: 150, label: 'Durban Deep South Adit',
    notes: ['Fresh clearing detected 3 days ago', 'Below plastic threshold but BSI rising'],
  },
  {
    id: 'ALT-2026-004', coordinate: { lng: 28.0820, lat: -26.2120 }, riskScore: 51,
    ndviDrop: 0.18, bsiLevel: 0.30, plasticIndex: 0.35, shaftProximity: 450, shaftId: 'SAM-006',
    detectedAt: '2026-04-05T03:00:00Z', lastSeen: '2026-04-06T03:00:00Z', status: 'new',
    areaM2: 90, label: 'Simmer & Jack East',
    notes: ['Small clearing - monitoring required', 'Could be construction related'],
  },
  {
    id: 'ALT-2026-005', coordinate: { lng: 26.8050, lat: -26.8920 }, riskScore: 43,
    ndviDrop: 0.15, bsiLevel: 0.19, plasticIndex: 0.30, shaftProximity: 490, shaftId: 'SAM-011',
    detectedAt: '2026-04-04T03:00:00Z', lastSeen: '2026-04-06T03:00:00Z', status: 'new',
    areaM2: 60, label: 'Hartebeestfontein West Ridge',
    notes: ['Borderline detection - possible rainfall artifact'],
  },
  {
    id: 'ALT-2026-006', coordinate: { lng: 27.4520, lat: -26.3210 }, riskScore: 35,
    ndviDrop: 0.12, bsiLevel: 0.15, plasticIndex: 0.22, shaftProximity: 600, shaftId: null,
    detectedAt: '2026-04-02T03:00:00Z', lastSeen: '2026-04-06T03:00:00Z', status: 'new',
    areaM2: 40, label: 'Vlakfontein Outlier',
    notes: ['Outside buffer zone - low confidence', 'Likely agricultural activity'],
  },
];

export const MOCK_SYSTEM_STATUS: SystemStatus = {
  satelliteHealth: 'online',
  pipelineStatus: 'idle',
  lastScanTime: '2026-04-06T03:00:00Z',
  alertCount: MOCK_ALERTS.length,
  activeZones: MOCK_ALERTS.filter((a) => a.status !== 'resolved' && a.status !== 'false_positive').length,
};
