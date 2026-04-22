'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import StatusBar from '@/components/StatusBar/StatusBar';
import AlertPanel from '@/components/AlertPanel/AlertPanel';
import AlertDetail from '@/components/AlertPanel/AlertDetail';
import { MOCK_ALERTS, MOCK_SYSTEM_STATUS } from '@/data/mockAlerts';
import { AlertZone } from '@/lib/types';

// Dynamic import for map (needs browser APIs)
const TacticalMap = dynamic(() => import('@/components/Map/TacticalMap'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-zinc-950">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-zinc-500 tracking-widest uppercase">Initializing Tactical Map</p>
      </div>
    </div>
  ),
});

export default function Dashboard() {
  const [alerts] = useState<AlertZone[]>(MOCK_ALERTS);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [detailAlert, setDetailAlert] = useState<AlertZone | null>(null);

  const handleAlertSelect = useCallback(
    (id: string) => {
      setSelectedAlertId(id);
      const alert = alerts.find((a) => a.id === id);
      if (alert) setDetailAlert(alert);
    },
    [alerts]
  );

  const handleCloseDetail = useCallback(() => {
    setDetailAlert(null);
  }, []);

  const handleDispatch = useCallback(async (alert: AlertZone) => {
    // In production, this calls the Telegram API route
    const confirmed = window.confirm(
      `Dispatch SENTINEL ALERT to SSG Command?\n\nLocation: ${alert.label}\nRisk: ${alert.riskScore}/100\nGPS: ${alert.coordinate.lat.toFixed(6)}, ${alert.coordinate.lng.toFixed(6)}`
    );

    if (confirmed) {
      try {
        const res = await fetch('/api/alerts/dispatch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ alertId: alert.id }),
        });
        const data = await res.json();
        if (data.success) {
          window.alert('Alert dispatched to SSG Command.');
        } else {
          window.alert(`Dispatch failed: ${data.error || 'Unknown error'}`);
        }
      } catch {
        window.alert('Telegram not configured. Add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID to .env.local');
      }
    }
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Top Status Bar */}
      <StatusBar status={MOCK_SYSTEM_STATUS} />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative min-h-0">
        {/* Map (Center Stage) */}
        <TacticalMap
          alerts={alerts}
          selectedAlertId={selectedAlertId}
          onAlertSelect={handleAlertSelect}
        />

        {/* Alert Detail (Bottom overlay when selected) */}
        {detailAlert && (
          <AlertDetail
            alert={detailAlert}
            onClose={handleCloseDetail}
            onDispatch={handleDispatch}
          />
        )}

        {/* Intelligence Feed (Right Sidebar) */}
        <AlertPanel
          alerts={alerts}
          selectedId={selectedAlertId}
          onSelect={handleAlertSelect}
        />
      </div>
    </div>
  );
}
