import { db } from './_db.js';
import { passwordHash } from './_auth.js';
import { json, readBody, validUsername } from './_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'Méthode non autorisée' });
  try {
    const { username, password } = await readBody(req);
    if (!validUsername(String(username || '')) || String(password || '').length < 8) {
      return json(res, 400, { ok: false, error: 'Pseudo invalide ou mot de passe trop court (8 caractères minimum).' });
    }
    const sql = await db();
    const exists = await sql`SELECT id FROM users WHERE lower(username) = lower(${username}) LIMIT 1`;
    if (exists.length) return json(res, 409, { ok: false, error: 'Ce pseudo est déjà utilisé.' });
    await sql`INSERT INTO users (username, password_hash) VALUES (${username}, ${await passwordHash(password)})`;
    return json(res, 201, { ok: true });
  } catch (error) {
    console.error(error);
    return json(res, 500, { ok: false, error: 'Erreur serveur.' });
  }
}
