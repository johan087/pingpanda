# PingPanda Codebase Instructions

## Architecture Overview

**PingPanda** is a Next.js SaaS application that sends real-time event notifications to Discord. Users create event categories, submit events via API, and receive Discord messages with formatted data.

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **Auth**: Clerk (user authentication)
- **Backend**: Hono framework (edge-ready HTTP framework)
- **Database**: PostgreSQL via Prisma ORM
- **RPC Pattern**: Custom procedure-based routing system (NOT tRPC)
- **Client**: Hono Client with SuperJSON serialization
- **UI**: React 19, TailwindCSS, Radix UI components

## Data Model

Three core entities in `prisma/schema.prisma`:

- **User**: Has `externalId` (Clerk ID), `apiKey`, `plan` (FREE/PRO), quota limits
- **EventCategory**: User-created categories with emoji/color; quota limit 3 (FREE) / 10 (PRO)
- **Event**: Form submissions with JSON fields; quota limit 100/month (FREE) / 1000 (PRO)
- **Quota**: Month-based usage tracking (`userId`, `year`, `month`, `count`)

## RPC Architecture (Custom Hono-based)

**NOT tRPC**. Uses a custom procedure pattern in `src/server/__internals/`:

### Router Structure
1. **Procedures** (`procedures.ts`):
   - `publicProcedure`: No auth required
   - `privateProcedure`: Requires auth (Bearer token or Clerk session)
   - Auth supports both API key (header: `Authorization: Bearer <apiKey>`) and Clerk sessions

2. **Router Pattern** (`__internals/router.ts`):
   - Operations are `.query()` (GET) or `.mutation()` (POST)
   - Input validation with Zod schemas
   - Automatic error handling with HTTPException

3. **Routers** (`routers/`):
   - `auth-router.ts`: User sync with Clerk
   - `category-router.ts`: CRUD operations for event categories
   - `project-router.ts`: Usage/quota queries and Discord configuration
   - `payment-router.ts`: Stripe integration

### Usage Pattern
```typescript
export const projectRouter = router({
  getUsage: privateProcedure.query(async ({ c, ctx }) => {
    return c.superjson({ /* data */ })
  }),
  
  setDiscordID: privateProcedure
    .input(z.object({ discordId: z.string() }))
    .mutation(async ({ c, ctx, input }) => { /* ... */ })
})
```

## Frontend Client Communication

`src/lib/client.ts` exports `baseClient` (Hono Client):
- Automatically handles superjson deserialization
- Type-safe routes from server schema
- Browser uses relative paths, server uses full URLs
- No-store cache policy for all requests

**Client usage**:
```typescript
import { baseClient } from '@/lib/client'
const result = await baseClient.api.project.getUsage.$get()
```

## Key Workflows

### Adding a New API Endpoint
1. Create operation in appropriate router file (`src/server/routers/`)
2. Use `privateProcedure.query()` or `.mutation()`
3. Define Zod schema for `.input()` if needed
4. Return with `c.superjson(data)`
5. Router auto-registers at `/api/{router}/{operation}`

### Database Queries
- Always import from `@/db` (initialized Prisma client)
- Handles Neon adapter with connection pooling
- Logging enabled in dev via `log: ["query", "info", "warn", "error"]`

### Authentication
- **Server Components**: Use `currentUser()` from `@clerk/nextjs/server`
- **API Routes**: Dual auth - check API key first, fall back to Clerk session
- User auto-synced on login via `authRouter.getDatabaseSyncStatus`

### Quota Management
- Tracked in `Quota` table (one row per user/month)
- Plan limits in `src/config.ts` (`FREE_QUOTA`, `PRO_QUOTA`)
- Check before allowing event creation in `category-router`

## Project Structure

```
src/
├── server/              # Hono API layer
│   ├── routers/        # Feature routers (auth, category, payment, project)
│   ├── procedures.ts   # Auth middleware & base procedures
│   └── __internals/    # RPC framework (router, procedure, middleware)
├── app/                # Next.js App Router pages
│   ├── (auth)/        # Clerk-protected auth flows
│   ├── (landing)/     # Public landing page
│   ├── api/           # Dynamic Hono handler
│   └── dashboard/     # Protected dashboard with categories
├── components/         # React UI components
│   └── ui/            # Radix/shadcn UI primitives
├── lib/               # Utilities
│   ├── client.ts      # Hono client initialization
│   ├── discord-client.ts  # Discord API wrapper
│   ├── prisma.ts      # Prisma setup
│   └── validators/    # Zod validation schemas
├── db.ts              # Prisma instance export
└── config.ts          # Quota/plan constants
```

## Common Patterns

### Error Handling
```typescript
if (!user) {
  throw new HTTPException(401, { message: "Unauthorized" })
}
// Router catches and returns JSON with status code
```

### Middleware Composition
```typescript
const customProcedure = privateProcedure
  .use(async ({ ctx, next, c }) => {
    // custom logic
    return next({ customData: value })
  })
```

### Query Variables in Client
```typescript
const [result] = await baseClient.api.category.getEventsByCategory
  .$get({ query: { name: categoryName, period: "week" } })
```

### SuperJSON for Complex Types
Uses SuperJSON for Date/Map serialization between client and server - automatic in all responses.

## Development Commands

```bash
pnpm dev          # Next.js dev server (localhost:3000)
pnpm build        # Production build
pnpm lint         # ESLint check
pnpm start        # Serve production build
```

**Database**:
```bash
pnpm prisma migrate dev --name <description>  # Create migration
pnpm prisma studio                             # Visual DB browser
```

## Important Notes

- **API endpoint base**: `/api` (Hono basePath)
- **All routes typed**: Server router type exported as `AppType`
- **Client-only components**: Mark with `"use client"` (React Query provider, forms)
- **Server components by default**: Async/database queries allowed
- **No environment config file needed**: Uses Next.js .env.local
- **Migrations locked**: Uses PostgreSQL (see `migrations/migration_lock.toml`)
- **Discord integration**: Via `DiscordClient` class; send embeds to DM channels
