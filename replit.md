# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite, Tailwind CSS, shadcn/ui, Recharts, Framer Motion, Zustand, React Query

## Application: EAAPA – East Africa Agripreneurs Alliance

A world-class agriculture intelligence and economic platform for East Africa. Combines market intelligence, agribusiness networking, investment marketplace, knowledge ecosystem, and predictive analytics.

### Features
- Live scrolling market data ticker
- Full navigation: About, Programs, Ecosystem, Market Hub, Opportunities, Network, Community, Resources, Events, Impact
- **Market Hub** (PIN-restricted, demo PIN: `1234`):
  - Layer 1: Market Scan Dashboard with 10 commodities, filters, currency conversion (KES/UGX/TZS/RWF/ETB/USD/EUR)
  - Layer 2: Category Data Room with price charts, buyer directory, AI opportunity engine, logistics
  - Layer 3: AI Automation scenario simulator
- **Ecosystem Directory**: 15 members (agripreneurs, investors, mentors, partners), Connect system
- **Opportunities**: 8 investment/funding opportunities
- **Projects**: 6 collaboration projects
- **Community**: Forum threads, mentor network
- **Events**: 6 events with registration
- **Resources**: 6 downloadable resources
- **Impact**: Metrics (4,287 agripreneurs, $284M market value, 18,420 jobs)

### Default Credentials
- Market Hub PIN: `1234` (demo)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server (port 8080)
│   └── eaapa/              # React + Vite frontend (EAAPA platform)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/
│   └── src/seed-eaapa.ts   # Database seed script
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Database Schema Tables
- `members` + `connections` - Agripreneurs, investors, mentors, partners
- `commodities` + `price_history` - Market data for 10 commodities
- `buyers` - Buyer directory
- `market_alerts` - Price spikes, supply gaps, forecasts
- `opportunities` - Investment & funding opportunities
- `projects` + `forum_threads` - Network & community
- `events` + `resources` - Events and knowledge resources
- `success_stories` + `mentors` + `knowledge` - Community content

## Useful Commands

- `pnpm --filter @workspace/api-server run dev` — API server
- `pnpm --filter @workspace/eaapa run dev` — Frontend
- `pnpm --filter @workspace/api-spec run codegen` — Regenerate API client
- `pnpm --filter @workspace/db run push` — Push schema to DB
- `pnpm --filter @workspace/scripts run seed-eaapa` — Re-seed database
- `pnpm run typecheck` — Full typecheck

## API Endpoints (all at /api prefix)
- GET /api/healthz
- GET/POST /api/members, GET /api/members/:id, POST /api/members/:id/connect
- GET /api/commodities, GET /api/commodities/:id
- GET /api/buyers
- GET/POST /api/opportunities
- GET/POST /api/projects, POST /api/projects/:id/join
- GET/POST /api/forum/threads
- GET /api/events, POST /api/events/:id/register
- GET /api/resources
- GET /api/impact/metrics, GET /api/impact/stories
- POST /api/market/verify-pin, GET /api/market/alerts
- GET /api/mentors, GET /api/knowledge
