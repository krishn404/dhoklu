# dhoklu

An editorial, animated personal portfolio for Janhvi (aka dhoklu): an SWE with a soft spot for art, craft, learning and creative gatherings in Pune.

## Run it

1. Add the environment variables below to `.env.local` (or your deployment environment).
2. Run `pnpm install --no-frozen-lockfile`.
3. Run `pnpm dev` and visit `http://localhost:3000`.

## Convex inbox, RSVPs, presence, and admin

Public notes, RSVPs, and the live visitor indicator are stored in Convex. The dashboard at `/admin` is protected by the Convex-side `ADMIN_USERNAME` and `ADMIN_PASSWORD` check. No public form collects or sends an email address.

Required environment variables:

- `NEXT_PUBLIC_CONVEX_URL` — your Convex deployment URL.
- `NEXT_PUBLIC_CONVEX_FEATURES` — set to `true` only after `convex dev --once` has deployed the functions. This prevents public runtime errors while a deployment is unavailable.
- `ADMIN_USERNAME` — admin login username.
- `ADMIN_PASSWORD` — admin login password.

To deploy the schema, functions, auth component, and cron to the existing Convex project, authenticate the Convex CLI for the project, then run:

```bash
npx convex dev
```

The generated `convex/_generated` directory is intentionally not committed—it is created by the Convex CLI.
