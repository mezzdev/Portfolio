import { db } from './_db.js';
import { passwordMatches } from './_auth.js';
import { json, readBody, randomToken, hash, setSessionCookie } from './_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'Méthode non autorisée' });
  try {
    const { username, password } = await readBody(req);
    const sql = await db();
    const rows = await sql`SELECT id, username, password_hash FROM users WHERE lower(username) = lower(${String(username || '')}) LIMIT 1`;
    if (!rows.length || !(await passwordMatches(String(password || ''), rows[0].password_hash))) {
      return json(res, 401, { ok: false, error: 'Identifiants incorrects.' });
    }
    const token = randomToken();
    await sql`INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (${hash(token)}, ${rows[0].id}, NOW() + INTERVAL '7 days')`;
    setSessionCookie(res, token);
    return json(res, 200, { ok: true, username: rows[0].username });
  } catch (error) {
    console.error(error);
    return json(res, 500, { ok: false, error: 'Erreur serveur.' });
  }
}
