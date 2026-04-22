import { AlertZone, RiskScoreBreakdown } from '@/lib/types';

const WEIGHTS = {
  ndvi: 0.25,
  bsi: 0.20,
  plastic: 0.20,
  proximity: 0.15,
  recurrence: 0.10,
  ownership: 0.10,
};

const MAX_SHAFT_DISTANCE = 2000;

export function calculateRiskScore(
  zone: AlertZone,
  recurrenceCount: number = 0,
  ownershipAnomaly: boolean = false
): RiskScoreBreakdown {
  const ndviScore = Math.min(Math.abs(zone.ndviDrop) / 0.5, 1) * 100;
  const bsiScore = Math.min(zone.bsiLevel / 0.4, 1) * 100;
  const plasticScore = Math.min(zone.plasticIndex / 0.8, 1) * 100;
  const proximityScore =
    zone.shaftProximity <= MAX_SHAFT_DISTANCE
      ? ((MAX_SHAFT_DISTANCE - zone.shaftProximity) / MAX_SHAFT_DISTANCE) * 100
      : 0;
  const recurrenceScore = Math.min(recurrenceCount / 5, 1) * 100;
  const ownershipScore = ownershipAnomaly ? 100 : 0;

  const total = Math.round(
    ndviScore * WEIGHTS.ndvi +
    bsiScore * WEIGHTS.bsi +
    plasticScore * WEIGHTS.plastic +
    proximityScore * WEIGHTS.proximity +
    recurrenceScore * WEIGHTS.recurrence +
    ownershipScore * WEIGHTS.ownership
  );

  return {
    total: Math.min(total, 100),
    ndviWeight: Math.round(ndviScore * WEIGHTS.ndvi),
    bsiWeight: Math.round(bsiScore * WEIGHTS.bsi),
    plasticWeight: Math.round(plasticScore * WEIGHTS.plastic),
    proximityWeight: Math.round(proximityScore * WEIGHTS.proximity),
    recurrenceWeight: Math.round(recurrenceScore * WEIGHTS.recurrence),
    ownershipWeight: Math.round(ownershipScore * WEIGHTS.ownership),
  };
}

export function getSeverityLevel(score: number): {
  label: string;
  color: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
} {
  if (score >= 80) return { label: 'CRITICAL', color: '#FF0040', priority: 'critical' };
  if (score >= 60) return { label: 'HIGH', color: '#FF6600', priority: 'high' };
  if (score >= 40) return { label: 'MEDIUM', color: '#FFB800', priority: 'medium' };
  return { label: 'LOW', color: '#00CC66', priority: 'low' };
}
