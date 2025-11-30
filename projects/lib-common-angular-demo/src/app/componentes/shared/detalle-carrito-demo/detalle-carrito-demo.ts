import { ProductService } from 'lib-common-angular';
import { Component, OnInit } from '@angular/core';
import { DetalleCarrito1Component } from "lib-common-angular";
import { ProductoDTO } from '@juliaosistem/core-dtos';

@Component({
  selector: 'app-detalle-carrito-demo',
  imports: [DetalleCarrito1Component],
  templateUrl: './detalle-carrito-demo.html',
  styleUrl: './detalle-carrito-demo.scss'
})
export class DetalleCarritoDemo implements OnInit {

  product!:ProductoDTO ;

    constructor(private productSvc: ProductService) { 

    }
    ngOnInit(): void {
      this.product = this.productSvc.mockProductoDTO();
    }
}
