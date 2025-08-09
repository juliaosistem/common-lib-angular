import { Component } from '@angular/core';
import { Header2Component } from '../header2/header2.component';
import { CoreModuleLib } from '../../../../modulos/core.lib.module';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'lib-index2',
  standalone: true,
  imports: [Header2Component, CoreModuleLib,RouterOutlet],
  templateUrl: './index2.component.html',
  styleUrl: './index2.component.css'
})
export class Index2Component {

}
