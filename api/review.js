import { currentUser } from './_auth.js';
import { db } from './_db.js';
import { getClientIp, hash, json, readBody } from './_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'Méthode non autorisée' });
  try {
    const user = await currentUser(req);
    if (!user) return json(res, 401, { ok: false, error: 'Connecte-toi pour laisser un avis.' });

    const { content, rating } = await readBody(req);
    const text = String(content || '').trim();
    const score = Number(rating);
    if (text.length < 5 || text.length > 1000) return json(res, 400, { ok: false, error: 'Avis invalide (5 à 1000 caractères).' });
    if (!Number.isInteger(score) || score < 1 || score > 5) return json(res, 400, { ok: false, error: 'Note invalide.' });

    const ip = getClientIp(req);
    if (!ip) return json(res, 400, { ok: false, error: 'Impossible de vérifier ton adresse réseau.' });

    // On ne stocke jamais l'IP brute : seul son hash avec un secret serveur est conservé.
    const ipHash = hash(`${process.env.IP_HASH_SECRET || 'CHANGE_ME'}:${ip}`);
    const sql = await db();

    const existing = await sql`SELECT id FROM reviews WHERE ip_hash = ${ipHash} LIMIT 1`;
    if (existing.length) return json(res, 409, { ok: false, error: 'Une seule publication d’avis est autorisée par adresse réseau.' });

    await sql`
      INSERT INTO reviews (user_id, username, rating, content, ip_hash)
      VALUES (${user.id}, ${user.username}, ${score}, ${text}, ${ipHash})
    `;
    return json(res, 201, { ok: true });
  } catch (error) {
    if (error?.code === '23505') return json(res, 409, { ok: false, error: 'Une seule publication d’avis est autorisée par adresse réseau.' });
    console.error(error);
    return json(res, 500, { ok: false, error: 'Erreur serveur.' });
  }
}
