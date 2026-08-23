import { db } from './_db.js';
import { json } from './_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, []);
  try {
    const sql = await db();
    const rows = await sql`
      SELECT username, rating, content,
        TO_CHAR(created_at AT TIME ZONE 'Europe/Paris', 'DD/MM/YYYY') AS created_at,
        reply,
        CASE WHEN replied_at IS NULL THEN NULL ELSE TO_CHAR(replied_at AT TIME ZONE 'Europe/Paris', 'DD/MM/YYYY') END AS replied_at
      FROM reviews
      ORDER BY created_at DESC
      LIMIT 100
    `;
    return json(res, 200, rows);
  } catch (error) {
    console.error(error);
    return json(res, 500, []);
  }
}
