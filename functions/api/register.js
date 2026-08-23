import { passwordHash } from './_auth.js';
import { json, readBody, validUsername } from './_utils.js';

export async function onRequestPost({ request, env }) {
  try {
    const body = await readBody(request);
    const username = String(body?.username || '').trim();
    const password = String(body?.password || '');
    if (!validUsername(username) || password.length < 8) {
      return json({ ok: false, error: 'Pseudo invalide ou mot de passe trop court (8 caractères minimum).' }, 400);
    }
    const exists = await env.DB.prepare('SELECT id FROM users WHERE lower(username) = lower(?) LIMIT 1').bind(username).first();
    if (exists) return json({ ok: false, error: 'Ce pseudo est déjà utilisé.' }, 409);
    await env.DB.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').bind(username, await passwordHash(password)).run();
    return json({ ok: true }, 201);
  } catch (error) {
    console.error(error);
    return json({ ok: false, error: 'Erreur serveur.' }, 500);
  }
}
