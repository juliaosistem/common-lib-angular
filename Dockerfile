# Dockerfile optimizado - usa artefactos ya construidos en Jenkins
FROM nginx:alpine

# Build arguments desde Jenkins
ARG APP_VERSION="unknown"
ARG BUILD_TAG="unknown"
ARG GIT_COMMIT="unknown"

# Instalar curl para health checks
RUN apk add --no-cache curl

# Copiar archivos ya construidos de la demo (desde Jenkins)
COPY dist/lib-common-angular-demo/browser /usr/share/nginx/html

# Configuración de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S angular && \
    adduser -S angular -u 1001 -G angular

# Ajustar permisos
RUN chown -R angular:angular /usr/share/nginx/html && \
    chown -R angular:angular /var/cache/nginx && \
    chown -R angular:angular /var/log/nginx && \
    chown -R angular:angular /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R angular:angular /var/run/nginx.pid

# Labels dinámicos con información de build
LABEL maintainer="Daniel Juliao <zigmainflables@gmail.com>"
LABEL description="Demo application for lib-common-angular"
LABEL version="${APP_VERSION}"
LABEL build.tag="${BUILD_TAG}"
LABEL build.commit="${GIT_COMMIT}"
LABEL build.date="$(date -u +'%Y-%m-%dT%H:%M:%SZ')"

USER angular

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
