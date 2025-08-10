# Sistema de Menú Dinámico - Versión Mejorada y Segregada

## Descripción

El sistema de menú dinámico es una solución completa y reutilizable para crear menús de navegación dinámicos en aplicaciones Angular. Está diseñado siguiendo los principios del diseño atómico y patrones de arquitectura limpia, siguiendo el mismo patrón que el componente CRUD. **Todos los componentes han sido segregados en archivos separados (HTML, SCSS, TS) para mejorar la organización y mantenibilidad.**

## Características Principales

- ✅ **Diseño Atómico**: Componentes reutilizables (átomos, moléculas, páginas)
- ✅ **Configuración Dinámica**: Menús configurables via API o configuración local
- ✅ **Sistema de Permisos**: Filtrado de elementos por permisos de usuario
- ✅ **Temas Personalizables**: Soporte para temas claro/oscuro
- ✅ **Orientación Flexible**: Vertical y horizontal
- ✅ **Submenús Anidados**: Soporte para múltiples niveles
- ✅ **Eventos en Tiempo Real**: Sistema de eventos para interacciones
- ✅ **Cache Inteligente**: Optimización de rendimiento
- ✅ **Responsive**: Diseño adaptable a diferentes dispositivos
- ✅ **Accesibilidad**: Soporte para lectores de pantalla
- ✅ **Patrón CRUD**: Sigue el mismo patrón que el componente CRUD
- ✅ **Inputs/Outputs**: Comunicación bidireccional con el componente padre
- ✅ **Arquitectura Segregada**: Archivos HTML, SCSS y TS separados

## Arquitectura Mejorada y Segregada

### Estructura de Componentes Segregados

```
shared/
├── interfaces/
│   └── menu.interface.ts                    # Interfaces y tipos del menú
├── atoms/
│   └── menu-item1/                          # Componente átomo para elemento individual
│       ├── menu-item1.component.ts          # Lógica del componente
│       ├── menu-item1.component.html        # Template HTML
│       └── menu-item1.component.scss        # Estilos SCSS
├── molecules/
│   └── dynamic-menu1/                       # Componente molécula para menú completo
│       ├── dynamic-menu1.component.ts       # Lógica del componente
│       ├── dynamic-menu1.component.html     # Template HTML
│       └── dynamic-menu1.component.scss     # Estilos SCSS
├── services/
│   └── dynamic-menu.service.ts              # Servicio para gestión del menú
├── pages/
│   └── menu/                                # Componente página reutilizable
│       ├── menu.component.ts                # Lógica del componente
│       ├── menu.component.html              # Template HTML
│       └── menu.component.scss              # Estilos SCSS
└── README-menu-dinamico.md                  # Documentación
```

### Beneficios de la Segregación

✅ **Mejor Organización**: Cada aspecto del componente tiene su propio archivo
✅ **Facilita el Mantenimiento**: Cambios específicos en HTML, SCSS o TS
✅ **Mejor Colaboración**: Diferentes desarrolladores pueden trabajar en diferentes archivos
✅ **Reutilización de Estilos**: Los archivos SCSS pueden ser importados en otros componentes
✅ **Mejor Legibilidad**: Archivos más pequeños y enfocados
✅ **Herramientas de Desarrollo**: Mejor soporte para herramientas de desarrollo

### Componente Página (MenuComponent) - Segregado

El componente `MenuComponent` es el componente principal reutilizable que sigue el patrón del CRUD:

#### Archivos del Componente
```typescript
// menu.component.ts - Lógica del componente
@Component({
  selector: 'lib-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

// menu.component.html - Template HTML
<div class="menu-container">
  <!-- Controles y menú dinámico -->
</div>

// menu.component.scss - Estilos SCSS
.menu-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
```

#### Inputs
```typescript
@Input() menuId: string = 'main-menu';                    // ID del menú
@Input() userPermissions: string[] = [];                   // Permisos del usuario
@Input() showControls: boolean = true;                     // Mostrar controles
@Input() showInfo: boolean = true;                         // Mostrar información
@Input() showEventLog: boolean = true;                     // Mostrar log de eventos
@Input() showConfig: boolean = true;                       // Mostrar configuración
@Input() initialConfig?: MenuConfig;                       // Configuración inicial
```

#### Outputs
```typescript
@Output() menuEvent = new EventEmitter<MenuEvent>();       // Eventos del menú
@Output() menuLoaded = new EventEmitter<MenuConfig>();     // Menú cargado
@Output() menuError = new EventEmitter<string>();          // Errores del menú
@Output() menuItemAdded = new EventEmitter<MenuItem>();    // Elemento agregado
@Output() menuRefreshed = new EventEmitter<void>();        // Menú refrescado
@Output() configApplied = new EventEmitter<MenuConfig>();  // Configuración aplicada
```

## Uso Básico

### 1. En la Librería (MenuComponent) - Segregado

```typescript
// Componente reutilizable en la librería
@Component({
  selector: 'lib-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  @Input() menuId: string = 'main-menu';
  @Input() userPermissions: string[] = [];
  @Input() showControls: boolean = true;
  @Input() showInfo: boolean = true;
  @Input() showEventLog: boolean = true;
  @Input() showConfig: boolean = true;
  @Input() initialConfig?: MenuConfig;

  @Output() menuEvent = new EventEmitter<MenuEvent>();
  @Output() menuLoaded = new EventEmitter<MenuConfig>();
  @Output() menuError = new EventEmitter<string>();
  @Output() menuItemAdded = new EventEmitter<MenuItem>();
  @Output() menuRefreshed = new EventEmitter<void>();
  @Output() configApplied = new EventEmitter<MenuConfig>();
}
```

### 2. En el Demo (MenuDemoComponent) - Segregado

```typescript
// Componente de demostración en el proyecto demo
@Component({
  selector: 'app-menu-demo',
  templateUrl: './menu-demo.component.html',
  styleUrls: ['./menu-demo.component.scss']
})
export class MenuDemoComponent implements OnInit {
  
  // Propiedades para el menú
  menuId = 'main-menu';
  userPermissions = ['admin.users.read', 'reports.sales.read'];
  
  // Configuración de visualización
  showControls = true;
  showInfo = true;
  showEventLog = true;
  showConfig = true;

  // Configuración inicial del menú
  initialConfig: MenuConfig = {
    id: 'demo-menu',
    name: 'Menú de Demostración',
    items: [
      {
        id: 'demo-home',
        label: 'Inicio Demo',
        icon: 'pi pi-home',
        routerLink: ['/'],
        type: 'item',
        order: 1
      }
    ],
    theme: 'light',
    orientation: 'vertical',
    collapsible: true,
    showIcons: true,
    showBadges: true,
    maxDepth: 3
  };

  // Métodos para manejar eventos
  onMenuEvent(event: MenuEvent) {
    // Manejar eventos del menú
  }

  onMenuLoaded(config: MenuConfig) {
    // Manejar cuando el menú se carga
  }

  onMenuError(error: string) {
    // Manejar errores del menú
  }
}
```

### 3. Template HTML del Demo - Segregado

```html
<!-- menu-demo.component.html -->
<div class="menu-demo-page">
  <div class="page-header">
    <h1>Sistema de Menú Dinámico</h1>
    <p>Demostración del menú dinámico y reutilizable para microservicios</p>
  </div>

  <!-- Controles adicionales del demo -->
  <div class="demo-controls">
    <!-- Controles específicos del demo -->
  </div>

  <!-- Componente de menú de la librería -->
  <lib-menu 
    [menuId]="menuId"
    [userPermissions]="userPermissions"
    [showControls]="showControls"
    [showInfo]="showInfo"
    [showEventLog]="showEventLog"
    [showConfig]="showConfig"
    [initialConfig]="initialConfig"
    (menuEvent)="onMenuEvent($event)"
    (menuLoaded)="onMenuLoaded($event)"
    (menuError)="onMenuError($event)"
    (menuItemAdded)="onMenuItemAdded($event)"
    (menuRefreshed)="onMenuRefreshed()"
    (configApplied)="onConfigApplied($event)">
  </lib-menu>

  <!-- Información adicional del demo -->
  <div class="demo-info" *ngIf="currentMenuConfig">
    <!-- Información específica del demo -->
  </div>
</div>
```

## Patrón de Implementación Segregado

### 1. Librería (lib-common-angular)

**MenuComponent** - Componente reutilizable segregado:
- ✅ `menu.component.ts` - Lógica del componente
- ✅ `menu.component.html` - Template HTML
- ✅ `menu.component.scss` - Estilos SCSS
- ✅ Inputs para configuración
- ✅ Outputs para comunicación
- ✅ Lógica interna encapsulada
- ✅ Métodos públicos para manipulación externa
- ✅ Manejo de estados y eventos

### 2. Demo (lib-common-angular-demo)

**MenuDemoComponent** - Componente de demostración segregado:
- ✅ `menu-demo.component.ts` - Lógica del componente
- ✅ `menu-demo.component.html` - Template HTML
- ✅ `menu-demo.component.scss` - Estilos SCSS
- ✅ Configuración específica del demo
- ✅ Manejo de eventos del componente librería
- ✅ UI adicional para demostración
- ✅ Lógica de negocio específica del demo

## Configuración Avanzada

### Configuración de Menús

```typescript
const menuConfig: MenuConfig = {
  id: 'custom-menu',
  name: 'Menú Personalizado',
  items: [
    {
      id: 'home',
      label: 'Inicio',
      icon: 'pi pi-home',
      routerLink: ['/'],
      type: 'item',
      order: 1
    },
    {
      id: 'admin',
      label: 'Administración',
      icon: 'pi pi-cog',
      type: 'group',
      order: 2,
      items: [
        {
          id: 'users',
          label: 'Usuarios',
          icon: 'pi pi-users',
          routerLink: ['/admin/users'],
          type: 'item',
          order: 1,
          permissions: ['admin.users.read']
        }
      ]
    }
  ],
  theme: 'light',
  orientation: 'vertical',
  collapsible: true,
  showIcons: true,
  showBadges: true,
  maxDepth: 3
};
```

### Sistema de Permisos

```typescript
// Elemento con permisos
{
  id: 'admin-users',
  label: 'Usuarios',
  icon: 'pi pi-users',
  routerLink: ['/admin/users'],
  type: 'item',
  permissions: ['admin.users.read', 'admin.users.write']
}

// En el componente
userPermissions = ['admin.users.read']; // Solo verá elementos con este permiso
```

## Eventos del Menú

### Tipos de Eventos

```typescript
type MenuEventType = 'click' | 'hover' | 'expand' | 'collapse';

interface MenuEvent {
  type: MenuEventType;
  item: MenuItem;
  event?: Event;
}
```

### Manejo de Eventos

```typescript
onMenuEvent(event: MenuEvent) {
  switch (event.type) {
    case 'click':
      console.log('Elemento clickeado:', event.item.label);
      break;
    case 'hover':
      console.log('Hover sobre:', event.item.label);
      break;
    case 'expand':
      console.log('Submenú expandido:', event.item.label);
      break;
    case 'collapse':
      console.log('Submenú colapsado:', event.item.label);
      break;
  }
}
```

## Métodos Públicos

### Manipulación Externa

```typescript
// Cambiar ID del menú
menuComponent.setMenuId('new-menu-id');

// Actualizar permisos
menuComponent.setUserPermissions(['new.permission']);

// Establecer configuración
menuComponent.setMenuConfig(newConfig);

// Limpiar log de eventos
menuComponent.clearEventLog();

// Obtener configuración actual
const config = menuComponent.getCurrentConfig();

// Obtener log de eventos
const events = menuComponent.getEventLog();
```

## Configuración en Microservicios

### 1. Importar Componente

```typescript
import { MenuComponent } from 'lib-common-angular';

@NgModule({
  imports: [MenuComponent],
  // ...
})
export class AppModule { }
```

### 2. Usar en Template

```html
<lib-menu 
  [menuId]="'main-menu'"
  [userPermissions]="userPermissions"
  [showControls]="false"
  [showInfo]="false"
  [showEventLog]="false"
  [showConfig]="false"
  (menuEvent)="handleMenuEvent($event)">
</lib-menu>
```

### 3. Configurar Rutas

```typescript
const routes: Routes = [
  {
    path: 'menu-demo',
    component: MenuDemoComponent
  }
];
```

## Mejores Prácticas

### 1. Configuración
- ✅ Usar IDs únicos y descriptivos para menús
- ✅ Definir permisos granulares
- ✅ Organizar elementos con el campo `order`
- ✅ Usar iconos consistentes (PrimeIcons recomendado)

### 2. Eventos
- ✅ Manejar todos los tipos de eventos
- ✅ Implementar logging para debugging
- ✅ Usar notificaciones para feedback del usuario
- ✅ Limitar el número de eventos en memoria

### 3. Performance
- ✅ Usar cache para configuraciones frecuentes
- ✅ Limpiar eventos periódicamente
- ✅ Implementar lazy loading para menús grandes
- ✅ Optimizar re-renders con OnPush strategy

### 4. Accesibilidad
- ✅ Incluir `aria-label` en elementos
- ✅ Soporte para navegación por teclado
- ✅ Contraste adecuado en temas
- ✅ Textos descriptivos para lectores de pantalla

### 5. Arquitectura Segregada
- ✅ Mantener archivos HTML, SCSS y TS separados
- ✅ Usar nombres descriptivos para archivos
- ✅ Organizar estilos de manera modular
- ✅ Reutilizar componentes y estilos cuando sea posible

## Troubleshooting

### Problemas Comunes

1. **Menú no se carga**: Verificar que el `menuId` sea correcto
2. **Elementos no visibles**: Revisar permisos del usuario
3. **Eventos no funcionan**: Asegurar que los handlers estén correctamente vinculados
4. **Estilos no aplican**: Verificar variables CSS personalizadas
5. **Archivos no encontrados**: Verificar rutas de templateUrl y styleUrls

### Debug

```typescript
// Habilitar logs de debug
constructor(private menuService: DynamicMenuService) {
  // Ver configuración actual
  this.menuService.getMenuConfig('main-menu').then(config => {
    console.log('Configuración actual:', config);
  });
}

// Verificar eventos
onMenuEvent(event: MenuEvent) {
  console.log('Evento del menú:', event);
}
```

## Ejemplos de Uso

### Menú Simple
```html
<lib-menu 
  [menuId]="'simple-menu'"
  [showControls]="false"
  [showInfo]="false"
  [showEventLog]="false"
  [showConfig]="false">
</lib-menu>
```

### Menú Completo con Demo
```html
<lib-menu 
  [menuId]="'demo-menu'"
  [userPermissions]="['admin.users.read']"
  [showControls]="true"
  [showInfo]="true"
  [showEventLog]="true"
  [showConfig]="true"
  (menuEvent)="onMenuEvent($event)"
  (menuLoaded)="onMenuLoaded($event)">
</lib-menu>
```

## Contribución

Para contribuir al sistema de menú dinámico:

1. ✅ Seguir el patrón de diseño atómico
2. ✅ Mantener compatibilidad con versiones anteriores
3. ✅ Agregar pruebas unitarias para nuevas funcionalidades
4. ✅ Actualizar documentación
5. ✅ Seguir las convenciones de nomenclatura
6. ✅ Implementar el patrón CRUD para consistencia
7. ✅ Mantener la segregación de archivos (HTML, SCSS, TS)
8. ✅ Usar nombres descriptivos para archivos y componentes

## Licencia

Este sistema es parte de la librería common-lib-angular y sigue las mismas políticas de licencia del proyecto principal. 