import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PrimegModule } from '../../../../modulos/primeg.module';
import { FormsModule } from '@angular/forms';
import { DynamicField, FieldType } from '../../interfaces/dynamic-field.interface';
import { DynamicFieldService } from '../../services/dynamic-field.service';
import { ButtonActionEdit1Component } from '../../atoms/button-action-edit1/button-action-edit1.component';
import { ButtonActionDelete1Component } from '../../atoms/button-action-delete1/button-action-delete1.component';

@Component({
  selector: 'lib-tabla1',
  standalone: true,
  templateUrl: './tabla1.component.html',
  styleUrl: './tabla1.component.scss',
  imports: [CommonModule, TableModule, PrimegModule, FormsModule, ButtonActionEdit1Component, ButtonActionDelete1Component],
})
export class Tabla1Component implements OnInit {
  @Input() data: Record<string, unknown>[] = [];
  @Input() selectedItems!: Record<string, unknown>[] | null;
  @Output() selectedItemsChange = new EventEmitter<Record<string, unknown>[] | null>();
  @Input() fieldTypeConfig: Record<string, FieldType> = {}; // Tipos por campo
  @Input() fieldLabels: Record<string, string> = {};        // Etiquetas personalizadas
  @Input() fieldOrder: string[] = [];                       // Orden de columnas
  @Input() excludeFields: string[] = ['id'];                // Campos a excluir
  @Input() fieldSelectOptions: Record<string, string[]> = {}; // Opciones para campos select
  @Input() displayFields: DynamicField[] = [];              // Campos para mostrar

  // Propiedades del paginador
  @Input() rows: number = 10;                               // Filas por página
  @Input() paginator: boolean = true;                       // Habilitar paginador
  @Input() rowsPerPageOptions: number[] = [10, 20, 30];     // Opciones de filas por página
  @Input() showCurrentPageReport: boolean = true;           // Mostrar reporte de página

  @Output() editItem = new EventEmitter<Record<string, unknown>>();
  @Output() deleteItem = new EventEmitter<Record<string, unknown>>();
  
  fields: DynamicField[] = []; // Campos dinámicos generados
  
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

  onDeleteItem(item: Record<string, unknown>) {
    this.deleteItem.emit(item);
  }

  // ✅ Método para capturar cambios de selección de PrimeNG
  onSelectionChange(newSelection: Record<string, unknown>[] | null) {
    this.selectedItems = newSelection;
    this.selectedItemsChange.emit(newSelection);
  }
}
