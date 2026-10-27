# syntax=docker/dockerfile:1
FROM node:22-alpine AS build
WORKDIR /app
ARG ANGULAR_CONFIGURATION=development
COPY package.json package-lock.json ./
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci --no-audit --no-fund
COPY . .
RUN test -f lib-core-dtos/scripts/generate-typescript.js || \
    (echo 'Initialize the pinned lib-core-dtos Git submodule before building' >&2; exit 1)
RUN npm run generate:dtos && \
    npm run build:lib && \
    ./node_modules/.bin/ng build lib-common-angular-demo --configuration "$ANGULAR_CONFIGURATION"

FROM nginxinc/nginx-unprivileged:1.28-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/lib-common-angular-demo/browser /usr/share/nginx/html
USER 101
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:8080/health || exit 1
CMD ["nginx", "-g", "daemon off;"]
