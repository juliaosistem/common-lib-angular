import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Crud } from 'lib-common-angular';
import { Terminal } from 'lib-common-angular';
import { CrudDialog1Component } from 'lib-common-angular';
import { PrimegModule } from 'lib-common-angular';
import { FieldType } from '@juliaosistem/core-dtos';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
}

@Component({
  selector: 'app-crud-doc-page',
  standalone: true,
  imports: [PrimegModule, CommonModule, Crud, CrudDialog1Component, Terminal],
  templateUrl: './crud-doc-page.component.html',
  styleUrl: './crud-doc-page.component.scss'
})
export class CrudDocPageComponent {
  Terminal = Terminal;

  users = signal<Record<string, unknown>[]>([
    {
      id: 1,
      name: 'Ana Pérez García',
      email: 'ana.perez@example.com',
      role: 'Administrador',
      status: 'active',
      joinDate: '2023-01-15'
    },
    {
      id: 2,
      name: 'Carlos López Martínez',
      email: 'carlos.lopez@example.com',
      role: 'Usuario',
      status: 'inactive',
      joinDate: '2023-03-20'
    },
    {
      id: 3,
      name: 'María González Ruiz',
      email: 'maria.gonzalez@example.com',
      role: 'Editor',
      status: 'active',
      joinDate: '2023-05-10'
    }
  ]);

  // ✅ --- CONFIGURACIÓN CRUD ---
  fieldTypeConfig: Record<string, FieldType> = {
    id: 'number',
    name: 'text',
    email: 'text',
    role: 'select',
    status: 'select',
    joinDate: 'text'
  };

  fieldLabels: Record<string, string> = {
    id: 'ID',
    name: 'Nombre Completo',
    email: 'Correo Electrónico',
    role: 'Rol',
    status: 'Estado',
    joinDate: 'Fecha de Registro'
  };

  fieldSelectOptions: Record<string, { label: string; value: string }[]> = {
    role: [
      { label: 'Administrador', value: 'admin' },
      { label: 'Editor', value: 'editor' },
      { label: 'Usuario', value: 'user' },
      { label: 'Invitado', value: 'guest' }
    ],
    status: [
      { label: 'Activo', value: 'active' },
      { label: 'Inactivo', value: 'inactive' },
      { label: 'Suspendido', value: 'suspended' }
    ]
  };

  fieldOrder: string[] = ['name', 'email', 'role', 'status', 'joinDate'];
  excludeFields: string[] = ['id'];
  tableType: 'table' | 'grid' = 'table';
  loaded = true;
  submitted = false;

  // ✅ --- MODAL STATE ---
  showDialog: boolean = false;
  dialogCurrentItem: Record<string, unknown> = {};
  dialogDisplayFields: any[] = [];
  dialogFieldSelectOptions: Record<string, any> = {};

  // ✅ --- HANDLERS CRUD ---
  onNewItem() {
    this.dialogCurrentItem = {};
    this.dialogDisplayFields = Object.keys(this.fieldTypeConfig).filter(f => f !== 'id');
    this.dialogFieldSelectOptions = this.fieldSelectOptions;
    this.showDialog = true;
  }

  onEditItem(item: Record<string, unknown>) {
    this.dialogCurrentItem = { ...item };
    this.dialogDisplayFields = Object.keys(this.fieldTypeConfig).filter(f => f !== 'id');
    this.dialogFieldSelectOptions = this.fieldSelectOptions;
    this.showDialog = true;
  }

  onItemSaved(item: Record<string, unknown>) {
    console.log('Item guardado:', item);
  }

  onDialogSave(item: Record<string, unknown>) {
    const currentUsers = this.users();
    const index = currentUsers.findIndex(u => u['id'] === item['id']);
    if (index >= 0) {
      currentUsers[index] = item;
    } else {
      const newId = Math.max(...currentUsers.map(u => u['id'] as number)) + 1;
      currentUsers.push({ id: newId, ...item });
    }
    this.users.set([...currentUsers]);
    this.showDialog = false;
  }

  onDialogCancel() {
    this.showDialog = false;
  }

  onDataChanged(updatedData: Record<string, unknown>[]) {
    this.users.set(updatedData);
  }

  onDeleteItem(item: Record<string, unknown>) {
    const itemId = item['id'] as number;
    const currentUsers = this.users().filter(u => u['id'] !== itemId);
    this.users.set(currentUsers);
  }

  // ✅ --- DOCUMENTACIÓN CON TERMINAL ---
  basicUsageCode = `import { Component } from '@angular/core';
import { Crud, PrimegModule } from 'lib-common-angular';

@Component({
  selector: 'app-my-crud',
  standalone: true,
  imports: [Crud, PrimegModule],
  template: \`
    <lib-crud
      [data]="users"
      [fieldTypeConfig]="fieldTypeConfig"
      [fieldLabels]="fieldLabels"
      [rows]="10"
      [paginator]="true"
      (newItemRequest)="onNewItem()"
      (editItemRequest)="onEditItem($event)"
      (dataChange)="onDataChanged($event)">
    </lib-crud>
  \`
})
export class MyComponentComponent {
  users = [
    { id: 1, name: 'Ana Pérez', email: 'ana@example.com' }
  ];

  fieldTypeConfig = {
    name: 'text',
    email: 'text'
  };

  fieldLabels = {
    name: 'Nombre',
    email: 'Correo'
  };

  onNewItem() { }
  onEditItem(item: any) { }
  onDataChanged(data: any[]) { }
}`;

  configurationCode = `// ✅ 1. Configuración de tipos de campo
fieldTypeConfig: Record<string, FieldType> = {
  id: 'number',
  name: 'text',
  email: 'text',
  price: 'number',
  category: 'select',
  status: 'boolean',
  image: 'img',
  joinDate: 'text'
};

// ✅ 2. Etiquetas personalizadas  
fieldLabels: Record<string, string> = {
  id: 'ID',
  name: 'Nombre Completo',
  email: 'Correo Electrónico',
  price: 'Precio',
  category: 'Categoría',
  status: 'Activo',
  image: 'Foto',
  joinDate: 'Fecha Registro'
};

// ✅ 3. Opciones para select
fieldSelectOptions: Record<string, { label: string; value: string }[]> = {
  category: [
    { label: 'Electrónica', value: 'electronics' },
    { label: 'Ropa', value: 'clothing' }
  ],
  status: [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' }
  ]
};

// ✅ 4. Orden y exclusión
fieldOrder: string[] = ['name', 'email', 'price', 'category', 'status'];
excludeFields: string[] = ['id', 'createdAt'];`;

  modalIntegrationCode = `// ✅ Integración con Modal (CrudDialog1)
export class MyComponent {
  showDialog: boolean = false;
  dialogCurrentItem: Record<string, unknown> = {};
  dialogDisplayFields: unknown[] = [];
  dialogFieldSelectOptions: Record<string, any> = {};

  onNewItem() {
    this.dialogCurrentItem = { };
    this.dialogDisplayFields = Object.keys(this.fieldTypeConfig)
      .filter(f => f !== 'id');
    this.dialogFieldSelectOptions = this.fieldSelectOptions;
    this.showDialog = true;
  }

  onEditItem(item: Record<string, unknown>) {
    this.dialogCurrentItem = { ...item };
    this.dialogDisplayFields = Object.keys(this.fieldTypeConfig)
      .filter(f => f !== 'id');
    this.dialogFieldSelectOptions = this.fieldSelectOptions;
    this.showDialog = true;
  }

  onDialogSave(item: Record<string, unknown>) {
    const index = this.users.findIndex(u => u['id'] === item['id']);
    if (index >= 0) {
      this.users[index] = item;
    } else {
      this.users.push(item);
    }
    this.showDialog = false;
  }

  onDialogCancel() {
    this.showDialog = false;
  }
}`;

  htmlTemplateCode = `<!-- ✅ Componente CRUD con Modal -->
<lib-crud
  [data]="users"
  [fieldTypeConfig]="fieldTypeConfig"
  [fieldLabels]="fieldLabels"
  [fieldOrder]="fieldOrder"
  [excludeFields]="excludeFields"
  [fieldSelectOptions]="fieldSelectOptions"
  [tableType]="tableType"
  [rows]="10"
  [paginator]="true"
  (newItemRequest)="onNewItem()"
  (editItemRequest)="onEditItem($event)"
  (dataChange)="onDataChanged($event)"
  (deleteItemRequest)="onDeleteItem($event)">
</lib-crud>

<!-- ✅ Dialog Modal CRUD -->
<lib-crud-dialog1
  [(visible)]="showDialog"
  [displayFields]="dialogDisplayFields"
  [currentItem]="dialogCurrentItem"
  [fieldSelectOptions]="dialogFieldSelectOptions"
  (save)="onDialogSave($event)"
  (cancel)="onDialogCancel()">
</lib-crud-dialog1>`;

  // ✅ --- DOCUMENTACIÓN DE INPUTS ---
  inputsDocs = [
    { name: 'data', type: 'any[]', description: 'Array de objetos que se muestran en la tabla.' },
    { name: 'rows', type: 'number', description: 'Número de filas por página (default: 10).' },
    { name: 'paginator', type: 'boolean', description: 'Habilita paginación (default: true).' },
    { name: 'tableType', type: "'table' | 'grid'", description: "Tipo de vista: 'table' o 'grid' (default: 'table')." },
    { name: 'fieldTypeConfig', type: 'Record<string, FieldType>', description: 'Define el tipo de dato de cada campo.' },
    { name: 'fieldLabels', type: 'Record<string, string>', description: 'Etiquetas personalizadas para los headers.' },
    { name: 'fieldOrder', type: 'string[]', description: 'Define el orden en que se muestran las columnas.' },
    { name: 'excludeFields', type: 'string[]', description: 'Campos que NO se muestran en la tabla.' },
    { name: 'fieldSelectOptions', type: 'Record<string, any[]>', description: 'Opciones para campos de tipo select.' }
  ];

  // ✅ --- DOCUMENTACIÓN DE OUTPUTS ---
  outputsDocs = [
    { name: 'newItemRequest', type: 'EventEmitter<void>', description: 'Se dispara al hacer clic en "Nuevo".' },
    { name: 'editItemRequest', type: 'EventEmitter<Record<string, unknown>>', description: 'Se dispara al editar.' },
    { name: 'deleteItemRequest', type: 'EventEmitter<Record<string, unknown>>', description: 'Se dispara al eliminar.' },
    { name: 'dataChange', type: 'EventEmitter<Record<string, unknown>[]>', description: 'Se dispara cuando los datos cambian.' },
    { name: 'itemSaved', type: 'EventEmitter<Record<string, unknown>>', description: 'Se dispara cuando se guarda un item.' },
    { name: 'dialogCanceled', type: 'EventEmitter<void>', description: 'Se dispara al cancelar la edición en el modal.' }
  ];

  // ✅ --- DOCUMENTACIÓN DE TIPOS DE CAMPO ---
  fieldTypesDocs = [
    { type: 'text', description: 'Input de texto simple.' },
    { type: 'number', description: 'Input numérico.' },
    { type: 'boolean', description: 'Checkbox para valores true/false.' },
    { type: 'select', description: 'Dropdown con opciones predefinidas.' },
    { type: 'img', description: 'Visualización de imágenes en la tabla.' },
    { type: 'file', description: 'Upload de archivos.' }
  ];
}
