import { json } from './_utils.js';

export async function onRequestPost({ request, env }) {
  try {
    if (!env.DISCORD_WEBHOOK_URL) return new Response(null, { status: 204 });
    const body = await request.json().catch(() => ({}));
    const safe = (value, fallback = 'Inconnue') => String(value ?? fallback).slice(0, 1000);
    const ip = request.headers.get('CF-Connecting-IP') || 'Inconnue';
    const embed = {
      title: 'Nouvelle visite',
      color: 0x000000,
      fields: [
        { name: 'IP', value: ip, inline: true },
        { name: 'Page', value: safe(body.page), inline: false },
        { name: 'Navigateur', value: safe(body.browser), inline: true },
        { name: 'OS', value: safe(body.os), inline: true },
        { name: 'Résolution', value: safe(body.resolution), inline: true },
        { name: 'Langue', value: safe(body.language), inline: true },
        { name: 'Date / heure', value: safe(body.date), inline: true }
      ],
      footer: { text: 'Mezz Portfolio' }
    };
    const response = await fetch(env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] })
    });
    if (!response.ok) console.error('Discord returned', response.status);
  } catch (error) {
    console.error('visit webhook error:', error);
  }
  return new Response(null, { status: 204 });
}
