import { currentUser } from './_auth.js';
import { getClientIp, json, readBody, sha256 } from './_utils.js';

export async function onRequestPost({ request, env }) {
  try {
    const user = await currentUser(request, env);
    if (!user) return json({ ok: false, error: 'Connecte-toi pour laisser un avis.' }, 401);

    const body = await readBody(request);
    const text = String(body?.content || '').trim();
    const score = Number(body?.rating);
    if (text.length < 5 || text.length > 1000) return json({ ok: false, error: 'Avis invalide (5 à 1000 caractères).' }, 400);
    if (!Number.isInteger(score) || score < 1 || score > 5) return json({ ok: false, error: 'Note invalide.' }, 400);

    const ip = getClientIp(request);
    if (!ip) return json({ ok: false, error: 'Impossible de vérifier ton adresse réseau.' }, 400);
    if (!env.IP_HASH_SECRET) return json({ ok: false, error: 'Configuration serveur incomplète.' }, 500);

    // Only a salted server-side hash is stored; the raw IP never reaches D1.
    const ipHash = await sha256(`${env.IP_HASH_SECRET}:${ip}`);
    const existing = await env.DB.prepare('SELECT id FROM reviews WHERE ip_hash = ? LIMIT 1').bind(ipHash).first();
    if (existing) return json({ ok: false, error: 'Une seule publication d’avis est autorisée par adresse réseau.' }, 409);

    try {
      await env.DB.prepare(`
        INSERT INTO reviews (user_id, username, rating, content, ip_hash)
        VALUES (?, ?, ?, ?, ?)
      `).bind(user.id, user.username, score, text, ipHash).run();
    } catch (error) {
      if (String(error?.message || '').toLowerCase().includes('unique')) {
        return json({ ok: false, error: 'Une seule publication d’avis est autorisée par adresse réseau.' }, 409);
      }
      throw error;
    }

    return json({ ok: true }, 201);
  } catch (error) {
    console.error(error);
    return json({ ok: false, error: 'Erreur serveur.' }, 500);
  }
}
