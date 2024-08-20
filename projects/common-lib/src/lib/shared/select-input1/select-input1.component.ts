import { Component, Input } from '@angular/core';
import { CoreModule } from '../../core/core.module';

@Component({
  selector: 'lib-select-input1',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './select-input1.component.html',
  styleUrl: './select-input1.component.css'
})
export class SelectInput1Component {

  @Input()
  lenguages :string[] =[]

}
