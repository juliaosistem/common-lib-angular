import { Component } from '@angular/core';
import { ButtonOptionsTableComponent } from '../../atoms/button-options-table/button-options-table.component';
import { PrimegModule } from '../../../../modulos/primeg.module';

@Component({
  selector: 'lib-tool-bar1',
  imports: [
    ButtonOptionsTableComponent,
    PrimegModule,
  ],
  templateUrl: './tool-bar1.component.html',
  styleUrl: './tool-bar1.component.scss',
})
export class ToolBar1Component {
  
}
