# Cloudflare deployment

## 1. Create the D1 database

```bash
npx wrangler d1 create mezz-portfolio
```

Copy the returned database ID into `wrangler.toml` in place of `DATABASE_ID`.

Then initialize the schema:

```bash
npx wrangler d1 execute mezz-portfolio --remote --file=./schema.sql
```

## 2. Cloudflare Pages

Create a Pages project from this GitHub repository.

- Build command: leave empty
- Build output directory: `/`

Pages Functions are automatically detected from `functions/`.

If you use the Cloudflare dashboard instead of Wrangler, add a D1 binding named `DB` pointing to `mezz-portfolio` under the Pages project's Functions/Bindings settings.

## 3. Secrets

Add these as encrypted secrets/environment variables in Cloudflare:

- `DISCORD_WEBHOOK_URL` — the regenerated Discord webhook
- `IP_HASH_SECRET` — a long random secret used to hash visitor IPs for review deduplication

Never commit either value to GitHub.

## 4. Domain

Attach `mezzmonteur.com` to the Pages project in Cloudflare. Keep the frontend and `/api/*` endpoints on the same domain so cookies are same-origin.

## API routes

- `POST /api/register`
- `POST /api/login`
- `POST /api/logout`
- `GET /api/me`
- `GET /api/reviews`
- `POST /api/review`
- `POST /api/visit`

The review endpoint accepts one review per Cloudflare-provided client IP. The raw IP is never stored in D1; only a server-secret hash is stored.
