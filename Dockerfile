FROM nginx:alpine

# Copia el build de Angular al directorio de Nginx
COPY dist/lib-common-angular-demo /usr/share/nginx/html

# Exponer el puerto 80 para Rancher y Nginx Proxy Manager
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
