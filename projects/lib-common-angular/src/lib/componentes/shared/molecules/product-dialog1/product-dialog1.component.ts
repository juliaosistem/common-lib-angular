import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { PrimegModule } from '../../../../modulos/primeg.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ComponentesDTO } from 'juliaositembackenexpress/dist/api/dtos/bussines/componentesDTO';

@Component({
  selector: 'lib-product-dialog1',
  imports: [CommonModule, FormsModule, PrimegModule],
  templateUrl: './product-dialog1.component.html',
  styleUrls: ['./product-dialog1.component.scss']
})
export class ProductDialog1Component implements OnInit, OnChanges {
  
  @Input() productDialog: boolean = false;
  @Input() product: Record<string, unknown> = {};
  @Input() statuses: string[] = [];
  @Input() triggerSave?: EventEmitter<void>;
  
  @Output() productDialogChange = new EventEmitter<boolean>();
  @Output() onSave = new EventEmitter<Record<string, unknown>>();
  @Output() onCancel = new EventEmitter<void>();

  componente: ComponentesDTO = {
    id: 23,
    nombreComponente: 'lib-product-dialog1',
    version: '1.0'
  };

  submitted: boolean = false;
  originalProduct: Record<string, unknown> = {};

  ngOnInit() {
    // Crear una copia del producto para evitar modificar el original
    if (this.product) {
      this.originalProduct = { ...this.product };
    }

    // Suscribirse al triggerSave si está disponible
    if (this.triggerSave) {
      this.triggerSave.subscribe(() => {
        this.saveProduct();
      });
    }
  }

  ngOnChanges() {
    // Cuando se abre el dialog, crear una copia del producto
    if (this.productDialog && this.product) {
      this.originalProduct = { ...this.product };
    }

    // Suscribirse al triggerSave si cambia
    if (this.triggerSave) {
      this.triggerSave.subscribe(() => {
        this.saveProduct();
      });
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
    
    if (this.product['name'] && typeof this.product['name'] === 'string' && this.product['name'].trim()) {
      // Emitir el producto modificado
      this.onSave.emit(this.product);
      
      // Cerrar el dialog
      this.productDialog = false;
      this.productDialogChange.emit(false);
      this.submitted = false;
    }
  }
}
