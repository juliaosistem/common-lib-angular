import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonOptionsTableComponent } from '../../atoms/button-options-table/button-options-table.component';
import { ButtonAdd1Component } from '../../atoms/button-add1/button-add1.component';
import { ButtonDelete1Component } from '../../atoms/button-delete1/button-delete1.component';
import { PrimegModule } from '../../../../modulos/primeg.module';
import { ViewButtonsContainer1Component } from '../view-buttons-container1/view-buttons-container1.component';
import { ComponentesDTO } from 'juliaositembackenexpress/dist/api/dtos/bussines/componentesDTO';

@Component({
  selector: 'lib-tool-bar1',
  imports: [
    CommonModule,
    ButtonOptionsTableComponent,
    ButtonAdd1Component,
    ButtonDelete1Component,
    PrimegModule,
    ViewButtonsContainer1Component
  ],
  templateUrl: './tool-bar1.component.html',
  styleUrl: './tool-bar1.component.scss',
})
export class ToolBar1Component {
  @Input() currentView: 'table' | 'grid' = 'table';
  @Input() showAddButton: boolean = true;
  @Input() selectedItems: Record<string, unknown>[] = [];
  @Input() showDropdownAddButton: boolean = true;
  @Input() showDropdownDeleteButton: boolean = false;

  @Output() viewChange = new EventEmitter<'table' | 'grid'>();
  @Output() newItem = new EventEmitter<void>();
  @Output() deleteSelected = new EventEmitter<void>();
  @Output() exportToExcel = new EventEmitter<void>();

  componente: ComponentesDTO = {
    id: 16,
    nombreComponente: 'lib-tool-bar1',
    version: '1.0'
  };

  // ✅ Getter para determinar si mostrar el botón delete
  get shouldShowDeleteButton(): boolean {
    return this.selectedItems.length > 0;
  }

  onViewChange(newView: 'table' | 'grid'): void {
    this.viewChange.emit(newView);
  }
  
  onNewItem(): void {
    this.newItem.emit();
  }

  onDeleteSelected(): void {
    this.deleteSelected.emit();
  }

  onExportToExcel(): void {
    this.exportToExcel.emit();
  }
}
