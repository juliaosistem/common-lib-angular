import { MenuDTO } from './../../../models/MenuDTO';
import { IonicModule } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-link1',
  templateUrl: './link1.component.html',
  styleUrls: ['./link1.component.scss'],
  standalone:true,
  imports:[IonicModule ,RouterLink]
})
export class Link1Component  implements OnInit {

  @Input()
  menu: MenuDTO []  | undefined

  constructor() { }

  ngOnInit() {
    console.log("funciona")
  }

}
