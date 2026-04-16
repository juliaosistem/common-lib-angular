import { Component ,Input } from '@angular/core';
import { GoogleService } from '../../../..//services/google.service';
import { BusinessDTO } from '@juliaosistem/core-dtos';
import { PrimegModule } from '../../../../modulos/primeg.module';
import { ProductoDTO } from '@juliaosistem/core-dtos';
import { ProductService } from '../../../../services/product.service';


@Component({
  selector: 'lib-sh-wats-button-card',
  imports: [PrimegModule],
  templateUrl: './sh-wats-button-card.html',
  styleUrl: './sh-wats-button-card.css',
})
export class ShWatsButtonCard {

  // producto a compartir
  @Input() product : ProductoDTO = {} as ProductoDTO;
  @Input() DatosNegocio: BusinessDTO | null = null;

  // indica si el usuario está logueado
  @Input() isLogin: boolean = false;

  // descuento del producto
  @Input() discount: number = 0;

   constructor(
    private productSvc : ProductService,
    private googleService: GoogleService
  ) {}

  shareProductOnWhatsapp(): void {
    const whatsappNumber = this.DatosNegocio?.telefono || '+573118025433';
    const text = `Mira este producto: ${this.product?.name ?? ''} - ${window.location.href}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    if (this.DatosNegocio?.googleAdsConversionId) {
      this.googleService.reportConversion(this.DatosNegocio.googleAdsConversionId, whatsappUrl);
    } else {
      window.open(whatsappUrl, '_blank');
    }
    if (this.DatosNegocio?.googleAnalyticsEvent) {
      this.googleService.reportAnalyticsEvent(this.DatosNegocio.googleAnalyticsEvent, { producto: this.product?.name });
    }
  }

}
