# Lib-Common-angular

Esta libreria se usa para todos los proyectos frontales de aqui se usan los componentes 
 version 20.1.6.

# Lib Common Angular

## Configuración de Ambientes

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
