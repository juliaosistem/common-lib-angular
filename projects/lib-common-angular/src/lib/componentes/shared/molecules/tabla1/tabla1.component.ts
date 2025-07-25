import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PrimegModule } from '../../../../modulos/primeg.module';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicField, FieldType } from '../../interfaces/dynamic-field.interface';
import { DynamicFieldService } from '../../services/dynamic-field.service';

@Component({
  selector: 'lib-tabla1',
  standalone: true,
  templateUrl: './tabla1.component.html',
  styleUrl: './tabla1.component.scss',
  imports: [CommonModule, TableModule, PrimegModule, FormsModule],
})
export class Tabla1Component implements OnInit {
  @Input() tableTitle: string = 'Table Title'; 
  @Input() data: Record<string, unknown>[] = [];
  @Input() selectedItems!: Record<string, unknown>[] | null;
  
  @Input() fieldTypeConfig: Record<string, FieldType> = {}; // Tipos por campo
  @Input() fieldLabels: Record<string, string> = {};        // Etiquetas personalizadas
  @Input() fieldOrder: string[] = [];                       // Orden de columnas
  @Input() excludeFields: string[] = ['id'];                // Campos a excluir
  @Input() fieldSelectOptions: Record<string, string[]> = {}; // Opciones para campos select
  
  fields: DynamicField[] = []; // Campos dinámicos generados
  displayFields: DynamicField[] = [];
  itemDialog: boolean = false;
  submitted: boolean = false;
  currentItem: Record<string, unknown> = {};
  
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dynamicFieldService: DynamicFieldService
  ) {}

  ngOnInit() {
    this.initFields();
  }

  initFields() {
    // Inicializar campos dinámicos si no se han generado
    if (this.fields.length === 0) {
      this.fields = this.dynamicFieldService.generateFieldsFromData({
        data: this.data,
        fieldTypeConfig: this.fieldTypeConfig,
        fieldLabels: this.fieldLabels,
        fieldOrder: this.fieldOrder,
        excludeFields: this.excludeFields
      });
      this.displayFields = [...this.fields];
    }
  }

  // ✅ Métodos de renderizado - delegan al servicio
  formatDynamicFieldValue(field: DynamicField, value: unknown): string {
    return this.dynamicFieldService.formatDynamicFieldValue(field, value);
  }

  getImageUrl(field: DynamicField, value: unknown): string {
    return this.dynamicFieldService.getImageUrl(field, value);
  }

  getImageAltText(field: DynamicField, item: Record<string, unknown>): string {
    return this.dynamicFieldService.getImageAltText(field, item);
  }

  getFieldSeverity(): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    return this.dynamicFieldService.getFieldSeverity();
  }

  // ✅ Obtener opciones para campos de tipo select
  getSelectOptions(fieldKey: string): { label: string; value: string }[] {
    const options = this.fieldSelectOptions[fieldKey] || [];
    return options.map(option => ({ label: option, value: option }));
  }

  editItem(item: Record<string, unknown>) {
    this.currentItem = { ...item };
    this.itemDialog = true;
  }

  deleteItem(item: Record<string, unknown>) {
    const itemName = String(item['name'] || 'this item');
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + itemName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.data = this.data.filter((val) => val['id'] !== item['id']);
        this.currentItem = {};
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Item Deleted',
          life: 3000,
        });
      },
    });
  }

  hideDialog() {
    this.itemDialog = false;
    this.submitted = false;
  }

  saveItem() {
    this.submitted = true;

    if (this.currentItem['name'] && String(this.currentItem['name']).trim()) {
      if (this.currentItem['id']) {
        this.updateExistingItem();
      } else {
        this.createNewItem();
      }
      this.finalizeItemSave();
    }
  }

  private updateExistingItem() {
    if (!this.currentItem['id']) return;
    
    const index = this.dynamicFieldService.findIndexById(this.data, String(this.currentItem['id']));
    if (index !== -1) {
      this.data[index] = { ...this.currentItem };

      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Item Updated',
        life: 3000,
      });
    }
  }

  private createNewItem() {
    this.currentItem['id'] = this.dynamicFieldService.generateId();
    this.data.push({ ...this.currentItem });

    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Item Created',
      life: 3000,
    });
  }

  private finalizeItemSave() {
    this.data = [...this.data];
    this.itemDialog = false;
    this.currentItem = {};
  }
}
