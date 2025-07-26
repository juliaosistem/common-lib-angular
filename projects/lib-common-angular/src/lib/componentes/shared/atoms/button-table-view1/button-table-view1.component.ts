import { Component } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { grid, list } from 'ionicons/icons';
import { ComponentesDTO } from 'juliaositembackenexpress/dist/api/dtos/bussines/componentesDTO';

@Component({
  selector: 'lib-button-table-view1',
  standalone: true,
  imports: [IonIcon],
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
