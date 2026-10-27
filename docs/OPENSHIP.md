# Demo Angular en OpenShip

Crear proyecto `demos-dev`, GitHub `juliaosistem/common-lib-angular`, rama
`develop`, raiz `.`, usando el servicio declarado en `openship.json`,
auto-deploy desactivado. El manifiesto no crea el proyecto por si solo.
Dominio propuesto `demos-dev.twincode.site`; confirmar DNS antes de activar TLS.

`deploy/Dockerfile` compila primero `lib-common-angular` y despues su demo.
No necesita artefactos externos en `dist`; el Dockerfile antiguo se conserva.
Inicializar el submodulo fijado por Git antes del build:
`git submodule update --init --recursive`, sin actualizar su revision.
Nexus debe servir las versiones fijadas en `package-lock.json`. Si requiere
autenticacion, usar un secreto BuildKit `npmrc`, nunca tokens en build ARGs.
El importador Compose de OpenShip revisado no modela build secrets.

`ANGULAR_CONFIGURATION=development` es el default; para releases validados
usar `--build-arg ANGULAR_CONFIGURATION=production`. Las URLs de API se
compilan en el bundle y no cambian con variables runtime; deben ser publicas
HTTPS, no nombres privados Docker. Nunca compilar secretos en Angular.

Validar `openship config validate openship.json` y construir con
`docker build -f deploy/Dockerfile -t demos:verify .`; comprobar `/health`,
`/`, assets y una ruta SPA. Nginx corre con UID 101 en 8080;
solo Edge publica 80/443. El despliegue va despues del backend saludable.
Una validacion del manifiesto no demuestra build ni login satisfactorios.

Produccion requiere otro proyecto, dominio y rama `main`/`master`, variables
de build propias y promocion manual de una imagen inmutable aprobada por QA.
