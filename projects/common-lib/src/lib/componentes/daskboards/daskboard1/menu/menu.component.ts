import { Component, Input } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { CoreModule } from '../../../../core/core.module';
import { BodyComponent } from '../body/body.component';

@Component({
  selector: 'lib-menu',
  standalone: true,
  imports: [CoreModule,BodyComponent,FooterComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  @Input() appName: string = '';
  @Input() logoSrc: string = '';
  @Input() email: string = '';
  
}
