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

Pipeline (same flow as manual VPS deploy):

1. Git checkout (`dev`)
2. Verify `git`, `docker`, `docker compose`
3. `docker compose up -d --build`
4. Health check `http://localhost:9090/`

Polls GitHub every minute (`pollSCM`). For a full rebuild after UI fixes:

```bash
docker compose build --no-cache && docker compose up -d
```

### VPS setup

```bash
sudo apt update && sudo apt install -y docker.io docker-compose-plugin
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
sudo -u jenkins docker compose version
```

If Jenkins runs in Docker (path `/var/jenkins_home/`), you **must** mount the host socket or builds fail with `docker: not found`:

```bash
docker run -d --name jenkins \
  -p 8080:8080 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts
```

The pipeline installs a Docker CLI in **Verify Tools** when it is missing, but the socket mount is still required.

## Project structure

Follows `.cursor/rules/project-structure.mdc` — features under `src/features/routes/`, store under `src/store/`, shared UI in `src/components/`.
