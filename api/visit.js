import { getClientIp, json } from './_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { ok: false });
  try {
    const webhook = process.env.DISCORD_WEBHOOK_URL;
    if (!webhook) return json(res, 204, {});

    const body = await new Promise((resolve, reject) => {
      const chunks = [];
      req.on('data', c => chunks.push(c));
      req.on('end', () => {
        try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); }
        catch { reject(new Error('Invalid JSON')); }
      });
      req.on('error', reject);
    });

    const safe = (value, fallback = 'Inconnue') => String(value ?? fallback).slice(0, 1000);
    const embed = {
      title: 'Nouvelle visite',
      color: 0x000000,
      fields: [
        { name: 'IP', value: safe(getClientIp(req)), inline: true },
        { name: 'Page', value: safe(body.page), inline: false },
        { name: 'Navigateur', value: safe(body.browser), inline: true },
        { name: 'OS', value: safe(body.os), inline: true },
        { name: 'Résolution', value: safe(body.resolution), inline: true },
        { name: 'Langue', value: safe(body.language), inline: true },
        { name: 'Date / heure', value: safe(body.date), inline: true }
      ],
      footer: { text: 'Mezz Portfolio' }
    };

    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] })
    });
    if (!response.ok) throw new Error(`Discord returned ${response.status}`);
    return json(res, 204, {});
  } catch (error) {
    console.error('visit webhook error:', error);
    return json(res, 204, {});
  }
}
