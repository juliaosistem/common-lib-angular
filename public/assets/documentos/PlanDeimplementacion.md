# Plan de Implementacion - Seguridad de Rutas Reutilizable (Multi-Frontend)

## 1. Proposito

Definir un plan de accion reutilizable para proteger rutas y acceso a datos en los frontales del ecosistema Twins Code, sin romper el patron actual basado en common-lib-angular, NGXS y DTOs compartidos.

Este plan no aplica codificacion aun. Es una guia de ejecucion por fases para aprobacion.

---

## 2. Contexto consolidado revisado

Se revisaron estados, login, rutas, menus y capa HTTP en:

- common-lib-angular (libreria reusable)
- fn-admin (consumidor principal del dashboard/menu)
- zigmaFront (consumidor con interceptor legacy)
- fn-workingDog (consumidor con trazas de guards pendientes)

### Hallazgos estructurales importantes

1. El patron NGXS reusable ya existe y es fuerte:
	- GenericCrudState
	- createGenericCrudActions
	- LazyGenericCrudHttpService

2. La autenticacion ya prioriza businessToken, alineado con backend.

3. El menu filtra visibilidad por permisos, pero rutas no estan protegidas con guards en fn-admin.

4. Hay inconsistencia de headers de auth entre servicios:
	- algunos usan Authorization Bearer
	- otros usan header token

5. Hay defaults inseguros en metadatos de sesion (idbusiness 1, usuario admin, userX) que deben endurecerse para produccion.
6. El CRUD reusable no tiene aún una capa estándar para deshabilitar acciones default (crear, editar, eliminar) según permisos del rol.

---

## 3. Objetivo de arquitectura reusable

La seguridad de rutas debe quedar como capacidad transversal de libreria, no como implementacion puntual de un solo frontal.

### Objetivo tecnico

Construir un Security Kit reusable en common-lib-angular con:

1. Guard de autenticacion base
2. Guard de autorizacion por permisos/roles
3. Interceptor unificado de token
4. Resolver central de politica por ruta
5. Utilidades de sesion seguras
6. Capa de autorización de acciones CRUD (UI + evento) por permisos

Cada frontal solo configura politicas y rutas, sin duplicar logica.

---

## 4. Principios de diseno (reutilizacion maxima)

1. Libreria primero
	- Toda logica transversal va en common-lib-angular.

2. Consumidor ligero
	- fn-admin, zigmaFront y otros solo declaran rutas + permisos.

3. Compatibilidad con contratos existentes
	- mantener PlantillaResponse
	- mantener QueryParams
	- mantener NGXS actual

4. Alineacion con backend usuarios
	- businessToken para CRUD negocio
	- keycloak access token solo para validaciones puntuales
	- backend sigue siendo autoridad final (firma HS512 y expiracion)

5. Seguridad por capas
	- ocultar menu no es seguridad
	- guard + interceptor + backend + auditoria

---

## 5. Plan de accion por fases

## Fase 0 - Baseline y reglas comunes

### Objetivo

Congelar convenciones para todos los frontales antes de mover codigo.

### Actividades

1. Definir matriz de tipos de ruta:
	- publica
	- privada
	- privada con permiso
	- privada con permiso y contexto de negocio

2. Definir matriz de tokens por endpoint:
	- businessToken (default)
	- keycloak token (casos explicitos)

3. Definir formato de metadata de seguridad por ruta (data.security).
4. Definir catálogo de permisos funcionales compartido por librería.
5. Definir política de herencia por permiso TODOS.

### Matriz RBAC base (confirmada)

Roles:

1. ADMINISTRADOR
2. SUPER_ADMIN
3. COORDINADOR_BODEGA
4. VENDEDOR
5. COSTURERO
6. USUARIO

Permisos (con foco frontend):

1. VER_USUARIOS
2. REGISTRAR_USUARIOS
3. ACTUALIZAR_USUARIOS
4. ELIMINAR_USUARIOS
5. VER_ROLES
6. CREAR_ROLES
7. ACTUALIZAR_ROLES
8. ELIMINAR_ROLES
9. CREAR_TRABAJOS
10. ACTUALIZAR_TRABAJOS
11. ELIMINAR_TRABAJOS
12. VER_TRABAJOS_POR_EMPLEADO
13. VER_TODOS_LOS_TRABAJOS
14. VER_PRODUCTOS
15. CREAR_PRODUCTOS
16. ACTUALIZAR_PRODUCTOS
17. ELIMINAR_PRODUCTOS
18. VER_PEDIDOS
19. CREAR_PEDIDOS
20. ACTUALIZAR_PEDIDOS
21. ELIMINAR_PEDIDOS
22. ADMINISTRAR_WHATSAPP
23. MODULO_DE_WHATSAPP
24. VER_EMPLEADOS
25. GESTIONAR_PROPIO_USUARIO
26. VER_PEDIDOS_GESTIONADOS_POR_EMPLEADO
27. ACTUALIZAR_PEDIDOS_GESTIONADOS_POR_EMPLEADO
28. TODOS

### Entregable

Documento de convenciones versionado en common-lib-angular/public/assets/documentos.

---

## Fase 1 - Security Core en common-lib-angular

### Objetivo

Crear capa reusable sin acoplarla a un frontal especifico.

### Componentes a crear

1. SessionSecurityService
	- resuelve token efectivo
	- valida expiracion local
	- expone claims normalizados
	- elimina defaults inseguros

2. AuthRouteGuard (canMatch/canActivate)
	- permite o bloquea segun sesion valida

3. PermissionRouteGuard
	- evalua permiso requerido desde metadata de ruta
	- compara con claims/roles

4. SecurityPolicyResolver
	- traduce data.security de ruta a reglas concretas

5. AuthHttpInterceptor
	- adjunta Authorization Bearer consistente
	- aplica estrategia token por endpoint

6. CrudPermissionService
	- resuelve permisos efectivos por módulo y acción
	- expone API reusable para botones y eventos del CRUD

7. Directiva/Helper de acción autorizada
	- deshabilita o oculta acciones según política
	- evita ejecución de eventos cuando no hay permiso

### Reglas de compatibilidad

1. No romper AuthService existente; evolucionar por adaptacion.
2. No romper GenericCrudState ni acciones genericas.
3. Mantener soporte localStorage/sessionStorage mientras se migra.
4. Mantener compatibilidad de inputs actuales de lib-crud y tool-bar1.

### Diseño reusable obligatorio para CRUD

Agregar capacidades en librería para que cualquier frontal las reutilice:

1. En lib-crud:
	- input actionPermissions (mapa por acción)
	- input permissionContext (módulo o recurso)
	- output actionDenied (evento de intento bloqueado)

2. En tool-bar1:
	- controlar create y deleteSelected por permiso

3. En button-actions-row1:
	- controlar edit por permiso

4. En flujos delete/edit/create:
	- validar permiso antes de emitir eventos al padre

Política sugerida por acción:

1. create -> permiso CREAR_*
2. update/edit -> permiso ACTUALIZAR_*
3. delete -> permiso ELIMINAR_*
4. read/list -> permiso VER_*

Regla de super permiso:

1. Si usuario tiene TODOS, habilita todas las acciones del módulo.

### Entregable

Modulo reusable exportado por public-api.ts, listo para usar en cualquier frontal.

---

## Fase 2 - Integracion piloto en fn-admin

### Objetivo

Aplicar el Security Core en el frontal con mayor superficie de rutas.

### Actividades

1. Clasificar rutas de fn-admin por nivel de seguridad.
2. Agregar metadata data.security por ruta.
3. Aplicar guard global en rama dashboard.
4. Aplicar guard de permisos en rutas sensibles:
	- usuarios
	- crm-whats
	- produccion

5. Corregir redirects incoherentes detectados en auditoria.
6. Homogeneizar envio de token en servicios internos.
7. Activar política de botones CRUD en pantallas piloto:
	- usuarios
	- productos
	- trabajos/actividades

### Entregable

fn-admin funcionando con guards e interceptor reusable, sin duplicar logica local.

---

## Fase 3 - Migracion progresiva de consumidores

### Objetivo

Extender la misma estrategia al resto de frontales con minimo costo.

### Actividades

1. zigmaFront:
	- reemplazar interceptor legacy por interceptor reusable
	- mapear estado token NGXS actual al SessionSecurityService

2. fn-workingDog:
	- activar guards actualmente comentados
	- mover validacion a libreria reusable

3. zigma y futuros frontales:
	- plantilla de arranque con security-by-default
	- plantilla de CRUD con permisos por acción activados por defecto

### Entregable

Estandar transversal de seguridad aplicado con una sola implementacion base.

---

## Fase 4 - Hardening y cierre de brechas

### Objetivo

Endurecer contra ataques automatizados y manipulacion de cliente.

### Actividades

1. Eliminar defaults inseguros en metadata de sesion para entornos no locales.
2. Forzar limpieza de sesion ante claims invalidos o token corrupto.
3. Bloquear acceso por URL si no pasa guard aunque el menu muestre item.
4. Instrumentar eventos de seguridad frontend:
	- ruta denegada
	- token ausente
	- token expirado
	- permiso insuficiente

5. Definir tasa de alerta para patrones sospechosos (ataque automatizado).

### Entregable

Matriz de controles preventivos y detectivos para auditoria.

---

## Fase 5 - QA, evidencia y aceptacion

### Objetivo

Validar que la proteccion sea efectiva y no rompa UX/negocio.

### Casos minimos de prueba

1. Ruta privada sin token.
2. Ruta privada con token expirado.
3. Ruta privada con token valido sin permiso.
4. Ruta privada con token valido y permiso.
5. Forzado manual de sessionStorage alterado.
6. Consistencia de Authorization en endpoints CRUD.
7. Compatibilidad de estados NGXS CRUD luego de aplicar interceptor/guards.
8. Botón crear deshabilitado sin permiso CREAR_*
9. Botón editar deshabilitado sin permiso ACTUALIZAR_*
10. Botón eliminar deshabilitado sin permiso ELIMINAR_*
11. Validación de permiso TODOS habilitando todo el CRUD

### Evidencia requerida

1. Capturas/bitacora de denegacion de rutas.
2. Pruebas E2E happy path y denied path.
3. Registro de no regresion en CRUD generico.

---

## 6. Matriz de reutilizacion (que vive en libreria y que en consumidor)

### Vive en common-lib-angular

1. Guards base
2. Interceptor auth
3. SessionSecurityService
4. Resolver de politica de ruta
5. Utilidades de claims/token
6. Helpers de metadata segura para QueryParams

### Vive en cada frontal consumidor

1. Declaracion de rutas de negocio
2. Metadata data.security por ruta
3. Mapeo de permisos por dominio funcional
4. Configuracion de endpoints por ambiente

---

## 7. Criterios de aceptacion del plan

1. Reutilizacion real
	- cero copias de guard/interceptor entre frontales.

2. Alineacion backend
	- uso correcto de businessToken y estrategia de token por endpoint.

3. No regresion funcional
	- CRUD NGXS generico sigue funcionando.

4. Seguridad observable
	- denegaciones y causas quedan trazables.

5. Portabilidad
	- nuevo frontal se integra en menos de 1 sprint con el kit de seguridad.

6. CRUD seguro por defecto
	- las acciones default del CRUD respetan permisos sin código ad-hoc por pantalla.

7. Gobernanza de permisos futura
	- el diseño soporta que ADMINISTRADOR y SUPER_ADMIN asignen roles/permisos dinámicamente sin rehacer componentes.

---

## 8. Riesgos y mitigaciones

1. Riesgo: romper consumidores antiguos por cambio de headers.
	- Mitigacion: modo compatibilidad temporal en interceptor.

2. Riesgo: permisos inconsistentes entre menu y rutas.
	- Mitigacion: policy resolver unico y catalogo de permisos central.

3. Riesgo: dependencia de estado NGXS legacy en frontales viejos.
	- Mitigacion: adaptadores de estado en fase de migracion.

4. Riesgo: falsas sensaciones de seguridad por checks solo en cliente.
	- Mitigacion: backend sigue como autoridad y se valida en pruebas integradas.

5. Riesgo: romper UX del CRUD al introducir deshabilitaciones.
	- Mitigacion: modo visual configurable (disabled u oculto), mensajes de acción denegada y rollout por módulo.

---

## 9. Secuencia sugerida de ejecucion

1. Aprobar este plan.
2. Diseñar contratos de Security Core (interfaces y metadata).
3. Implementar en libreria.
4. Integrar en fn-admin (piloto).
5. Ejecutar QA y ajustar.
6. Extender a zigmaFront y fn-workingDog.

---

## 10. Nota final

Este plan esta orientado a defensa en profundidad contra acceso no autorizado, navegacion directa por URL y ataques automatizados, manteniendo la filosofia de reutilizacion de Twins Code para escalar a multiples frontales sin duplicar logica.

