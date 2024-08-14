import { Component } from '@angular/core';
import { Header2Component } from '../header2/header2.component';
import { CoreModule } from '../../../../core/core.module';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'lib-index2',
  standalone: true,
  imports: [Header2Component, CoreModule,RouterOutlet],
  templateUrl: './index2.component.html',
  styleUrl: './index2.component.css'
})
export class Index2Component {

}
