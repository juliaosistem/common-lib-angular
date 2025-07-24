import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PrimegModule } from '../../../../modulos/primeg.module';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicField, FieldType } from '../../interfaces/dynamic-field.interface';

@Component({
  selector: 'lib-tabla1',
  standalone: true,
  templateUrl: './tabla1.component.html',
  styleUrl: './tabla1.component.scss',
  imports: [CommonModule, TableModule, PrimegModule, FormsModule],
})
export class Tabla1Component implements OnInit {
  @Input() data: Record<string, unknown>[] = [];
  @Input() selectedItems!: Record<string, unknown>[] | null;
  
  // ✅ Nueva configuración flexible
  @Input() fieldTypeConfig: Record<string, FieldType> = {}; // Tipos por campo
  @Input() fieldLabels: Record<string, string> = {};        // Etiquetas personalizadas
  @Input() fieldOrder: string[] = [];                       // Orden de columnas
  @Input() excludeFields: string[] = ['id'];                // Campos a excluir
  
  fields: DynamicField[] = []; // Campos dinámicos generados
  displayFields: DynamicField[] = [];
  itemDialog: boolean = false;
  submitted: boolean = false;
  currentItem: Record<string, unknown> = {};
  
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit() {
    // Generar campos dinámicos basados en los datos de entrada
    if (this.data && this.data.length > 0) {
      this.fields = this.generateFieldsFromData(this.data);
      this.displayFields = [...this.fields];
    }
  }

  // ✅ Método principal para generar campos dinámicos
  private generateFieldsFromData(data: Record<string, unknown>[]): DynamicField[] {
    if (!data || data.length === 0) return [];

    // Obtener todas las claves únicas de los objetos
    const allKeys = this.getAllUniqueKeys(data);
    
    // Filtrar campos excluidos y determinar orden
    const orderedKeys = this.getOrderedKeys(allKeys);

    // Generar campos dinámicos
    return orderedKeys.map((key, index) => this.createDynamicField(key, index, data));
  }

  private getAllUniqueKeys(data: Record<string, unknown>[]): string[] {
    const allKeys = new Set<string>();
    data.forEach(item => {
      Object.keys(item).forEach(key => allKeys.add(key));
    });
    return Array.from(allKeys).filter(key => !this.excludeFields.includes(key));
  }

  private getOrderedKeys(availableKeys: string[]): string[] {
    return this.fieldOrder.length > 0 
      ? this.fieldOrder.filter(key => availableKeys.includes(key))
      : availableKeys.sort();
  }

  private createDynamicField(key: string, index: number, data: Record<string, unknown>[]): DynamicField {
    const fieldType = this.fieldTypeConfig[key] || this.detectFieldType(data, key);
    const label = this.fieldLabels[key] || this.formatLabel(key);

    return {
      key,
      label,
      type: fieldType,
      value: null, // Se asignará dinámicamente por cada fila
      order: index
    };
  }

  // ✅ Auto-detectar tipo de campo basado en los datos
  private detectFieldType(data: Record<string, unknown>[], key: string): FieldType {
    const sampleValue = data.find(item => item[key] !== null && item[key] !== undefined)?.[key];
    
    if (sampleValue === undefined || sampleValue === null) {
      return 'text';
    }

    if (typeof sampleValue === 'boolean') {
      return 'checkbox';
    }

    if (typeof sampleValue === 'number') {
      return 'number';
    }

    if (typeof sampleValue === 'string') {
      // Detectar si es una URL de imagen
      if (sampleValue.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return 'img';
      }
      
      // Por defecto, text
      return 'text';
    }

    return 'text';
  }

  // ✅ Formatear etiqueta desde el nombre del campo
  private formatLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1') // Separar camelCase
      .replace(/[_-]/g, ' ') // Reemplazar guiones y guiones bajos
      .replace(/\b\w/g, l => l.toUpperCase()) // Capitalizar palabras
      .trim();
  }

  formatDynamicFieldValue(field: DynamicField, value: unknown): string {
    if (value == null) return '-';
    return String(value);
  }

  getImageUrl(field: DynamicField, value: unknown): string {
    return String(value || '');
  }

  getImageAltText(field: DynamicField, item: Record<string, unknown>): string {
    return String(item['name'] || 'Image');
  }

  getFieldSeverity(): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    // Severidad por defecto para tags
    return 'info';
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
    
    const index = this.findIndexById(String(this.currentItem['id']));
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
    this.currentItem['id'] = this.createId();
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

  private findIndexById(id: string): number {
    return this.data.findIndex((item) => item['id'] === id);
  }

  private createId(): string {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
}
