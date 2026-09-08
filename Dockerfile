# Multi-stage: 1) compila y publica lib-common-angular en Nexus 2) build de la demo/docs 3) sirve con nginx
FROM node:22-bookworm AS builder
WORKDIR /workspace

# OpenShip inyecta estos build-args con metadata de CI y credenciales.
ARG NEXUS_USER
ARG NEXUS_PASS
ARG GITHUB_TOKEN
ARG CORE_DTOS_VERSION
ARG BACKEND_LIB_VERSION
ARG OPENSHIP_BRANCH
ARG OPENSHIP_COMMIT_SHA
ARG OPENSHIP_PROJECT
ARG OPENSHIP_PROJECT_NAME
ARG OPENSHIP_PROJECT_SLUG
ARG CI_COMMIT_REF_NAME
ARG CI_COMMIT_SHORT_SHA
ARG BRANCH_NAME
ARG GITHUB_REF_NAME

COPY . /workspace

# npm-all agrega snapshots/releases propios y proxy a npmjs, resuelve @juliaosistem y juliaositembackenexpress.
RUN printf 'registry=https://nexus.twincode.site/repository/npm-all/\n//nexus.twincode.site/repository/npm-all/:_auth=%s\n//nexus.twincode.site/repository/npm-all/:always-auth=true\nstrict-ssl=false\n' \
      "$(printf '%s:%s' "$NEXUS_USER" "$NEXUS_PASS" | base64 -w0)" > .npmrc

RUN npm ci --no-audit --prefer-offline

# Instala las libs internas ya publicadas en Nexus con la versión exacta indicada para esta build.
RUN if [ -n "$CORE_DTOS_VERSION" ]; then npm install "@juliaosistem/core-dtos@${CORE_DTOS_VERSION}" --no-save; fi \
    && if [ -n "$BACKEND_LIB_VERSION" ]; then npm install "juliaositembackenexpress@${BACKEND_LIB_VERSION}" --no-save; fi

# tsconfig.json referencia rutas hermanas del monorepo (../../../back/...): se recrean
# fuera de /workspace con lo instalado desde Nexus, sin tocar el tsconfig para no romper dev local.
RUN mkdir -p /back/lib-core-dtos/node_modules/@juliaosistem/core-dtos \
    && cp -a node_modules/@juliaosistem/core-dtos/. /back/lib-core-dtos/node_modules/@juliaosistem/core-dtos/ \
    && mkdir -p /back/lib/juliaositemBackenNest/dist \
    && cp -a node_modules/juliaositembackenexpress/dist/. /back/lib/juliaositemBackenNest/dist/

RUN NEXUS_USER="$NEXUS_USER" NEXUS_PASS="$NEXUS_PASS" GITHUB_TOKEN="$GITHUB_TOKEN" \
    OPENSHIP_BRANCH="$OPENSHIP_BRANCH" OPENSHIP_COMMIT_SHA="$OPENSHIP_COMMIT_SHA" \
    OPENSHIP_PROJECT="$OPENSHIP_PROJECT" OPENSHIP_PROJECT_NAME="$OPENSHIP_PROJECT_NAME" \
    OPENSHIP_PROJECT_SLUG="$OPENSHIP_PROJECT_SLUG" CI_COMMIT_REF_NAME="$CI_COMMIT_REF_NAME" \
    CI_COMMIT_SHORT_SHA="$CI_COMMIT_SHORT_SHA" BRANCH_NAME="$BRANCH_NAME" GITHUB_REF_NAME="$GITHUB_REF_NAME" \
    npm run deploy:nexus

RUN npm run build:demo

# Etapa final: sirve la demo/documentación como sitio estático.
FROM nginx:alpine

RUN apk add --no-cache curl \
    && addgroup -g 1001 -S angular \
    && adduser -S angular -u 1001 -G angular

COPY --from=builder /workspace/dist/lib-common-angular-demo/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN chown -R angular:angular /usr/share/nginx/html && \
    chown -R angular:angular /var/cache/nginx && \
    chown -R angular:angular /var/log/nginx && \
    chown -R angular:angular /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R angular:angular /var/run/nginx.pid

LABEL maintainer="Daniel Juliao <zigmainflables@gmail.com>"
LABEL description="Documentación/demo de lib-common-angular"

USER angular

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
