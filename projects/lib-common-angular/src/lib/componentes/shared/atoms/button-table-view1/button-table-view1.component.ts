import { Component } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { grid, list } from 'ionicons/icons';

@Component({
  selector: 'lib-button-table-view1',
  standalone: true,
  imports: [IonIcon],
  templateUrl: './button-table-view1.component.html',
  styleUrl: './button-table-view1.component.scss'
})
export class ButtonTableView1Component {
  constructor() {
    addIcons({ grid, list });
  }
}
