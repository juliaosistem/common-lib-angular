import { Component } from '@angular/core';
import { Terminal, PrimegModule } from 'lib-common-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-botones-doc-page',
  standalone: true,
  imports: [PrimegModule, Terminal, CommonModule],
  templateUrl: './botones-doc-page.component.html',
  styleUrl: './botones-doc-page.component.scss'
})
export class BotonesDocPageComponent {
  // ✅ Ejemplos de uso

  buttonAddExample = `<!-- Botón Agregar -->
<lib-button-add1
  [disabled]="isLoading"
  (onClick)="onAddClick()">
</lib-button-add1>`;

  buttonEditExample = `<!-- Botón Editar -->
<lib-button-action-edit1
  [item]="selectedItem"
  [disabled]="!selectedItem"
  (onClick)="onEditClick($event)">
</lib-button-action-edit1>`;

  buttonDeleteExample = `<!-- Botón Eliminar -->
<lib-button-action-delete1
  [item]="selectedItem"
  [disabled]="!selectedItem"
  (onClick)="onDeleteClick($event)"
  (onConfirm)="onDeleteConfirm($event)">
</lib-button-action-delete1>`;

  allButtonsExample = `<!-- Todos los botones en una fila -->
<div class="button-group">
  <lib-button-add1 (onClick)="onAdd()"></lib-button-add1>
  <lib-button-action-edit1 [item]="selected" (onClick)="onEdit($event)"></lib-button-action-edit1>
  <lib-button-action-delete1 [item]="selected" (onClick)="onDelete($event)"></lib-button-action-delete1>
</div>`;

  // Documentación de Componentes
  buttonComponents = [
    {
      name: 'ButtonAdd1',
      selector: 'lib-button-add1',
      description: 'Botón para agregar nuevos elementos',
      inputs: [
        { name: 'disabled', type: 'boolean', description: 'Deshabilitar el botón' },
        { name: 'label', type: 'string', description: 'Etiqueta personalizada' }
      ],
      outputs: [
        { name: 'onClick', type: 'EventEmitter<void>', description: 'Se dispara al hacer clic' }
      ]
    },
    {
      name: 'ButtonActionEdit1',
      selector: 'lib-button-action-edit1',
      description: 'Botón para editar elementos seleccionados',
      inputs: [
        { name: 'item', type: 'any', description: 'Elemento a editar' },
        { name: 'disabled', type: 'boolean', description: 'Deshabilitar el botón' },
        { name: 'label', type: 'string', description: 'Etiqueta personalizada' }
      ],
      outputs: [
        { name: 'onClick', type: 'EventEmitter<any>', description: 'Se dispara al hacer clic, emite el item' }
      ]
    },
    {
      name: 'ButtonActionDelete1',
      selector: 'lib-button-action-delete1',
      description: 'Botón para eliminar elementos (con confirmación)',
      inputs: [
        { name: 'item', type: 'any', description: 'Elemento a eliminar' },
        { name: 'disabled', type: 'boolean', description: 'Deshabilitar el botón' },
        { name: 'label', type: 'string', description: 'Etiqueta personalizada' }
      ],
      outputs: [
        { name: 'onClick', type: 'EventEmitter<any>', description: 'Se dispara al hacer clic' },
        { name: 'onConfirm', type: 'EventEmitter<any>', description: 'Se dispara cuando se confirma la eliminación' }
      ]
    }
  ];

  // Ejemplos de integración
  integrationExample = `import { Component } from '@angular/core';
import { ButtonAdd1Component, ButtonActionEdit1Component, ButtonActionDelete1Component } from 'lib-common-angular';

@Component({
  selector: 'app-crud-buttons',
  standalone: true,
  imports: [ButtonAdd1Component, ButtonActionEdit1Component, ButtonActionDelete1Component],
  template: \`
    <div class="button-container">
      <lib-button-add1 
        (onClick)="onAddItem()">
      </lib-button-add1>

      <lib-button-action-edit1 
        [item]="selectedItem"
        [disabled]="!selectedItem"
        (onClick)="onEditItem($event)">
      </lib-button-action-edit1>

      <lib-button-action-delete1 
        [item]="selectedItem"
        [disabled]="!selectedItem"
        (onClick)="onDeleteItem($event)"
        (onConfirm)="confirmDelete($event)">
      </lib-button-action-delete1>
    </div>
  \`
})
export class CrudButtonsComponent {
  selectedItem: any = null;

  onAddItem() {
    console.log('Agregar nuevo item');
    // Abrir diálogo de creación
  }

  onEditItem(item: any) {
    console.log('Editar item:', item);
    // Abrir diálogo de edición con el item
  }

  onDeleteItem(item: any) {
    console.log('Solicitud de eliminación:', item);
    // Mostrar confirmación
  }

  confirmDelete(item: any) {
    console.log('Confirmado: eliminar', item);
    // Ejecutar API para eliminar
  }
}`;
}
