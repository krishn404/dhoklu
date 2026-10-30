# dhoklu

An editorial, animated personal portfolio for Janhvi (aka dhoklu): an SWE with a soft spot for art, craft, learning and creative gatherings in Pune.

## Run it

1. Add the environment variables below to `.env.local` (or your deployment environment).
2. Run `pnpm install --no-frozen-lockfile`.
3. Run `pnpm dev` and visit `http://localhost:3000`.

## Convex inbox, RSVPs, presence, and admin

Public notes, event RSVPs, and the live visitor indicator are stored in Convex. The dashboard at `/admin` is protected by the Convex-side `ADMIN_USERNAME` and `ADMIN_PASSWORD` check. Use its Events tab to create, edit, publish, unpublish, and delete events; only published future events appear publicly, and each RSVP is attached to one event. No public form collects or sends an email address.

Required environment variables:

- `NEXT_PUBLIC_CONVEX_URL` — your Convex deployment URL.
- `NEXT_PUBLIC_CONVEX_FEATURES` — optional frontend kill switch. Convex features are enabled by default when `NEXT_PUBLIC_CONVEX_URL` is set; set this to `false` to disable them temporarily.
- `ADMIN_USERNAME` — admin login username.
- `ADMIN_PASSWORD` — admin login password.

For local development, authenticate the Convex CLI for the project, then run:

```bash
npx convex dev
```

For production, deploy the Convex functions and schema with `npx convex deploy`. Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` on the same Convex deployment used by the frontend, and set `NEXT_PUBLIC_CONVEX_URL` plus `NEXT_PUBLIC_CONVEX_FEATURES=true` in the frontend deployment environment.

The generated `convex/_generated` directory is intentionally not committed—it is created by the Convex CLI.
