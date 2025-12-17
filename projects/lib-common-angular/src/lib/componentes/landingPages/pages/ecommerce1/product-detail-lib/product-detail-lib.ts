import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetalleCarrito1Component } from 'lib-common-angular';
import {ProductoDTO } from '@juliaosistem/core-dtos';

@Component({
  selector: 'lib-product-detail-lib',
  standalone: true,
  imports: [CommonModule, DetalleCarrito1Component],
  templateUrl: './product-detail-lib.html',
})
export class DetalleProductoPageLib implements OnInit {
  @Input() product: ProductoDTO | undefined;
  @Input() isLogin = false;

  ngOnInit(): void {
    // El producto se espera vía Input desde el front o navegación con state.
    if (!this.product) {
      const nav = history.state as { product?: ProductoDTO; isLogin?: boolean };
      if (nav?.product) {
        this.product = nav.product;
        this.isLogin = !!nav.isLogin;
      }
    }
  }
}
