import { currentUser } from './_auth.js';
import { json } from './_utils.js';

export async function onRequestGet({ request, env }) {
  try {
    const user = await currentUser(request, env);
    return json(user ? { ok: true, username: user.username } : { ok: false });
  } catch (error) {
    console.error(error);
    return json({ ok: false }, 500);
  }
}
