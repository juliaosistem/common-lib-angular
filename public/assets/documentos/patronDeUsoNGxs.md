# Patrón de uso NGXS

Este documento define cómo crear y consumir estados NGXS en el ecosistema Twins Code usando `common-lib-angular` como base reutilizable.

## Objetivo

La regla principal es simple:

- si el estado sirve para varios frontales, se crea en `common-lib-angular`
- si el estado contiene lógica muy propia de un frontal, se implementa en el frontal consumidor
- si existe un patrón CRUD estándar, se reutiliza `GenericCrudState` antes de escribir lógica manual

La idea es evitar estados duplicados y mantener una única forma de listar, guardar, actualizar y eliminar datos.

## Cuándo crear el estado en `common-lib-angular`

Crea el estado compartido en la librería cuando el dominio cumple una de estas condiciones:

- el mismo slice se usará en más de un frontal
- la entidad tiene un contrato estable y común entre pantallas
- la carga de datos se puede resolver con un CRUD estándar
- la lógica de lectura y escritura no depende de reglas visuales del frontal

Ejemplos típicos:

- productos
- categorías
- tipos de categoría
- usuarios de negocio reutilizables

## Cuándo dejarlo en el frontal consumidor

Mantén el estado en el frontal cuando ocurra alguno de estos casos:

- la vista mezcla varios subflujos en una sola pantalla
- la lógica depende del layout, filtros o permisos locales
- el estado solo existe para una pantalla específica
- la entidad requiere múltiples fuentes o transformaciones especiales que no son reutilizables

Ejemplos típicos:

- dashboards compuestos
- pantallas con filtros propios del negocio visual
- flujos que coordinan varios endpoints al mismo tiempo

## Regla de decisión rápida

Usa esta secuencia:

1. ¿Se usará en más de un frontal? Si la respuesta es sí, va a `common-lib-angular`.
2. ¿Se puede resolver con CRUD estándar? Si la respuesta es sí, usa `GenericCrudState`.
3. ¿Requiere lógica de negocio común pero no CRUD puro? Crea un estado reusable con acciones y servicio propios.
4. ¿Es específico de una pantalla o de una combinación de endpoints? Déjalo en el frontal.

## Estructura recomendada en `common-lib-angular`

Cuando un estado sea reusable, la estructura debe seguir este orden:

1. `*.models.ts`
	- tipos del slice
	- enums, aliases y contratos internos
2. `*.actions.ts`
	- acciones NGXS con nombres claros
	- una acción por operación de negocio
3. `*-api.service.ts`
	- acceso HTTP al backend
	- construcción de URL, headers y query params
4. `*.state.ts`
	- estado NGXS
	- selectors
	- handlers de acciones
5. `public-api.ts`
	- exportar todo lo reusable para consumo externo

## Estructura recomendada en el frontal consumidor

El frontal no debe duplicar la capa de acceso si ya existe en la librería.

El frontend consumidor debe limitarse a:

- registrar el estado en `AppModule` o en el feature module correspondiente
- consumir los selectors con `store.select(...)`
- despachar acciones con `store.dispatch(...)`
- mapear la información al componente visual
- manejar permisos, loading y errores de interfaz

## Contrato mínimo de un estado reusable

Un estado reusable debe exponer al menos:

- selector de lista
- selector de loading
- selector de error
- acción de carga inicial
- acción de guardado
- acción de eliminación cuando aplique

Si el caso es CRUD estándar, además debe respetar el patrón de `GenericCrudState`.

## Cómo usar `GenericCrudState`

Cuando la entidad encaja en un CRUD típico, la implementación recomendada es:

1. crear acciones con `createGenericCrudActions<T>(entityName)`
2. extender `GenericCrudState<RES, RQ>`
3. usar `LazyGenericCrudHttpService` con la clave de configuración correcta
4. registrar el state en `NgxsModule.forRoot(...)`
5. consumir los selectors desde el componente

El patrón base ya resuelve:

- listados
- altas
- actualizaciones
- eliminaciones
- carga mock cuando existe

## Cuándo no usar `GenericCrudState`

No uses el CRUD genérico cuando:

- la operación principal no es un CRUD clásico
- la entidad necesita múltiples endpoints coordinados
- la pantalla mezcla más de una entidad lógica
- el payload de guardado depende de varios DTOs

En ese caso, crea un estado NGXS explícito con acciones propias.

## Regla para acciones NGXS

Las acciones deben nombrarse por intención de negocio, no por implementación técnica.

Ejemplos correctos:

- `LoadUsersDashboard`
- `SaveUsersDashboardProfile`
- `DeleteUsersDashboard`
- `LoadProducts`

Ejemplos a evitar:

- `DoLoad`
- `Action1`
- `SetData`
- `UpdateStuff`

## Regla para el servicio de estado

El service de la capa NGXS debe concentrar solo acceso a datos y normalización básica.

Debe encargarse de:

- construir la URL base desde `LibConfigService`
- agregar metadatos de sesión cuando aplique
- convertir respuestas del backend al tipo esperado

No debe contener:

- lógica visual
- lógica de permisos
- lógica de formulario
- lógica de diálogo

## Regla para el componente visual

El componente debe ser delgado.

Debe encargarse de:

- preparar la configuración de tabla o formulario
- escuchar selectors del estado
- despachar acciones NGXS
- abrir y cerrar diálogos

No debe encargarse de:

- armar URLs manualmente
- llamar `HttpClient` directo para CRUD reutilizable
- resolver lógica de persistencia

## Ejemplo de decisión

Si el caso es productos:

- existe en más de un frontal
- usa un CRUD estándar
- ya tiene un patrón reusable en la librería
- por tanto debe vivir en `common-lib-angular`

Si el caso es usuarios de un dashboard específico:

- el frontal puede tener filtros y tarjetas propias
- el backend sigue siendo el mismo
- la lógica de interfaz cambia según pantalla
- por tanto la capa reusable vive en la librería y la vista solo consume el estado

## Ejemplo de flujo correcto

	 Componente
		-> dispatch(action)
		-> State NGXS
		-> Api service
		-> backend
		-> response
		-> patchState
		-> selector
		-> componente

## Checklist antes de crear un nuevo estado

- ¿Este estado será usado por más de un frontal?
- ¿Existe ya un CRUD reusable en `common-lib-angular`?
- ¿El selector de lista es suficiente para la pantalla?
- ¿La acción representa una intención de negocio clara?
- ¿El service está libre de lógica visual?
- ¿El componente evita `HttpClient` directo?

## Reglas finales

- prioriza reuso sobre duplicación
- registra siempre el state en el módulo del frontal consumidor
- usa nombres explícitos para acciones, slices y servicios
- si el caso es compartido, la fuente de verdad vive en la librería
- si el caso es único de una pantalla, mantén la lógica local pero con la misma disciplina de NGXS

