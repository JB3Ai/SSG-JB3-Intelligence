import { NextRequest, NextResponse } from 'next/server';
import { MOCK_ALERTS } from '@/data/mockAlerts';
import { dispatchAlert } from '@/lib/telegram/bot';

export async function POST(req: NextRequest) {
  try {
    const { alertId } = await req.json();

    if (!alertId) {
      return NextResponse.json({ success: false, error: 'Missing alertId' }, { status: 400 });
    }

    const alert = MOCK_ALERTS.find((a) => a.id === alertId);
    if (!alert) {
      return NextResponse.json({ success: false, error: 'Alert not found' }, { status: 404 });
    }

    const result = await dispatchAlert(alert);

    if (result.ok) {
      return NextResponse.json({
        success: true,
        message: `Alert dispatched for ${alert.label}`,
      });
    }

    return NextResponse.json({
      success: false,
      error: result.description || 'Telegram send failed',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
