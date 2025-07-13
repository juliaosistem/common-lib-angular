import { Component,OnInit } from '@angular/core';
import { Crud } from 'lib-common-angular';
import { Product } from '../../core/services/product.service';

@Component({
  selector: 'app-crud',
  imports: [Crud],
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.scss'
})
export class CrudComponent implements  OnInit {

aqui tienes q implementar la logica para el crud 
traerte los servicios de la libreria
y el crud.ts solo debe entender lo generico

 tablaDataSharedDTO: TablaDataSharedDTO<Menu, Product> = new TablaDataSharedDTO<Menu, Product>();
  
 constructor(
          private productService: ProductService,
          private messageService: MessageService,
          private confirmationService: ConfirmationService
      ) {}
}
