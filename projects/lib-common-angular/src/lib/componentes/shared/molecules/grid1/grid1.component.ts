import { Component, signal, Input, OnInit } from '@angular/core';
import { Tag } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DataView } from 'primeng/dataview';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Product, ProductService } from '../../services/product.service';

@Component({
  selector: 'lib-grid1',
  standalone: true,
  imports: [Tag, ButtonModule, DataView, CommonModule, FormsModule],
  templateUrl: './grid1.component.html',
  styleUrl: './grid1.component.scss',
})
export class Grid1Component implements OnInit {
  layout: 'list' | 'grid' = 'grid';

  // ✅ Propiedades de entrada para compatibilidad con el CRUD
  @Input() data: Product[] = [];
  @Input() rCols: Array<{ id: number; field: string; header: string }> = [];
  @Input() rSelectedProducts: Product[] = [];

  products = signal<Product[]>([]);

  options = ['list', 'grid'];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    // ✅ Usar los datos recibidos por @Input en lugar del servicio
    if (this.data && this.data.length > 0) {
      this.products.set([...this.data]);
    } else {
      // Fallback al servicio si no hay datos por input
      this.products.set(this.productService.getProducts().slice(0, 12));
    }
  }

  getSeverity(product: Product) {
    switch (product.inventoryStatus) {
      case 'INSTOCK':
        return 'success';

      case 'LOWSTOCK':
        return 'warn';

      case 'OUTOFSTOCK':
        return 'danger';

      default:
        return null;
    }
  }
}
