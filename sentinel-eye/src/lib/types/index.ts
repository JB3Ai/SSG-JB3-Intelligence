export interface Coordinate {
  lng: number;
  lat: number;
}

export interface AlertZone {
  id: string;
  coordinate: Coordinate;
  riskScore: number;
  ndviDrop: number;
  bsiLevel: number;
  plasticIndex: number;
  shaftProximity: number;
  shaftId: string | null;
  detectedAt: string;
  lastSeen: string;
  status: 'new' | 'active' | 'escalated' | 'resolved' | 'false_positive';
  areaM2: number;
  label: string;
  notes: string[];
}

export interface AbandonedMine {
  id: string;
  name: string;
  coordinate: Coordinate;
  commodity: string;
  province: string;
  status: 'abandoned' | 'derelict' | 'care_maintenance';
  bufferRadiusM: number;
  lastInspected: string | null;
}

export interface RiskScoreBreakdown {
  total: number;
  ndviWeight: number;
  bsiWeight: number;
  plasticWeight: number;
  proximityWeight: number;
  recurrenceWeight: number;
  ownershipWeight: number;
}

export interface MapLayer {
  id: string;
  label: string;
  visible: boolean;
  color: string;
}

export interface SystemStatus {
  satelliteHealth: 'online' | 'degraded' | 'offline';
  pipelineStatus: 'running' | 'idle' | 'error';
  lastScanTime: string | null;
  alertCount: number;
  activeZones: number;
}
