import * as login from './functions/api/login.js';
import * as logout from './functions/api/logout.js';
import * as me from './functions/api/me.js';
import * as register from './functions/api/register.js';
import * as review from './functions/api/review.js';
import * as reviews from './functions/api/reviews.js';
import * as visit from './functions/api/visit.js';

const routes = {
  '/api/login': login,
  '/api/logout': logout,
  '/api/me': me,
  '/api/register': register,
  '/api/review': review,
  '/api/reviews': reviews,
  '/api/visit': visit,
};

function methodName(method) {
  return method === 'GET' ? 'onRequestGet' : method === 'POST' ? 'onRequestPost' : null;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const route = routes[url.pathname];

    if (route) {
      const handlerName = methodName(request.method);
      const handler = handlerName && route[handlerName];

      if (!handler) {
        return new Response('Method Not Allowed', {
          status: 405,
          headers: { Allow: Object.keys(route).filter((key) => key.startsWith('onRequest')).map((key) => key.replace('onRequest', '').toUpperCase()).join(', ') },
        });
      }

      return handler({ request, env, ctx, params: {} });
    }

    return env.ASSETS.fetch(request);
  },
};
