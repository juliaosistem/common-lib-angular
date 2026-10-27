import { Component } from '@angular/core';
import { addIcons } from 'ionicons';
import { grid, list } from 'ionicons/icons';
import { ComponentesDTO } from '@juliaosistem/core-dtos';

@Component({
  selector: 'lib-button-table-view1',
  standalone: true,
  imports: [],
  templateUrl: './button-table-view1.component.html',
  styleUrl: './button-table-view1.component.scss'
})
export class ButtonTableView1Component {

  componente: ComponentesDTO = {
    id: 12,
    nombreComponente: 'lib-button-table-view1',
    version: '1.0',
  };

  constructor() {
    addIcons({ grid, list });
  }
}
