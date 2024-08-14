import { Component } from '@angular/core';
import { CoreModule } from '../../../../core/core.module';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'lib-body',
  standalone: true,
  imports: [CoreModule,RouterOutlet],
  templateUrl: './body.component.html',
  styleUrl: './body.component.css'
})
export class BodyComponent {

  data = [
    { title: 'Tile 1', cols: 1, rows: 1, content: 'Content of tile 1' },
    { title: 'Tile 2', cols: 1, rows: 1, content: 'Content of tile 2' },
    { title: 'Tile 3', cols: 1, rows: 1, content: 'Content of tile 3' },
    { title: 'Tile 4', cols: 2, rows: 1, content: 'Content of tile 4' },
  ];

}
