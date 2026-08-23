import crypto from 'node:crypto';

export function json(res, status, body, headers = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  for (const [key, value] of Object.entries(headers)) res.setHeader(key, value);
  res.end(JSON.stringify(body));
}

export function parseCookies(req) {
  const raw = req.headers.cookie || '';
  return Object.fromEntries(raw.split(';').filter(Boolean).map(part => {
    const i = part.indexOf('=');
    return [part.slice(0, i).trim(), decodeURIComponent(part.slice(i + 1).trim())];
  }));
}

export function setSessionCookie(res, token) {
  res.setHeader('Set-Cookie', `session=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`);
}

export function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', 'session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
}

export function hash(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export function randomToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  return String(forwarded || req.socket?.remoteAddress || '').split(',')[0].trim().replace(/^::ffff:/, '');
}

export function validUsername(username) {
  return /^[a-zA-Z0-9_.-]{2,32}$/.test(username);
}

export async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  const text = Buffer.concat(chunks).toString('utf8');
  return JSON.parse(text);
}
