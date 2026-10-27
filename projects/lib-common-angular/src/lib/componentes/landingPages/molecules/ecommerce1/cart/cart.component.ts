import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoItemDTO, DynamicField, FieldType } from '@juliaosistem/core-dtos';
import { map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Crud } from '../../../../shared/pages/crud/crud.component';
import { CrudDialog1Component } from '../../../../shared/molecules/crud-dialog1/crud-dialog1.component';
import { CartService } from '../../../../../services/cart.service';

@Component({
  selector: 'lib-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, Crud, CrudDialog1Component],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  readonly cart = inject(CartService);
  readonly state$ = this.cart.state$;
  readonly rows$ = this.cart.cart$.pipe(map(value => (value?.items ?? []).map(item => ({
    id: item.producto.id, name: item.producto.name, cantidad: item.cantidad,
    precio: item.subtotal / item.cantidad, subtotal: item.subtotal, moneda: item.moneda.codigo_iso,
  }))));
  readonly fieldTypeConfig: Record<string, FieldType> = {
    name: 'text', cantidad: 'number', precio: 'number', subtotal: 'number', moneda: 'text',
  };
  readonly fieldLabels = { name: 'Producto', cantidad: 'Cantidad', precio: 'Precio unitario', subtotal: 'Subtotal', moneda: 'Moneda' };
  readonly fieldOrder = ['name', 'cantidad', 'precio', 'subtotal', 'moneda'];
  readonly quantityFields: DynamicField[] = [{ key: 'cantidad', label: 'Cantidad', type: 'number', required: true, value: 1 }];
  currentItem: Record<string, unknown> = {};
  dialogVisible = false;
  checkoutVisible = false;
  medioPagoId = '';
  private editingItem?: CarritoItemDTO;
  private readonly destroyRef = inject(DestroyRef);

  /** @param row Linea seleccionada por el CRUD comun. */
  edit(row: Record<string, unknown>): void {
    this.editingItem = this.cart.getItem(String(row['id']));
    this.currentItem = { cantidad: row['cantidad'] };
    this.dialogVisible = !!this.editingItem;
  }

  /** @param rows Lineas seleccionadas por el CRUD, eliminadas juntas tras confirmar. */
  removeItems(rows: Record<string, unknown>[]): void {
    this.cart.removeProducts(rows.map(row => String(row['id']))).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  /** @param value Cantidad validada por el servicio antes de persistir. */
  save(value: Record<string, unknown>): void {
    if (!this.editingItem) return;
    const productId = this.editingItem.producto.id ?? '';
    this.cart.updateQuantity(this.editingItem, Number(value['cantidad'])).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(cart => {
      if (cart || !this.cart.getItem(productId)) this.dialogVisible = false;
    });
  }

  openCheckout(): void {
    this.checkoutVisible = true;
    this.cart.loadPaymentMethods().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  confirm(): void {
    this.cart.confirm(this.medioPagoId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  reload(): void {
    this.cart.loadCart().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }
}
