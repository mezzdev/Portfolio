import { json } from './_utils.js';

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT username, rating, content,
        strftime('%d/%m/%Y', created_at) AS created_at,
        reply,
        CASE WHEN replied_at IS NULL THEN NULL ELSE strftime('%d/%m/%Y', replied_at) END AS replied_at
      FROM reviews
      ORDER BY created_at DESC
      LIMIT 100
    `).all();
    return json(results || []);
  } catch (error) {
    console.error(error);
    return json([], 500);
  }
}
