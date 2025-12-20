import { Component ,Input} from '@angular/core';
import { PrimegModule } from '../../../../modulos/primeg.module';
import { ProductoDTO } from '@juliaosistem/core-dtos';
import { CurrencyPipe } from '@angular/common';


@Component({
  selector: 'lib-sh-wats-button-card',
  imports: [PrimegModule],
  templateUrl: './sh-wats-button-card.html',
  styleUrl: './sh-wats-button-card.css',
  providers: [CurrencyPipe]
})
export class ShWatsButtonCard {

  // producto a compartir
  @Input() product : ProductoDTO = {} as ProductoDTO;

  // indica si el usuario está logueado
  @Input() isLogin: boolean = false;

  // descuento del producto
  @Input() discount: number = 0;

   constructor(
    private currencyPipe: CurrencyPipe,
  ) {}

  shareProductOnWhatsapp(): void {
    const url = window.location.href;
    let text = '';

    if (this.isLogin) {
      const precio = this.currencyPipe.transform(this.discount, this.product.precios[0].codigo_iso, 'code');
      text = `¡Mira esto! ${this.product.name} por solo ${precio}`;
    } else {
      const id = this.product?.id ?? '';
      text = `Hola, estoy interesado en el producto Referencia ${id}: ${this.product.name}`;
    }

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
  }

}
