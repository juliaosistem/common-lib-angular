import { Component } from '@angular/core';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';

import { ButtonTableView1Component } from '../../atoms/button-table-view1/button-table-view1.component';
import { ButtonCardView1Component } from '../../atoms/button-card-view1/button-card-view1.component';
import { FormsModule } from '@angular/forms';

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
  stateOptions = [
    { label: 'Table View', value: 'table' },
    { label: 'Card View', value: 'card' },
  ];

  value: string = 'table';
}
