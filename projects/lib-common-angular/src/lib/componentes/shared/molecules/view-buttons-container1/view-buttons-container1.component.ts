import { Component, Output, EventEmitter, Input } from '@angular/core';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';

import { ButtonTableView1Component } from '../../atoms/button-table-view1/button-table-view1.component';
import { ButtonCardView1Component } from '../../atoms/button-card-view1/button-card-view1.component';
import { FormsModule } from '@angular/forms';
import { ComponentesDTO } from 'juliaositembackenexpress/dist/api/dtos/bussines/componentesDTO';

@Component({
  selector: 'lib-view-buttons-container1',
  standalone: true,
  imports: [
    CommonModule,
    SelectButtonModule,
    ButtonTableView1Component,
    ButtonCardView1Component,
    FormsModule,
  ],
  templateUrl: './view-buttons-container1.component.html',
  styleUrl: './view-buttons-container1.component.scss',
})
export class ViewButtonsContainer1Component {
  // Input para recibir el valor actual desde el componente padre
  @Input() currentView: 'table' | 'grid' = 'table';
  
  // Output para emitir cuando cambia la vista
  @Output() viewChange = new EventEmitter<'table' | 'grid'>();

  componente: ComponentesDTO = {
    id: 20,
    nombreComponente: 'lib-view-buttons-container1',
    version: '1.0'
  };

  stateOptions = [
    { label: 'Table View', value: 'table' },
    { label: 'Card View', value: 'grid' },
  ];

  // Getter/Setter para sincronizar con currentView
  get value(): string {
    return this.currentView;
  }

  set value(newValue: string) {
    if (newValue === 'table' || newValue === 'grid') {
      this.currentView = newValue;
      this.viewChange.emit(newValue);
    }
  }
}
