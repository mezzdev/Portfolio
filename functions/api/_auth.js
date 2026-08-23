import { parseCookies, randomToken, sha256 } from './_utils.js';

const encoder = new TextEncoder();
const ITERATIONS = 210000;

async function derive(password, salt) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: encoder.encode(salt), iterations: ITERATIONS, hash: 'SHA-256' }, key, 256);
  return [...new Uint8Array(bits)].map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function passwordHash(password) {
  const salt = randomToken();
  return `${salt}:${await derive(password, salt)}`;
}

export async function passwordMatches(password, stored) {
  const [salt, expected] = String(stored || '').split(':');
  if (!salt || !expected) return false;
  const actual = await derive(password, salt);
  return actual === expected;
}

export async function currentUser(request, env) {
  const token = parseCookies(request).session;
  if (!token) return null;
  const tokenHash = await sha256(token);
  return await env.DB.prepare(`
    SELECT u.id, u.username
    FROM sessions s JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ? AND s.expires_at > datetime('now')
    LIMIT 1
  `).bind(tokenHash).first();
}
