# BusRoute Planner

School bus route planner — optimize morning pickup and evening drop-off routes on a real map.

## Stack

- React (Vite) + TypeScript + Tailwind CSS
- Ant Design (via project wrappers)
- Redux Toolkit + RTK Query (OSRM routing API)
- React Hook Form + Zod
- Leaflet + OpenStreetMap

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## How to use

1. **Create a route plan** — e.g. "Grade 12 morning route", pick schedule (morning / evening / both).
2. **Set depot & school** — enter names and lat/lng for the bus start point and school.
3. **Add students** — one home location per student (lat/lng).
4. **Optimize** — computes best stop order (nearest-neighbor) and fetches real driving paths via [OSRM](https://project-osrm.org/).
5. **View on map** — blue line = morning (depot → students → school), purple dashed = evening (school → students → depot).

Route plans are saved in `localStorage`.

## Environment

| File | Purpose |
|------|---------|
| `.env` | Local OSRM base URL |
| `.env.uat` | UAT config |
| `.env.prod` | Production config |

Default: `VITE_OSRM_URL=https://router.project-osrm.org`

## Docker (local / VPS)

```bash
docker compose up --build -d
# App: http://localhost:9090
```

After frontend changes, rebuild without cache:

```bash
docker compose build --no-cache && docker compose up -d
```

## Jenkins

Pipeline: checkout `dev` → `docker build` → deploy container on port **9090**.

- First deploy or after UI fixes: run with parameter **DOCKER_NO_CACHE** checked.
- MCP (Cursor): copy `.cursor/mcp.json.example` → `.cursor/mcp.json`, set URL/token, reload MCP servers.

## Project structure

Follows `.cursor/rules/project-structure.mdc` — features under `src/features/routes/`, store under `src/store/`, shared UI in `src/components/`.
