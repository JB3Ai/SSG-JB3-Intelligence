import { AlertZone } from '@/lib/types';
import { getSeverityLevel } from '@/lib/scoring/riskScore';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

interface TelegramResponse {
  ok: boolean;
  result?: unknown;
  description?: string;
}

export async function sendTelegramMessage(
  text: string,
  chatId: string = TELEGRAM_CHAT_ID
): Promise<TelegramResponse> {
  if (!TELEGRAM_BOT_TOKEN || !chatId) {
    console.warn('[TELEGRAM] Bot token or chat ID not configured');
    return { ok: false, description: 'Not configured' };
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
    return (await res.json()) as TelegramResponse;
  } catch (err) {
    console.error('[TELEGRAM] Send failed:', err);
    return { ok: false, description: String(err) };
  }
}

export async function dispatchAlert(zone: AlertZone): Promise<TelegramResponse> {
  const severity = getSeverityLevel(zone.riskScore);
  const mapsUrl = `https://www.google.com/maps?q=${zone.coordinate.lat},${zone.coordinate.lng}`;

  const message = [
    `<b>SENTINEL EYE ALERT</b>`,
    `<b>Priority:</b> ${severity.label}`,
    `<b>Risk Score:</b> ${zone.riskScore}/100`,
    ``,
    `<b>Location:</b> ${zone.label}`,
    `<b>GPS:</b> ${zone.coordinate.lat.toFixed(6)}, ${zone.coordinate.lng.toFixed(6)}`,
    `<b>Area:</b> ${zone.areaM2}m\u00B2`,
    ``,
    `<b>Indicators:</b>`,
    `  NDVI Drop: ${(zone.ndviDrop * 100).toFixed(1)}%`,
    `  Bare Soil: ${(zone.bsiLevel * 100).toFixed(1)}%`,
    `  Plastic Index: ${(zone.plasticIndex * 100).toFixed(1)}%`,
    ``,
    zone.shaftId
      ? `<b>Nearest Shaft:</b> ${zone.shaftId} (${zone.shaftProximity}m)`
      : `<b>Nearest Shaft:</b> None within range`,
    ``,
    `<b>Map:</b> ${mapsUrl}`,
    ``,
    `<i>Detected: ${new Date(zone.detectedAt).toLocaleString('en-ZA')}</i>`,
  ].join('\n');

  return sendTelegramMessage(message);
}
