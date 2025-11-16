import { Component, signal } from '@angular/core';
import { Crud, CrudDocComponent, PrimegModule } from 'lib-common-angular';

@Component({
  selector: 'app-crud-doc-page',
  standalone: true,
  imports: [PrimegModule, CrudDocComponent, Crud],
  templateUrl: './crud-doc-page.component.html'
})
export class CrudDocPageComponent {
  // Componente demo
  Crud = Crud;

  // Datos de ejemplo
  users = signal([
    { id: 1, name: 'Ana Pérez', email: 'ana@example.com', role: 'Admin' },
    { id: 2, name: 'Carlos Ruiz', email: 'carlos@example.com', role: 'User' }
  ]);

  // --- Eventos CRUD ---
  onNewItem() {
  }

  onEditItem(item: any) {
  }

  onItemSaved(item: any) {
  }

  onDialogCanceled() {
  }

  // --- Documentación ---
  exampleCode = `
<lib-crud
  [data]="users"
  [rows]="5"
  [paginator]="true"
  (newItemRequest)="onNewItem()"
  (editItemRequest)="onEditItem($event)"
  (itemSaved)="onItemSaved($event)"
  (dialogCanceled)="onDialogCanceled()">
</lib-crud>
`;

  // Documentación de Inputs
  inputsDocs = [
    { name: 'data', type: 'any[]', description: 'Datos que se muestran en la tabla o grid.' },
    { name: 'rows', type: 'number', description: 'Número de filas por página.' },
    { name: 'paginator', type: 'boolean', description: 'Habilita paginación.' },
    { name: 'tableType', type: `'table' | 'grid'`, description: 'Tipo de vista (tabla o grid).' },
    { name: 'fieldTypeConfig', type: 'Record<string, FieldType>', description: 'Configuración de tipo de cada campo.' },
    { name: 'fieldLabels', type: 'Record<string, string>', description: 'Etiquetas personalizadas para cada campo.' },
    { name: 'fieldOrder', type: 'string[]', description: 'Orden de las columnas.' },
    { name: 'excludeFields', type: 'string[]', description: 'Campos a excluir de la vista.' },
    { name: 'fieldSelectOptions', type: 'Record<string,string[]>', description: 'Opciones para campos select dinámicos.' },
  ];

  // Documentación de Outputs
  outputsDocs = [
    { name: 'newItemRequest', type: 'EventEmitter<void>', description: 'Se dispara al solicitar un nuevo item.' },
    { name: 'editItemRequest', type: 'EventEmitter<any>', description: 'Se dispara al solicitar editar un item existente.' },
    { name: 'itemSaved', type: 'EventEmitter<any>', description: 'Se dispara cuando un item se guarda.' },
    { name: 'dialogCanceled', type: 'EventEmitter<void>', description: 'Se dispara al cancelar el diálogo de edición.' },
    { name: 'dataChange', type: 'EventEmitter<any[]>', description: 'Se dispara cuando los datos cambian (p. ej., al eliminar).' }
  ];
}
