# Lib Common Angular - Configuracion de Endpoints

Esta libreria permite centralizar los endpoints desde un solo objeto de configuracion (`LibCommonConfig`) usando `LibConfigModule.forRoot(...)`.

## 1. Como se inyecta la configuracion

```ts
import { NgModule } from '@angular/core';
import { LibConfigModule } from 'lib-common-angular';
import { environment } from '../environments/environment';

@NgModule({
	imports: [
		LibConfigModule.forRoot(environment.libConfig)
	]
})
export class AppModule {}
```

Tambien puedes enviar un objeto literal:

```ts
LibConfigModule.forRoot({
	environment: 'development',
	apiGateway: 'https://api-dev.tudominio.com'
});
```

## 2. Reglas de resolucion de endpoints

La clase `LibConfigService` aplica este orden:

1. Toma los valores por defecto locales.
2. Mezcla lo que llega por `forRoot`.
3. Si `environment === 'local'` o no hay `apiGateway`, conserva los valores mezclados tal cual.
4. Si no es `local` y existe `apiGateway`, completa automaticamente solo los `baseUrl*` que no enviaste.

Importante:

- Si un endpoint viene definido explicitamente, se respeta.
- Si no viene definido, se construye desde `apiGateway`.
- Se elimina la barra final de `apiGateway` antes de concatenar rutas.

## 3. Valores locales por defecto

Si no inyectas configuracion, la libreria usa:

```ts
{
	environment: 'local',
	apiGateway: 'http://localhost:3000',
	baseUrlProducts: 'http://localhost:3000/products',
	baseUrlAuth: 'http://localhost:3000/auth',
	baseUrlUsers: 'http://localhost:1212/user',
	baseUrlCarrito: 'http://localhost:3000/carrito',
	baseUrlBusiness: 'http://localhost:3000/Business',
	baseUrlCurrency: 'http://localhost:3000/Currency',
	baseUrlCategoryProduct: 'http://localhost:3000/category-products',
	baseUrlTipoCategoria: 'http://localhost:3000/tipo-categoria',
	baseUrlCrmWhats: 'http://localhost:8090',
	apiVersion: 'v1',
	timeout: 30000
}
```

## 4. Endpoints autogenerados desde `apiGateway`

Cuando `environment` es `development` o `production`, y no envias `baseUrl*` especifico:

- `baseUrlProducts` -> `${apiGateway}/products`
- `baseUrlAuth` -> `${apiGateway}/auth`
- `baseUrlUsers` -> `${apiGateway}/user`
- `baseUrlCarrito` -> `${apiGateway}/carrito`
- `baseUrlBusiness` -> `${apiGateway}`
- `baseUrlCurrency` -> `${apiGateway}/Currency`
- `baseUrlCategoryProduct` -> `${apiGateway}/category-products`
- `baseUrlTipoCategoria` -> `${apiGateway}/tipo-categoria`
- `baseUrlCrmWhats` -> `${apiGateway}/whats`

## 5. Ejemplos recomendados por ambiente

### Local

```ts
export const environment = {
	production: false,
	libConfig: {
		environment: 'local'
	}
};
```

### Development (todo por gateway)

```ts
export const environment = {
	production: false,
	libConfig: {
		environment: 'development',
		apiGateway: 'https://api-dev.tudominio.com'
	}
};
```

### Production (override parcial)

```ts
export const environment = {
	production: true,
	libConfig: {
		environment: 'production',
		apiGateway: 'https://api.tudominio.com',
		baseUrlUsers: 'https://usuarios.tudominio.com/user'
	}
};
```

En ese caso `baseUrlUsers` usa el valor manual, y el resto de endpoints faltantes se completan desde `apiGateway`.

## 6. Uso desde codigo

```ts
import { Injectable } from '@angular/core';
import { LibConfigService } from 'lib-common-angular';

@Injectable({ providedIn: 'root' })
export class ExampleService {
	constructor(private readonly libConfig: LibConfigService) {}

	getProductsUrl(): string {
		return this.libConfig.get<string>('baseUrlProducts');
	}

	getAllConfig() {
		return this.libConfig.getConfig();
	}
}
```

## 7. Actualizacion en runtime

Puedes ajustar endpoints en ejecucion:

```ts
this.libConfig.updateConfig({
	baseUrlProducts: 'https://nuevo-host.com/products'
});
```

Nota: esto actualiza la configuracion interna del servicio para consumos posteriores.
