import { Component, OnInit, OnDestroy,  Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PrimegModule } from '../../../../../modulos/primeg.module';
import { ProductoDTO,ImagenDTO, ComponentesDTO } from '@juliaosistem/core-dtos';
import { Router } from '@angular/router';
import { ButtonAddToCard1 } from "../../../atoms/button-add-to-card1/button-add-to-card1";


@Component({
  selector: 'lib-card-productos1',
  imports: [CommonModule, PrimegModule, ButtonAddToCard1],
  providers: [CurrencyPipe],
  templateUrl: './card-productos1.component.html',
  styleUrl: './card-productos1.component.scss',
  standalone: true
})
export class CardProductos1Component implements OnInit, OnDestroy {
  
  componente:ComponentesDTO = {
          id: 26,
          nombreComponente: 'lib-card-productos1',
          version: '1.0',
          descripcion: 'Componente card para mostrar productos'
        }

  @Input() 
  product: ProductoDTO = {
    id:'550e8400-e29b-41d4-a716-446655440000',
    name: "Maleta Viaje Mediana Con Ruedas Resistente Moderna 20-22kg",

    precio: [{
      codigo_iso: "COP",
      nombreMoneda: "Peso colombiano",
      precio: 350000
    }, {
      codigo_iso: "USD",
      nombreMoneda: "Dólar estadounidense",
      precio: 95
    }],

    idCategoria: "Viajes y equipaje",
    cantidad: 15,
    imagen: [{
      id: "1",
      url: "https://placehold.co/600x600/F5C7A5/000?text=Maleta+Rosa",
      alt: "Maleta Rosa",
      idComponente: 0
    }, {
      id: "2",
      url: "https://placehold.co/600x600/FFFF33/000?text=Maleta+Amarilla",
      alt: "Maleta Amarilla",
      idComponente: 0
    }, {
      id: "3",
      url: "https://placehold.co/600x600/F5C7A5/000?text=Maleta+Rosa",
      alt: "Maleta Amarilla",
      idComponente: 0
    }, {
      id: "4",
      url: "https://placehold.co/600x600/FFFFCC/000?text=Maleta+beige",
      alt: "Maleta Beige",
      idComponente: 0
    }
  
  ],
    descripcion: '',
    comision: 0,
    fechaCreacion: '',
    fechaActualizacion: '',
    estado: "Activo",
    idDatosUsuario: "550e8400-e29b-41d4-a716-446655440000",
    idBusiness: 1
  };
  

  currentImageIndex: number = 0;
 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  autoSlideInterval: any;
  discount: number = 0;
  installmentPrice: string = '';


  constructor(private currencyPipe: CurrencyPipe, private router: Router) {}

  ngOnInit(): void {
    this.calculateDiscount();
    this.calculateInstallmentPrice();
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  get currentImage(): ImagenDTO {
    return this.product.imagen[this.currentImageIndex];
  }

  get currentImageUrl(): string {
    return this.currentImage.url;
  }

  

  calculateDiscount(): number {
    if(this.product.descuento && this.product.descuento > 0)
      return this.discount = this.product.precio[0].precio - (this.product.precio[0].precio * this.product.descuento / 100)
    else
      return this.discount = this.product.precio[0].precio;
  }

  calculateInstallmentPrice(): void {
    const installment = (this.product.precio[0].precio / 3).toLocaleString('es-CO', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
    this.installmentPrice = installment;
  }

  prevImage(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.product.imagen.length) % this.product.imagen.length;
  }

  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.product.imagen.length;
  }

  selectImage(index: number): void {
    this.currentImageIndex = index;
  }

  isActiveThumbnail(index: number): boolean {
    return this.currentImageIndex === index;
  }

  startAutoSlide(): void {
    this.stopAutoSlide();
    this.autoSlideInterval = setInterval(() => {
      this.nextImage();
    }, 3000);
  }

  stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  onMouseEnter(): void {
    this.stopAutoSlide();
  }

  onMouseLeave(): void {
    this.startAutoSlide();
  }




  shareProductOnWhatsapp(): void {
    const text = `¡Mira esto! ${this.product.name} por solo $${this.currencyPipe.transform(this.discount, this.product.precio[0].codigo_iso ,'code')}`;
    const url = window.location.href;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(whatsappUrl, '_blank');
    console.log('¡Compartiendo por WhatsApp!');
  }

  shareProduct(): void {
    console.log('¡Lógica de compartir aquí!');
  }

  /**
   * Navega al detalle del producto
   */
  navigateToProductDetail(): void {
    if (this.product?.id) {
      this.router.navigate(['/producto/detalle', this.product.id]);
    }
  }

}
