import { db } from './_db.js';
import { clearSessionCookie, hash, json, parseCookies } from './_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { ok: false });
  try {
    const token = parseCookies(req).session;
    if (token) {
      const sql = await db();
      await sql`DELETE FROM sessions WHERE token_hash = ${hash(token)}`;
    }
    clearSessionCookie(res);
    return json(res, 200, { ok: true });
  } catch (error) {
    console.error(error);
    clearSessionCookie(res);
    return json(res, 200, { ok: true });
  }
}
