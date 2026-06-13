import { Component } from '@angular/core';
import { Terminal, PrimegModule } from 'lib-common-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabla-doc-page',
  standalone: true,
  imports: [PrimegModule, Terminal, CommonModule],
  templateUrl: './tabla-doc-page.component.html',
  styleUrl: './tabla-doc-page.component.scss'
})
export class TablaDocPageComponent {
  // ✅ Datos de ejemplo
  sampleData = [
    { id: 1, nombre: 'Producto A', precio: 99.99, stock: 50, estado: 'Activo' },
    { id: 2, nombre: 'Producto B', precio: 149.99, stock: 30, estado: 'Activo' },
    { id: 3, nombre: 'Producto C', precio: 199.99, stock: 0, estado: 'Agotado' }
  ];

  // ✅ Uso básico
  basicUsageCode = `import { Tabla1Component } from 'lib-common-angular';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tabla',
  standalone: true,
  imports: [Tabla1Component],
  template: \`
    <lib-tabla1
      [datos]="datos"
      [columnas]="columnas"
      (onRowSelect)="onSelectRow($event)">
    </lib-tabla1>
  \`
})
export class TablaComponent {
  datos = [
    { id: 1, nombre: 'Item 1', valor: 100 },
    { id: 2, nombre: 'Item 2', valor: 200 }
  ];

  columnas = ['id', 'nombre', 'valor'];

  onSelectRow(item: any) {
    console.log('Fila seleccionada:', item);
  }
}`;

  // ✅ Configuración avanzada
  advancedConfigCode = `// Tabla con configuración completa
<lib-tabla1
  [datos]="datos"
  [columnas]="['id', 'nombre', 'precio', 'stock', 'estado']"
  [scrollable]="true"
  [paginator]="true"
  [rows]="10"
  [selectionMode]="'single'"
  [responsive]="true"
  (onRowSelect)="handleRowSelect($event)"
  (onRowDoubleClick)="handleRowDoubleClick($event)">
</lib-tabla1>

// En el componente TypeScript:
handleRowSelect(event: any) {
  console.log('Fila seleccionada:', event.data);
}

handleRowDoubleClick(event: any) {
  console.log('Doble clic:', event.data);
}`;

  // Documentación de Inputs
  inputsDocs = [
    {
      name: 'datos',
      type: 'any[]',
      description: 'Array de objetos a mostrar en la tabla.'
    },
    {
      name: 'columnas',
      type: 'string[]',
      description: 'Array de nombres de propiedades a mostrar como columnas.'
    },
    {
      name: 'scrollable',
      type: 'boolean',
      description: 'Habilita scroll horizontal si las columnas no caben.'
    },
    {
      name: 'paginator',
      type: 'boolean',
      description: 'Muestra paginador en la tabla.'
    },
    {
      name: 'rows',
      type: 'number',
      description: 'Número de filas por página (default: 10).'
    },
    {
      name: 'selectionMode',
      type: "'single' | 'multiple'",
      description: 'Tipo de selección: una fila o múltiples.'
    },
    {
      name: 'responsive',
      type: 'boolean',
      description: 'Tabla responsiva para dispositivos móviles.'
    }
  ];

  // Documentación de Outputs
  outputsDocs = [
    {
      name: 'onRowSelect',
      type: 'EventEmitter<{data: any}>',
      description: 'Se dispara al seleccionar una fila.'
    },
    {
      name: 'onRowDoubleClick',
      type: 'EventEmitter<{data: any}>',
      description: 'Se dispara al hacer doble clic en una fila.'
    },
    {
      name: 'onPageChange',
      type: 'EventEmitter<{first: number, rows: number}>',
      description: 'Se dispara al cambiar de página.'
    }
  ];

  // Características
  featuresDocs = [
    {
      name: 'Paginación',
      description: 'Divide los datos en páginas con navegación personalizable.'
    },
    {
      name: 'Selección',
      description: 'Permite seleccionar una o múltiples filas.'
    },
    {
      name: 'Scroll Horizontal',
      description: 'Scroll automático para tablas amplias.'
    },
    {
      name: 'Responsive',
      description: 'Se adapta automáticamente a dispositivos móviles.'
    },
    {
      name: 'Ordenamiento',
      description: 'Permite ordenar por columnas haciendo clic en los headers.'
    },
    {
      name: 'Filtrado',
      description: 'Filtrar datos en tiempo real.'
    }
  ];
}
