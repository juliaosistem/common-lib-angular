import { Component } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { grid, apps } from 'ionicons/icons';

@Component({
  selector: 'lib-button-card-view1',
  standalone: true,
  imports: [IonIcon],
  templateUrl: './button-card-view1.component.html',
  styleUrl: './button-card-view1.component.scss'
})
export class ButtonCardView1Component {
  constructor() {
    addIcons({ grid, apps });
  }
}
