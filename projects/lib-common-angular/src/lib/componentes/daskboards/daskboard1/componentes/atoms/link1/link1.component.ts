import { IonicModule } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { MenuDTO } from '@juliaosistem/core-dtos';

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

  private langChangeSubscription: Subscription | undefined;


  constructor(private translate:TranslateService) { }

  ngOnInit() {
    console.log("menu antes de cargarlo",this.menu)
    console.log("funciona")
    this.loadMenu()
    this.langChangeSubscription = this.translate.onLangChange.subscribe(() => {
      this.updateMenuTranslations();
    });
    
    console.log("menu Despues de loadMenu " , this.menu)
  }

  loadMenu() {
    this.translate.get(['index', 'menu.servicios']).subscribe(translations => {
     const defualtMenu: MenuDTO [] = [
        {   id: '1', url: 'index',
          icon: 'N/A',
          itemName: translations['index'],
          subItemName: '',
          nameRol: ["USER", "ADMIN"]
        },
        { 
          id: '2',
          url: 'Servicios',
          icon: 'N/A',
          itemName: translations['menu.servicios'],
          subItemName: '',
          nameRol: ["USER", "ADMIN"]
        }
      ];

     defualtMenu.forEach(e =>{ 
      if(this.menu?.findIndex(i => e.id === i.id) === -1 )
      this.menu?.push(e)
       });
    });
  }

  updateMenuTranslations(): void {
 
    this.translate.get(['index', 'menu.servicios']).subscribe(translations => {
      this.menu?.forEach(item => {
        if (item.id === '1') {
          item.itemName = translations['index'];
        } else if (item.id === '2') {
          item.itemName = translations['menu.servicios'];
        }
      });
    });
  }



}


