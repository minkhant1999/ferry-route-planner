# syntax=docker/dockerfile:1

FROM node:22-alpine AS build

WORKDIR /app

# Native deps (sharp / optional platform binaries) on Alpine
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

ARG VITE_OSRM_URL=https://router.project-osrm.org
ENV VITE_OSRM_URL=$VITE_OSRM_URL

# Align with CI: optimize public images when present, then production build
RUN npm run optimize:images
RUN npm run build

FROM nginx:1.27-alpine AS runtime

COPY deploy/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/log/nginx \
    && chmod -R a+rX /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q --spider http://127.0.0.1/ || exit 1

# Official nginx image runs master as root and workers as nginx (required for port 80).
