import { passwordMatches } from './_auth.js';
import { json, readBody, randomToken, sessionCookie, sha256 } from './_utils.js';

export async function onRequestPost({ request, env }) {
  try {
    const body = await readBody(request);
    const username = String(body?.username || '');
    const password = String(body?.password || '');
    const user = await env.DB.prepare('SELECT id, username, password_hash FROM users WHERE lower(username) = lower(?) LIMIT 1').bind(username).first();
    if (!user || !(await passwordMatches(password, user.password_hash))) {
      return json({ ok: false, error: 'Identifiants incorrects.' }, 401);
    }
    const token = randomToken();
    await env.DB.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, datetime(\'now\', \'+7 days\'))')
      .bind(await sha256(token), user.id).run();
    return json({ ok: true, username: user.username }, 200, { 'Set-Cookie': sessionCookie(token) });
  } catch (error) {
    console.error(error);
    return json({ ok: false, error: 'Erreur serveur.' }, 500);
  }
}
