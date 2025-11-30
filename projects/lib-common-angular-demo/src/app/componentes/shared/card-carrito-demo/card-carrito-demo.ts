import { Component, OnInit } from '@angular/core';
import { ProductoDTO } from '@juliaosistem/core-dtos';
import { CardProductos1Component, ProductService } from "lib-common-angular";

@Component({
  selector: 'app-card-carrito-demo',
  imports: [CardProductos1Component],
  templateUrl: './card-carrito-demo.html',
  styleUrl: './card-carrito-demo.scss',
})
export class CardCarritoDemo implements OnInit {
  products!:ProductoDTO  [];

    constructor(private productSvc: ProductService) { 

    }
  ngOnInit(): void {

    this.products = this.productSvc.mockProductosInflablesDTO();
  }
}
