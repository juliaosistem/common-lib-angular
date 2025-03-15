import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DaskBoard3 } from 'lib-common-angular';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'lib-common-angular-demo';
}
