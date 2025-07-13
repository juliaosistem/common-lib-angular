import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Product, ProductService } from '../../../../../../../lib-common-angular-demo/src/app/core/services/product.service';
import { PrimegModule } from '../../../../modulos/primeg.module';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductDialog1Component } from '../product-dialog1/product-dialog1.component';
interface Column {
  id: number;
  field: string;
  header: string;
  customExportHeader?: string;
}

@Component({
  selector: 'lib-tabla1',
  standalone: true,
  templateUrl: './tabla1.component.html',
  styleUrl: './tabla1.component.scss',
  imports: [TableModule, PrimegModule, FormsModule, ProductDialog1Component],
})
export class Tabla1Component {
  @Input() data: Product[] = [];
  @Input() rCols: Column[] = [];
  @Input() rSelectedProducts!: Product[] | null;

  // 


  product!: Product;
  productDialog: boolean = false;
  
  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit() {
    // Aquí puedes realizar acciones adicionales al inicializar el componente
    // console.log('Tabla1Component ngOnInit:', this.data);
  }

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warn';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'info';
    }
  }

  

  
  editProduct(product: Product) {
    this.product = { ...product };
    this.productDialog = true;
  }
  
  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.data = this.data.filter((val) => val.id !== product.id);
        this.product = {};
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Deleted',
          life: 3000,
        });
      },
    });
  }
}
