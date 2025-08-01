import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimegModule } from '../../../../modulos/primeg.module';
import { DynamicField, FieldType } from '../../interfaces/dynamic-field.interface';
import { DynamicFieldService } from '../../services/dynamic-field.service';
import { ButtonActionsRow1Component } from '../../atoms/button-actions-row1/button-actions-row1.component';
import { ComponentesDTO } from 'juliaositembackenexpress/dist/api/dtos/bussines/componentesDTO';

@Component({
  selector: 'lib-grid1',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimegModule, ButtonActionsRow1Component],
  templateUrl: './grid1.component.html',
  styleUrl: './grid1.component.scss',
})
export class Grid1Component implements OnInit {
  layout: 'list' | 'grid' = 'grid';

  @Input() data: Record<string, unknown>[] = [];
  @Input() selectedItems!: Record<string, unknown>[] | null;
  @Output() selectedItemsChange = new EventEmitter<Record<string, unknown>[] | null>();
  @Input() fieldTypeConfig: Record<string, FieldType> = {}; // Tipos por campo
  @Input() fieldLabels: Record<string, string> = {};        // Etiquetas personalizadas
  @Input() fieldOrder: string[] = [];                       // Orden de columnas
  @Input() excludeFields: string[] = ['id'];                // Campos a excluir
  @Input() fieldSelectOptions: Record<string, string[]> = {}; // Opciones para campos select
  @Input() displayFields: DynamicField[] = [];              // Campos para mostrar

  @Input() showDefaultGrid: boolean = true;                 // Mostrar grid por defecto

  // Propiedades del paginador
  @Input() rows: number = 10;                               // Filas por página
  @Input() paginator: boolean = true;                       // Habilitar paginador
  @Input() rowsPerPageOptions: number[] = [10, 20, 30];     // Opciones de filas por página
  @Input() showCurrentPageReport: boolean = true;           // Mostrar reporte de página

  @Output() editItem = new EventEmitter<Record<string, unknown>>();
  
  fields: DynamicField[] = []; // Campos dinámicos generados

  componente: ComponentesDTO = {
    id: 19,
    nombreComponente: 'lib-grid1',
    version: '1.0'
  };

  constructor(
    private dynamicFieldService: DynamicFieldService
  ) {}

  ngOnInit() {
    this.initFields();
  }

  initFields() {
    // Inicializar campos dinámicos si no se han generado y no se pasan desde el padre
    if (this.fields.length === 0 && this.displayFields.length === 0) {
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

  // ✅ Eventos que se emiten al componente padre
  onEditItem(item: Record<string, unknown>) {
    this.editItem.emit(item);
  }

  // ✅ Métodos para manejo de selección
  onSelectionChange(selectedItems: Record<string, unknown>[] | null) {
    this.selectedItems = selectedItems;
    this.selectedItemsChange.emit(selectedItems);
  }

  isItemSelected(item: Record<string, unknown>): boolean {
    if (!this.selectedItems) return false;
    return this.selectedItems.some(selected => selected['id'] === item['id']);
  }

  toggleItemSelection(item: Record<string, unknown>, event: { checked: boolean }) {
    if (!this.selectedItems) {
      this.selectedItems = [];
    }

    const isSelected = this.isItemSelected(item);
    
    if (event.checked && !isSelected) {
      // Agregar item a la selección
      this.selectedItems = [...this.selectedItems, item];
    } else if (!event.checked && isSelected) {
      // Remover item de la selección
      this.selectedItems = this.selectedItems.filter(selected => selected['id'] !== item['id']);
    }

    this.selectedItemsChange.emit(this.selectedItems);
  }
}
