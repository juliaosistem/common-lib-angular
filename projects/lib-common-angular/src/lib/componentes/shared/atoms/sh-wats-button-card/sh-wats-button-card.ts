import { Component ,Input} from '@angular/core';
import { PrimegModule } from '../../../../modulos/primeg.module';
import { ProductoDTO } from '@juliaosistem/core-dtos';
import { ProductService } from '../../services/product.service';


@Component({
  selector: 'lib-sh-wats-button-card',
  imports: [PrimegModule],
  templateUrl: './sh-wats-button-card.html',
  styleUrl: './sh-wats-button-card.css',
})
export class ShWatsButtonCard {

  // producto a compartir
  @Input() product : ProductoDTO = {} as ProductoDTO;

  // indica si el usuario está logueado
  @Input() isLogin: boolean = false;

  // descuento del producto
  @Input() discount: number = 0;

   constructor(
    private productSvc : ProductService

  ) {}

  shareProductOnWhatsapp(): void {
    const url = window.location.href;
    this.productSvc.contactWhatsapp('+573118025433', url, this.isLogin , this.product);
  }

}
