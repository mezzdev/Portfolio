import { clearSessionCookie, json, parseCookies, sha256 } from './_utils.js';

export async function onRequestPost({ request, env }) {
  try {
    const token = parseCookies(request).session;
    if (token) await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha256(token)).run();
  } catch (error) {
    console.error(error);
  }
  return json({ ok: true }, 200, { 'Set-Cookie': clearSessionCookie() });
}
