import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonOptionsTableComponent } from '../../atoms/button-options-table/button-options-table.component';
import { ButtonAdd1Component } from '../../atoms/button-add1/button-add1.component';
import { PrimegModule } from '../../../../modulos/primeg.module';
import { ViewButtonsContainer1Component } from '../view-buttons-container1/view-buttons-container1.component';

@Component({
  selector: 'lib-tool-bar1',
  imports: [
    ButtonOptionsTableComponent,
    ButtonAdd1Component,
    PrimegModule,
    ViewButtonsContainer1Component
  ],
  templateUrl: './tool-bar1.component.html',
  styleUrl: './tool-bar1.component.scss',
})
export class ToolBar1Component {
  // ✅ Input para recibir la vista actual
  @Input() currentView: 'table' | 'grid' = 'table';
  
  // ✅ Output para emitir cambios de vista
  @Output() viewChange = new EventEmitter<'table' | 'grid'>();
  
  // ✅ Output para emitir eventos de nuevo item
  @Output() newItem = new EventEmitter<void>();

  // ✅ Output para emitir eventos de eliminar seleccionados
  @Output() deleteSelected = new EventEmitter<void>();

  // ✅ Output para emitir eventos de exportar a Excel
  @Output() exportToExcel = new EventEmitter<void>();

  // ✅ Método para manejar el cambio desde el ViewButtonsContainer1
  onViewChange(newView: 'table' | 'grid'): void {
    this.viewChange.emit(newView);
  }
  
  // ✅ Método para manejar el evento de agregar nuevo item
  onNewItem(): void {
    this.newItem.emit();
  }

  // ✅ Método para manejar la eliminación desde button-options-table
  onDeleteSelected(): void {
    this.deleteSelected.emit();
  }

  // ✅ Método para manejar la exportación a Excel
  onExportToExcel(): void {
    this.exportToExcel.emit();
  }
}
