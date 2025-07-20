import { Component, Input } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import {  TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { PrimegModule } from '../../../../modulos/primeg.module';
import { Tabla1Component } from '../../molecules/tabla1/tabla1.component';
import { ToolBar1Component } from '../../molecules/tool-bar1/tool-bar1.component';
import { TablaDataSharedDTO } from 'juliaositembackenexpress/dist/api/dtos/componentes-common-lib-angular/tablaDataSharedDTO';
import { Menu } from 'primeng/menu';
import { Product } from '../../services/product.service';


@Component({
    selector: 'lib-crud',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        PrimegModule,
        ToolBar1Component,
        Tabla1Component,
    ],
     templateUrl: './crud.component.html',
     providers: [MessageService, ConfirmationService]
})
   
export class Crud  {
    @Input()productDialog: boolean = false;

   @Input() submitted: boolean = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input()  tablaDataSharedDTO: TablaDataSharedDTO<Menu, Product> = new TablaDataSharedDTO<Menu, Product>();

   @Input() cargado :boolean = false;

// agrega todos los inputs y outputs necesarios  en TablaDataSharedDTO esto parque que aqui se le pasen los datos en un solo DTO
 
    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

  
}
