import { currentUser } from './_auth.js';
import { json } from './_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { ok: false });
  try {
    const user = await currentUser(req);
    return json(res, 200, user ? { ok: true, username: user.username } : { ok: false });
  } catch (error) {
    console.error(error);
    return json(res, 500, { ok: false });
  }
}
