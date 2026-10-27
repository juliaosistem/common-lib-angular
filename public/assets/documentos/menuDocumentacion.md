# Documentación Técnica - Menú Dashboard3, Rutas y Seguridad

## 1. Objetivo

Documentar cómo funciona actualmente la capa de navegación del Dashboard3, cómo se integran menú y rutas en fn-admin, cuál es el estado real de seguridad en frontend y cómo planear la codificación de protección de rutas con estándares fuertes, alineado con la documentación de usuarios.

Esta documentación no implementa cambios. Solo describe estado actual, riesgos y plan recomendado.

---

## 2. Alcance auditado

Se revisaron estos componentes principales:

- Menu principal de fn-admin: [front/fn-admin/src/app/menu-configs.ts](front/fn-admin/src/app/menu-configs.ts)
- Rutas de fn-admin: [front/fn-admin/src/app/routes/app.routes.ts](front/fn-admin/src/app/routes/app.routes.ts)
- Layout Dashboard3: [front/lib/common-lib-angular/projects/lib-common-angular/src/lib/componentes/daskboards/daskboard3/daskboard3.ts](front/lib/common-lib-angular/projects/lib-common-angular/src/lib/componentes/daskboards/daskboard3/daskboard3.ts)
- Contenedor de menú Dashboard3: [front/lib/common-lib-angular/projects/lib-common-angular/src/lib/componentes/daskboards/daskboard3/moleculas/menu/menu.component.ts](front/lib/common-lib-angular/projects/lib-common-angular/src/lib/componentes/daskboards/daskboard3/moleculas/menu/menu.component.ts)
- Menú dinámico Dashboard3: [front/lib/common-lib-angular/projects/lib-common-angular/src/lib/componentes/daskboards/daskboard3/atoms/dynamic-menu1/dynamic-menu1.component.ts](front/lib/common-lib-angular/projects/lib-common-angular/src/lib/componentes/daskboards/daskboard3/atoms/dynamic-menu1/dynamic-menu1.component.ts)
- Item visual de menú: [front/lib/common-lib-angular/projects/lib-common-angular/src/lib/componentes/shared/atoms/menu-item1/menu-item1.component.html](front/lib/common-lib-angular/projects/lib-common-angular/src/lib/componentes/shared/atoms/menu-item1/menu-item1.component.html)
- Lógica de permisos del menú: [front/lib/common-lib-angular/projects/lib-common-angular/src/lib/componentes/shared/interfaces/menu.interface.ts](front/lib/common-lib-angular/projects/lib-common-angular/src/lib/componentes/shared/interfaces/menu.interface.ts)
- Seguridad de sesión/token frontend: [front/lib/common-lib-angular/projects/lib-common-angular/src/lib/services/auth-service.ts](front/lib/common-lib-angular/projects/lib-common-angular/src/lib/services/auth-service.ts)
- Contrato de seguridad backend usuarios: [back/mcs-parent/bussinesDomain/usuarios/src/main/java/twinscode/usuarios/api/controller/DcUsuariosController.md](back/mcs-parent/bussinesDomain/usuarios/src/main/java/twinscode/usuarios/api/controller/DcUsuariosController.md)

---

## 3. Arquitectura actual de navegación

### 3.1 Layout raíz

En fn-admin, la ruta base carga Dashboard3 como contenedor principal y le inyecta:

- menuConfig: defaultMenuConfig
- userPermissions: permissionConfigs.user

Referencia: [front/fn-admin/src/app/routes/app.routes.ts](front/fn-admin/src/app/routes/app.routes.ts)

### 3.2 Rutas hijas bajo Dashboard3

Bajo el layout se exponen múltiples rutas funcionales:

- design
- products
- usuarios
- programacion-semanal
- admin/updateDisig
- bloque completo crm-whats con muchas subrutas

Todas están configuradas como children del mismo bloque raíz.

Referencia: [front/fn-admin/src/app/routes/app.routes.ts](front/fn-admin/src/app/routes/app.routes.ts)

### 3.3 Login

La ruta login está separada como ruta propia fuera del bloque principal.

Referencia: [front/fn-admin/src/app/routes/app.routes.ts](front/fn-admin/src/app/routes/app.routes.ts)

---

## 4. Flujo real del menú en Dashboard3

### 4.1 Inyección del menú

Dashboard3 recibe por Input menuConfig y userPermissions, y renderiza el componente lib-menu.

Referencia: [front/lib/common-lib-angular/projects/lib-common-angular/src/lib/componentes/daskboards/daskboard3/daskboard3.ts](front/lib/common-lib-angular/projects/lib-common-angular/src/lib/componentes/daskboards/daskboard3/daskboard3.ts)

### 4.2 Render del menú

lib-menu delega en app-dynamic-menu1 y le entrega configuración, id de menú y permisos.

Referencia: [front/lib/common-lib-angular/projects/lib-common-angular/src/lib/componentes/daskboards/daskboard3/moleculas/menu/menu.component.html](front/lib/common-lib-angular/projects/lib-common-angular/src/lib/componentes/daskboards/daskboard3/moleculas/menu/menu.component.html)

### 4.3 Filtro por permisos

DynamicMenu1 construye MenuManager y luego aplica filtro por permisos cuando hay userPermissions.

Referencia: [front/lib/common-lib-angular/projects/lib-common-angular/src/lib/componentes/daskboards/daskboard3/atoms/dynamic-menu1/dynamic-menu1.component.ts](front/lib/common-lib-angular/projects/lib-common-angular/src/lib/componentes/daskboards/daskboard3/atoms/dynamic-menu1/dynamic-menu1.component.ts)

La regla de permisos actual del MenuManager es:

- Si el item no define permissions, se permite.
- Si define permissions, basta con coincidencia de alguno.

Referencia: [front/lib/common-lib-angular/projects/lib-common-angular/src/lib/componentes/shared/interfaces/menu.interface.ts](front/lib/common-lib-angular/projects/lib-common-angular/src/lib/componentes/shared/interfaces/menu.interface.ts)

### 4.4 Navegación final

Cada item dibuja su enlace con routerLink y navega por Angular Router. No hay verificación de seguridad adicional en el click del item.

Referencia: [front/lib/common-lib-angular/projects/lib-common-angular/src/lib/componentes/shared/atoms/menu-item1/menu-item1.component.html](front/lib/common-lib-angular/projects/lib-common-angular/src/lib/componentes/shared/atoms/menu-item1/menu-item1.component.html)

---

## 5. Estado actual de seguridad de rutas

## 5.1 Lo que sí existe

- Gestión de sesión en frontend usando AuthService.
- Persistencia de businessToken y keycloakAccessToken.
- Validación básica de expiración por claim exp en cliente.

Referencia: [front/lib/common-lib-angular/projects/lib-common-angular/src/lib/services/auth-service.ts](front/lib/common-lib-angular/projects/lib-common-angular/src/lib/services/auth-service.ts)

## 5.2 Lo que falta en frontend de rutas

- No hay canActivate.
- No hay canMatch.
- No hay guard global para ramas privadas.
- No hay guard por permiso en rutas críticas.

Referencia: [front/fn-admin/src/app/routes/app.routes.ts](front/fn-admin/src/app/routes/app.routes.ts)

Conclusión: el menú oculta/filtra visualmente, pero no protege navegación directa por URL.

---

## 6. Alineación con seguridad del micro usuarios

Según la documentación del micro:

- Endpoints protegidos requieren Authorization Bearer.
- Para CRUD de negocio se debe usar businessToken.
- El backend valida firma HS512 y expiración del businessToken.
- idBusiness y usuario pueden derivarse del token en backend.

Referencia: [back/mcs-parent/bussinesDomain/usuarios/src/main/java/twinscode/usuarios/api/controller/DcUsuariosController.md](back/mcs-parent/bussinesDomain/usuarios/src/main/java/twinscode/usuarios/api/controller/DcUsuariosController.md)

Esto significa que la seguridad fuerte está principalmente en backend, y frontend debe reforzar acceso y consistencia de envío de token para reducir superficie de ataque y mejorar comportamiento.

---

## 7. Hallazgos de riesgo concretos

1. Rutas privadas sin guards de acceso.
2. userPermissions inyectado estáticamente como perfil user en data de ruta.
3. Menú de fn-admin con muchos items sin permissions explícitos.
4. Inconsistencia en envío de token entre servicios:
	- Unos usan Authorization Bearer.
	- Otros envían header token custom.
5. Existen fallbacks inseguros en metadatos/sesión con valores default:
	- idbusiness 1
	- usuario admin
	- idDatosUsuario userX
6. Posibles incoherencias de redirects en app.routes.
7. Duplicidad de id crm-monitor en menu-configs.
8. Falta control de permisos en acciones default del CRUD:
	- crear (toolbar)
	- editar (acciones por fila)
	- eliminar individual y masivo
	Actualmente son visibles/ejecutables sin una política unificada por permiso.

---

## 8. Modelo de amenaza ofensiva

Escenario pedido: pensar como atacante y asumir 3 IAs intentando acceder a rutas y datos.

### 8.1 Qué intentaría un atacante automatizado

1. Enumeración masiva de rutas por diccionario.
2. Navegación directa por URL a módulos internos.
3. Manipulación de sessionStorage para falsear idbusiness, usuario o token.
4. Reuso de tokens expirados o no correspondientes al contexto.
5. Pruebas de diferencia entre endpoints que esperan Authorization vs token custom.
6. Exploración de errores de redirección para alcanzar vistas no previstas.

### 8.2 Qué evita cada defensa

- Guards de autenticación: bloquean URL directas sin sesión válida.
- Guards de autorización por permiso/rol: bloquean acceso lateral entre módulos.
- Interceptor único de auth: evita inconsistencias de token por servicio.
- Validaciones backend por firma/exp/claims: anulan tokens manipulados.
- Observabilidad de rechazos: detecta patrones de ataque automatizado.

---

## 9. Plan recomendado para codificación de protección de rutas

Este es el plan recomendado para implementar después de aprobación.

### 9.1 Fase 1 - Cierre de acceso básico

1. Crear guard global de autenticación para rama privada del dashboard.
2. Bloquear acceso si no hay businessToken o exp inválido.
3. Redirigir de forma controlada a login.

### 9.2 Fase 2 - Autorización por política

1. Definir metadata de permisos por ruta crítica.
2. Implementar guard de autorización por roles/permisos desde claims.
3. Aplicar canActivate en rutas sensibles y canMatch en módulos lazy.

### 9.3 Fase 3 - Normalización de token HTTP

1. Implementar interceptor unificado.
2. Regla principal:
	- businessToken para CRUD de negocio.
	- keycloakAccessToken solo cuando endpoint lo requiera.
3. Eliminar envío manual ad-hoc por servicio.

### 9.3.1 Extensión obligatoria - Autorización de botones CRUD

1. Incorporar control por permiso en acciones default de lib-crud:
	- botón crear
	- botón editar
	- botón eliminar
	- eliminar seleccionados
2. El control debe ser reusable y declarativo, no hardcodeado por pantalla.
3. Cada acción del CRUD debe mapearse a un permiso backend explícito.
4. Si el usuario no tiene permiso:
	- botón deshabilitado u oculto según política
	- evento bloqueado en componente para evitar bypass de UI

### 9.3.2 Matriz de permisos para CRUD (base inicial)

- VER_USUARIOS
- REGISTRAR_USUARIOS
- ACTUALIZAR_USUARIOS
- ELIMINAR_USUARIOS
- VER_PRODUCTOS
- CREAR_PRODUCTOS
- ACTUALIZAR_PRODUCTOS
- ELIMINAR_PRODUCTOS
- CREAR_TRABAJOS
- ACTUALIZAR_TRABAJOS
- ELIMINAR_TRABAJOS

Regla especial:

- Si existe permiso TODOS, se habilitan todas las acciones de ese módulo.

Roles con permiso TODOS según matriz actual:

- ADMINISTRADOR
- SUPER_ADMIN

### 9.4 Fase 4 - Endurecimiento adicional

1. Remover defaults inseguros en metadata de sesión.
2. Limpiar sesión ante anomalía de claims.
3. Registrar intentos de acceso bloqueados para auditoría.

### 9.5 Fase 5 - Verificación y pruebas

1. Casos de navegación sin token.
2. Casos con token expirado.
3. Casos con permiso insuficiente.
4. Casos de manipulación de sessionStorage.
5. Pruebas de consistencia Authorization en endpoints.

---

## 10. Justificación de seguridad

Implementar este plan es recomendable porque:

1. Menú visible no equivale a control de acceso real.
2. La seguridad del backend ya está bien orientada y se debe alinear el frontend para no abrir brechas de navegación.
3. Frente a ataques automatizados por IA, la defensa efectiva es en capas:
	- bloqueo en routing
	- autorización por política
	- token consistente en transporte
	- validación criptográfica en backend
	- trazabilidad de intentos

---


