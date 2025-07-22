import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonOptionsTableComponent } from '../../atoms/button-options-table/button-options-table.component';
import { PrimegModule } from '../../../../modulos/primeg.module';
import { ViewButtonsContainer1Component } from '../view-buttons-container1/view-buttons-container1.component';

@Component({
  selector: 'lib-tool-bar1',
  imports: [
    ButtonOptionsTableComponent,
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

  // ✅ Método para manejar el cambio desde el ViewButtonsContainer1
  onViewChange(newView: 'table' | 'grid'): void {
    this.viewChange.emit(newView);
  }
}
