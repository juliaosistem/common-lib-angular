import { Component } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { grid, apps } from 'ionicons/icons';
import { ComponentesDTO } from '@juliaosistem/core-dtos';
@Component({
  selector: 'lib-button-card-view1',
  standalone: true,
  imports: [IonIcon],
  templateUrl: './button-card-view1.component.html',
  styleUrl: './button-card-view1.component.scss'
})
export class ButtonCardView1Component {

  componente: ComponentesDTO = {
    id: 10,
    nombreComponente: 'lib-button-card-view1',
    version: '1.0',
  };

  constructor() {
    addIcons({ grid, apps });
  }
}
