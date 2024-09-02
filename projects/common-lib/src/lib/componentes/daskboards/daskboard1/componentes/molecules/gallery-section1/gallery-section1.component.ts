import { ImagenDTO } from '../../../models/ImagenDTO';
import { CoreModule } from './../../../../../../core/core.module';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-gallery-section1',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './gallery-section1.component.html',
  styleUrl: './gallery-section1.component.css'
})
export class GallerySection1Component {
  @Input()
  imagenes :ImagenDTO[] | undefined

}
