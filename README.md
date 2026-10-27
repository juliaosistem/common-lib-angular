# Lib-Common-angular

Esta libreria se usa para todos los proyectos frontales de aqui se usan los componentes 
 version 20.1.6.

# Lib Common Angular

## Configuración de Ambientes

Documentacion detallada de configuracion de endpoints:
- `projects/lib-common-angular/README.md`

### Ecommerce: autenticacion y carrito NGXS

- Registrar `UsuariosState` y `CarritoState` de `lib-common-angular` en NGXS
  (no registrar otro estado llamado `usuarios` en el mismo store).
- Inicializar `setLibraryInjector(injector)` en el constructor del modulo raiz,
  antes de renderizar componentes que usan los servicios diferidos.
- Configurar `baseUrlUsers`, `baseUrlCarrito`, `baseUrlMediosPagos` y
  `facebookAppId` mediante `LIB_COMMON_CONFIG`/`LibConfigService`.
  El App ID de Facebook es publico; su secreto pertenece exclusivamente al backend.
- El login ecommerce reutiliza `AuthService` y `FacebookSdkService`, igual que
  fn-admin. La falta de configuracion o cancelacion social se muestra en el formulario.
- `CarritoActions` ofrece `All`, `Add`, `Update`, `Delete` y `LoadMock`.
  El estado conserva `PlantillaResponse<CarritoDTO>` y obtiene los metadatos de
  negocio del `businessToken`. Las peticiones pendientes se cancelan al limpiar sesion.
- Consumir el estado con `store.select(CarritoState.getCarritoView)` y
  `store.selectSnapshot(ProductosState.getProductosResponse)` para preservar la
  inferencia de tipos en NGXS. Los handlers del carrito tienen nombres propios:
  su contexto incluye campos de UI y no sustituye el contexto base del CRUD generico.
- El carrito reutiliza `lib-crud` y `lib-crud-dialog1`. Para operaciones
  persistidas, `Crud` acepta `[controlledDelete]="true"` y emite
  `(deleteItemsRequest)` con el lote confirmado, sin borrar filas ni anunciar exito
  antes de recibir la respuesta del servidor. Por defecto conserva su comportamiento
  anterior y el evento individual `(deleteItemRequest)`.
- `GenericCrudHttpService.add` acepta metadatos como segundo argumento, ademas
  de mantener la firma heredada `(payload, topic, queryParams)`.
- El checkout necesita medios de pago reales. La confirmacion de carrito no
  equivale a cobrar ni a aprobar un pago; los rechazos del micro se muestran al usuario.

### Uso Básico

```typescript
// En tu app.module.ts
import { LibCommonAngularModule, LibConfigModule } from 'lib-common-angular';

@NgModule({
  imports: [
    // ...otros imports
    LibCommonAngularModule,
    LibConfigModule.forRoot({
      baseUrlProducts: 'https://api.miapp.com/productos',
      baseUrlAuth: 'https://auth.miapp.com',
      baseUrlUsers: 'https://users.miapp.com',
      apiVersion: 'v2',
      timeout: 60000
    })
  ],
  // ...resto del módulo
})
export class AppModule { }
```

### Configuración por Ambiente

```typescript
// environment.prod.ts
export const environment = {
  production: true,
  libConfig: {
    baseUrlProducts: 'https://api-prod.miapp.com/productos',
    baseUrlAuth: 'https://auth-prod.miapp.com',
    baseUrlUsers: 'https://users-prod.miapp.com'
  }
};

// app.module.ts
import { environment } from '../environments/environment';

@NgModule({
  imports: [
    LibConfigModule.forRoot(environment.libConfig)
  ]
})
export class AppModule { }
```

### Configuración Dinámica

```typescript
// En cualquier servicio o componente
constructor(private libConfig: LibConfigService) {}

updateConfig() {
  this.libConfig.updateConfig({
    baseUrlProducts: 'https://nueva-api.com'
  });
}
```



## Paso 1

**## npm install** 
agregara las depencias localmente 

## paso 2 

ir ala carpeta principal del proyecto ejecutar 
y ejecutar
esto para probar componetes dentro de la misma libreria
 **## ng build   lib-common-angular --watch**  

en caso de probar cambios en un proyecto que esta importando esta libreria ejecutar.

 si solo se quiere probar la libreria con el mismo proyecto interno  no ejecutar los siguientes comandos e ir hasta el paso 3 
 **## ng build   lib-common-angular**  

 y despues  
**## npm  link  lib-common-angular** 
 una vez ejecutado esto 
 puedes ejecutar 
para que construya los cambios en tiempo real y el proyecto que lo importa los tome
 **## ng build   lib-common-angular --watch** 



en el proyecto que usara la libreria ejecutar 
**## npm   link  lib-common-angular** 

## paso 3

este paso aplica si quieres correr la libreria en el mismo proyecto que tiene la libreria para probar componetes 

**## ng serve  lib-common-angular-demo**

esto levantara la aplicacion donde podras probar tus componentes creados en la libreria




**# importante**

Si se va a crear nuevos dtos importante usar la libreria  juliaositembackenexpress los siguientes pasos son para modificar la libreria y ir viendo cambios  descargar la libreria localmn

**# descargar la libreria juliaositembackenexpress localmente**
despues 

**# npm i**
 
en la carpeta de la libreria 

**# npm run build** 

esto para crear la carpeta dist

**# npm link** 
esto creara un enlace simbolico  una vez creado ese enlace ir ala carpeta  common-lib-angular y ejecutar 

**# npm link juliaositembackenexpress** 

esto ara que cree un enlace a la libreria  si queremos ir desarrollando ala par con la libreria podemos despues ejecutar 

**# npm run Build:watch** 

## Autenticacion Keycloak por negocio

El estado compartido de usuarios envia `idBussines` en el body de login cuando
`LIB_COMMON_CONFIG.idBussines` o `LIB_COMMON_CONFIG.idBusiness` contiene un entero
positivo. No se inventa un tenant por defecto: sin configuracion se mantiene
el login legacy del backend.

Antes de habilitar este valor en un negocio existente, registrar su configuracion
de realm/client en el backend; un tenant explicito sin configuracion no usa
las credenciales del entorno como respaldo.

La renovacion y el cierre de sesion usan formularios con `refresh_token` e
`idBussines`, sin incluir credenciales en la URL. Se conserva `businessToken`
como token operativo de dominio. No enviar secretos de cliente al navegador.

Los nuevos contratos proceden de `lib-core-dtos`: regenerar los DTOs TypeScript
antes de compilar los consumidores. `npm run test:auth` ejecuta las pruebas dirigidas
de seleccion de tenant sin incorporar specs de otros componentes.
El build development de fn-admin y estas pruebas pasan. El empaquetado completo
de la libreria sigue bloqueado por nulabilidad preexistente en slider1 y carrito;
la suite general tambien detecta un consumidor legacy de PlantillaDTO.
No se han aplicado migraciones, reiniciado servicios ni aprovisionado negocios reales.
