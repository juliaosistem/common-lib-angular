# Multi-stage build para la demo
FROM node:22.12.0-alpine AS builder

WORKDIR /app

# Copiar package files para aprovechar cache de Docker
COPY package*.json ./
COPY angular.json ./
COPY tsconfig*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Construir la librería primero
RUN npm run build:lib

# Construir la demo
RUN npm run build:demo

# Imagen final optimizada para Nexus/Rancher
FROM nginx:alpine

# Instalar curl para health checks
RUN apk add --no-cache curl

# Copiar archivos construidos de la demo
COPY --from=builder /app/dist/lib-common-angular-demo/browser /usr/share/nginx/html

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

# Labels para Nexus/Rancher
LABEL maintainer="Daniel Juliao <zigmainflables@gmail.com>"
LABEL description="Demo application for lib-common-angular"
LABEL version="1.0"

USER angular

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
