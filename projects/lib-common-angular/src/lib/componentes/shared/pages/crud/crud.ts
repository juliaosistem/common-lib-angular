import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { PrimegModule } from '../../../../modulos/primeg.module';
import { Tabla1Component } from '../../molecules/tabla1/tabla1.component';
import { ToolBar1Component } from '../../molecules/tool-bar1/tool-bar1.component';
import { TablaDataSharedDTO } from 'juliaositembackenexpress/dist/api/dtos/componentes-common-lib-angular/tablaDataSharedDTO';
import { Menu } from 'primeng/menu';


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
   
export class Crud implements OnInit {
    productDialog: boolean = false;

    submitted: boolean = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input()  tablaDataSharedDTO: TablaDataSharedDTO<Menu, any> = new TablaDataSharedDTO<Menu, Product>();

   

    

    public cargado :boolean = false;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

  
}
