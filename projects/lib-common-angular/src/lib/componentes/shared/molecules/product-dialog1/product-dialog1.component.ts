import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PrimegModule } from '../../../../modulos/primeg.module';
import { Product } from '../../../../core/product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-product-dialog1',
  imports: [CommonModule, FormsModule, PrimegModule],
  templateUrl: './product-dialog1.component.html',
  styleUrls: ['./product-dialog1.component.scss']
})
export class ProductDialog1Component implements OnInit {
  
  @Input() productDialog: boolean = false;
  @Input() product: Product = {};
  @Input() statuses: string[] = [];
  
  @Output() productDialogChange = new EventEmitter<boolean>();
  @Output() onSave = new EventEmitter<unknown>();
  @Output() onCancel = new EventEmitter<void>();
  
  submitted: boolean = false;
  originalProduct: Product = {};

  ngOnInit() {
    // Crear una copia del producto para evitar modificar el original
    if (this.product) {
      this.originalProduct = { ...this.product };
    }
  }

  ngOnChanges() {
    // Cuando se abre el dialog, crear una copia del producto
    if (this.productDialog && this.product) {
      this.originalProduct = { ...this.product };
    }
  }

  hideDialog() {
    this.productDialog = false;
    this.productDialogChange.emit(false);
    this.submitted = false;
    
    // Restaurar el producto original si se cancela
    if (this.originalProduct) {
      Object.assign(this.product, this.originalProduct);
    }
    
    this.onCancel.emit();
  }

  saveProduct() {
    this.submitted = true;
    
    if (this.product.name && this.product.name.trim()) {
      // Emitir el producto modificado
      this.onSave.emit(this.product);
      
      // Cerrar el dialog
      this.productDialog = false;
      this.productDialogChange.emit(false);
      this.submitted = false;
    }
  }
}
