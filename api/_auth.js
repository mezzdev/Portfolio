import crypto from 'node:crypto';
import { db } from './_db.js';
import { hash, parseCookies } from './_utils.js';

export async function currentUser(req) {
  const token = parseCookies(req).session;
  if (!token) return null;
  const sql = await db();
  const rows = await sql`
    SELECT u.id, u.username
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ${hash(token)} AND s.expires_at > NOW()
    LIMIT 1
  `;
  return rows[0] || null;
}

export async function passwordHash(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, key) => err ? reject(err) : resolve(key.toString('hex')));
  });
  return `${salt}:${derived}`;
}

export async function passwordMatches(password, stored) {
  const [salt, expected] = String(stored).split(':');
  if (!salt || !expected) return false;
  const actual = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, key) => err ? reject(err) : resolve(key.toString('hex')));
  });
  return crypto.timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expected, 'hex'));
}
