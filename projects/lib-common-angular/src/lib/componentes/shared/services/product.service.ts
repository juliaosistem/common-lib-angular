/* eslint-disable max-lines-per-function */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoriaDTO, ProductoDTO } from '@juliaosistem/core-dtos';
import { LibConfigService } from '../../../config/lib-config.service';
import { JuliaoSystemCrudHttpService } from '../../../config/JuliaoSystemCrudHttpService';


export interface Product {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    inventoryStatus?: string;
    category?: string;
    image?: string;
    rating?: number;
}

@Injectable({
    providedIn: 'root'
})
export class ProductService extends JuliaoSystemCrudHttpService<ProductoDTO, ProductoDTO> {

  
    constructor(http: HttpClient, private configService: LibConfigService) {
        super(http);
        const baseUrl = this.configService.get<string>('baseUrlProducts') || 'http://localhost:3000/products';
        this.basePathUrl = `${baseUrl}/product`;
        }


    /** 
     * Genera el texto para compartir en WhatsApp basado en el estado de inicio de sesión y el producto.
     * @param isLogin Indica si el usuario ha iniciado sesión.
     * @param product El producto para el cual se genera el texto.
     * @return El texto formateado para WhatsApp.
     *
    */
  getTextWhatsapp(isLogin: boolean ,product: ProductoDTO): string {
    let text = '';

        if (isLogin) {
            const precio = this.formatCurrency(product.descuento, product.precios?.[0]?.codigo_iso);
            text = `¡Mira esto! ${product.name} por solo ${precio}`;
        } else {
            const id = product?.id ?? '';
            text = `Hola, estoy interesado en el producto Referencia ${id}: ${product.name}`;
        }
        return text;
    }

    /**
     * Formatea un número como moneda usando Intl.NumberFormat
     */
    private formatCurrency(value: number | undefined, currency: string = 'USD'): string {
        if (typeof value !== 'number' || isNaN(value)) return '';
        let locale = 'es-CO';
        if (currency === 'EUR') locale = 'es-ES';
        // Puedes agregar más condiciones para otros códigos de moneda si lo necesitas
        try {
            return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
        } catch {
            return value + ' ' + currency;
        }
    }

  /**
   * Abre WhatsApp para compartir información del producto con un mensaje
   * basado en si el usuario tiene sesión iniciada.
   * @param domain Dominio o URL base para compartir.
   * @param isLogin Indica si el usuario ha iniciado sesión.
   * @param Product El producto para el cual se genera el texto.
   */
  shareProductOnWhatsapp(domain :string,isLogin: boolean ,Product: ProductoDTO): void {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(this.getTextWhatsapp(isLogin, Product) + ' ' + domain)}`, '_blank');
  }

  /**
   * Abre WhatsApp para contactar directamente a un número predefinido
   * con un mensaje basado en si el usuario tiene sesión        window.open( iniciada.
   * @param whatsappNumber Número de WhatsApp al que se enviará el mensaje.
   * @param domain Dominio o URL base para compartir.
   * @param isLogin Indica si el usuario ha iniciado sesión.
   * @param Product El producto para el cual se genera el texto.
   */
  contactWhatsapp(whatsappNumber: string  = '+573118025433',domain:string, isLogin:boolean ,Product:ProductoDTO): void {
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(this.getTextWhatsapp(isLogin, Product) + ' ' + domain)}`, '_blank');
  }
    
      mockProductoDTO(): ProductoDTO {
        return {
            id: '550e8400-e29b-41d4-a716-446655440000',
            name: "Maleta Viaje Mediana Con Ruedas Resistente Moderna 20-22kg",

            precios: [{
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

    }

    /**
     * Método para Agregarle el nombre de la categoría a cada producto
     * @param products Lista de productos a los cuales se les va a agregar el nombre de la categoría
     * @param categorias Lista de categorías disponibles
     * @return Lista de productos con el nombre de la categoría agregado
     */
    addNameCategoriaToProducts(products: ProductoDTO[], categorias: CategoriaDTO[]): ProductoDTO[] {
        return products.map(product => {
            const categoria = categorias.find(c => c.id === product.idCategoria);
            if (categoria) {
                product.nombreCategoria = categoria.nombreCategoria;
            }
            return product;
        });
    }

 mockCategoriaInflablesDTO(): CategoriaDTO []{
        return [  

            {
                id: 'MCAS',
                nombreCategoria: "Mini Castillos",
                  tipoCategoria: {  id: 1, nombreTipoCategoria: "Inflables"  }                
            },
            {
                id: 'CAS',
                nombreCategoria: "Castillos",
                  tipoCategoria: {  id: 1, nombreTipoCategoria: "Inflables"  }                
            },
             {
                id: 'TOB',
                nombreCategoria: "Toboganes",
                  tipoCategoria: {  id: 1, nombreTipoCategoria: "Inflables"  }                
            },
             {
                id: 'MTOB',
                nombreCategoria: "Mini Toboganes",
                  tipoCategoria: {  id: 1, nombreTipoCategoria: "Inflables"  }                
            },
             {
                id: 'DES',
                nombreCategoria: "Diseños Especiales",
                  tipoCategoria: {  id: 1, nombreTipoCategoria: "Inflables"  }                
            },
            {
                id: 'PUB',
                nombreCategoria: "Publicitarios",
                  tipoCategoria: {  id: 1, nombreTipoCategoria: "Inflables"  }                
            },
            
          ];
 }
     // Interfaces asumidas: ProductoDTO, MonedaDTO, ImagenDTO

mockProductosInflablesDTO(): ProductoDTO[] {
  return [
    {
      id: 'MCAS25-001',
      name: 'PISCINA DE PELOTAS 3X3',
      precios: [{ codigo_iso: 'COP', nombreMoneda: 'Peso colombiano', precio: 3100000 }],
      descuento: 0,
      cantidad: 0,
      idBusiness: 1,
      idCategoria: 'MCAS',
      nombreCategoria: '',
      imagen: [{ id: '1', url: '../../../../../assets/imagenes/castillos/castillo-picinadepelotas3x3-inflable1.png', alt: 'Castillo inflable ', idComponente: 0 },

        { id: '2', url: '../../../../../assets/imagenes/castillos/castillo-picinadepelotas3x3-inflable2.png', alt: 'Castillo inflable ', idComponente: 0 },
        { id: '3', url: '../../../../../assets/imagenes/castillos/castillo-picinadepelotas3x3-inflable3.png', alt: 'Castillo inflable ', idComponente: 0 },
      ],
      estado: 'Activo',
      descripcion: 'MINI CASTILLO 2.50 ALTO X 3 DE ANCHO X 3 DE FONDO IMPRESIONES OPCIONALES DE 50 X 70',
      comision: 0,
      fechaCreacion: '',
      fechaActualizacion: '',
      idDatosUsuario: '550e8400-e29b-41d4-a716-446655440000'
    },
    {
      id: 'MCAS25-002',
      name: 'CASTILLO MALLAS',
      precios: [{ codigo_iso: 'COP', nombreMoneda: 'Peso colombiano', precio: 3100000 }],
      descuento: 0,
      cantidad: 0,
      idBusiness: 1,
      idCategoria: 'MCAS',
      nombreCategoria: '',
      imagen: [
        { id: '4', url: '../../../../../assets/imagenes/castillos/castillo-mayas-inflable1.png', alt: 'Castillo inflable Recreativo', idComponente: 0 },
        { id: '5', url: '../../../../../assets/imagenes/castillos/castillo-mayas-inflable2.png', alt: 'Castillo inflable Recreativo', idComponente: 0 },
        { id: '6', url: '../../../../../assets/imagenes/castillos/castillo-mayas-inflable3.png', alt: 'Castillo inflable Recreativo', idComponente: 0 },
        { id: '7', url: '../../../../../assets/imagenes/castillos/castillo-mayas-inflable4.png', alt: 'Castillo inflable Recreativo', idComponente: 0 },
      ],
      estado: 'Activo',
      descripcion: 'MINI CASTILLO 2.50 ALTO X 3 DE ANCHO X 3 DE FONDO IMPRESIONES OPCIONALES DE 50 X 70',
      comision: 0,
      fechaCreacion: '',
      fechaActualizacion: '',
      idDatosUsuario: '550e8400-e29b-41d4-a716-446655440000'
    },
    {
      id: 'MCAS25-003',
      name: 'CASTILLO RESBALADERO',
      precios: [{ codigo_iso: 'COP', nombreMoneda: 'Peso colombiano', precio: 3100000 }],
      descuento: 0,
      cantidad: 0,
      idBusiness: 1,
      idCategoria: 'MCAS',
      nombreCategoria: '',
      imagen: [
        { id: '8', url: '../../../../../assets/imagenes/castillos/castillo-resbaladero-inflable1.png', alt: 'Castillo inflable Recreativo', idComponente: 0 },
        { id: '9', url: '../../../../../assets/imagenes/castillos/castillo-resbaladero-inflable2.png', alt: 'Castillo inflable Recreativo', idComponente: 0 },
        { id: '10', url: '../../../../../assets/imagenes/castillos/castillo-resbaladero-inflable3.png', alt: 'Castillo inflable Recreativo', idComponente: 0 },

      ],
      estado: 'Activo',
      descripcion: 'MINI CASTILLO 2.50 ALTO X 3 DE ANCHO X 3 DE FONDO IMPRESIONES OPCIONALES DE 50 X 70',
      comision: 0,
      fechaCreacion: '',
      fechaActualizacion: '',
      idDatosUsuario: '550e8400-e29b-41d4-a716-446655440000'
    },
    {
      id: 'MCAS25-004',
      name: 'COCODRILO',
      precios: [{ codigo_iso: 'COP', nombreMoneda: 'Peso colombiano', precio: 4699000 }],
      descuento: 0,
      cantidad: 0,
      idBusiness: 1,
      idCategoria: 'MCAS',
      nombreCategoria: '',
      imagen: [
        { id: '11', url: '../../../../../assets/imagenes/castillos/castillo-minicocodrillo-inflable1.png', alt: 'Castillo Cocodrillo inflable Recreativo', idComponente: 0 },
        { id: '12', url: '../../../../../assets/imagenes/castillos/castillo-minicocodrillo-inflable2.png', alt: 'Castillo Cocodrillo inflable Recreativo', idComponente: 0 },
        { id: '13', url: '../../../../../assets/imagenes/castillos/castillo-minicocodrillo-inflable3.png', alt: 'Castillo Cocodrillo inflable Recreativo', idComponente: 0 },
        { id: '14', url: '../../../../../assets/imagenes/castillos/castillo-minicocodrillo-inflable4.png', alt: 'Castillo Cocodrillo inflable Recreativo', idComponente: 0 },
    ],
      estado: 'Activo',
      descripcion: 'MINI CASTILLO 2.50 ALTO X 4 DE ANCHO X 4 DE FONDO CABEZA DE COCODRILO SIN IMPRESIONES',
      comision: 0,
      fechaCreacion: '',
      fechaActualizacion: '',
      idDatosUsuario: '550e8400-e29b-41d4-a716-446655440000'
    },
    {
      id: 'MCAS25-005',
      name: 'CASTILLO MINI LEGO',
      precios: [{ codigo_iso: 'COP', nombreMoneda: 'Peso colombiano', precio: 4799000 }],
      descuento: 0,
      cantidad: 10,
      idBusiness: 1,
      idCategoria: 'MCAS',
      nombreCategoria: '',
      imagen: [
        { id: '15', url: '../../../../../assets/imagenes/castillos/castillo-miniLego-inflable1.png', alt: 'Castillo Lego inflable Recreativo', idComponente: 0 },
        { id: '16', url: '../../../../../assets/imagenes/castillos/castillo-miniLego-inflable2.png', alt: 'Castillo Lego inflable Recreativo', idComponente: 0 },
        { id: '17', url: '../../../../../assets/imagenes/castillos/castillo-miniLego-inflable3.png', alt: 'Castillo Lego inflable Recreativo', idComponente: 0 },
    ],
      estado: 'Activo',
      descripcion: 'MINI CASTILLO 2 ALTO X 4.20 DE ANCHO X 2.80 DE FONDO SIN IMPRESIONES',
      comision: 0,
      fechaCreacion: '',
      fechaActualizacion: '',
      idDatosUsuario: '550e8400-e29b-41d4-a716-446655440000'
    },
    {
      id: 'MCAS25-006',
      name: 'COCODRILO PALMERAS',
      precios: [{ codigo_iso: 'COP', nombreMoneda: 'Peso colombiano', precio: 4950000 }],
      descuento: 0,
      cantidad: 0,
      idBusiness: 1,
      idCategoria: 'MCAS',
      nombreCategoria: '',
      imagen: [
        { id: '18', url: '../../../../../assets/imagenes/castillos/castillo-palmeras-inflable1.png', alt: 'Castillo Palmeras inflable Recreativo', idComponente: 0 },
        { id: '19', url: '../../../../../assets/imagenes/castillos/castillo-palmeras-inflable2.png', alt: 'Castillo Palmeras inflable Recreativo', idComponente: 0 },
        { id: '20', url: '../../../../../assets/imagenes/castillos/castillo-palmeras-inflable3.png', alt: 'Castillo Palmeras inflable Recreativo', idComponente: 0 },
      ],
      estado: 'Activo',
      descripcion: 'MINI CASTILLO 2.20 ALTO X 4.50 DE ANCHO X 4 DE FONDO SIN IMPRESIONES',
      comision: 0,
      fechaCreacion: '',
      fechaActualizacion: '',
      idDatosUsuario: '550e8400-e29b-41d4-a716-446655440000'
    },
    {
      id: 'MCAS25-007',
      name: 'HIPOPOTAMO',
      precios: [{ codigo_iso: 'COP', nombreMoneda: 'Peso colombiano', precio: 5100000 }],
      descuento: 0,
      cantidad: 1,
      idBusiness: 1,
      idCategoria: 'MCAS',
      nombreCategoria: '',
      imagen: [
         { id: '21', url: '../../../../../assets/imagenes/castillos/castillo-hipopotamo-inflable1.png', alt: 'Castillo Hipopótamo inflable Recreativo', idComponente: 0 },
        { id: '22', url: '../../../../../assets/imagenes/castillos/castillo-hipopotamo-inflable2.png', alt: 'Castillo Hipopótamo inflable Recreativo', idComponente: 0 },
        { id: '23', url: '../../../../../assets/imagenes/castillos/castillo-hipopotamo-inflable3.png', alt: 'Castillo Hipopótamo inflable Recreativo', idComponente: 0 },
      ],
      estado: 'Activo',
      descripcion: 'MINI CASTILLO 2 ALTO X 4 DE ANCHO X 4 DE FONDO IMPRESIONES OPCIONALES',
      comision: 0,
      fechaCreacion: '',
      fechaActualizacion: '',
      idDatosUsuario: '550e8400-e29b-41d4-a716-446655440000'
    },
    {
      id: 'MCAS25-008',
      name: 'MINI ZIGMA',
      precios: [{ codigo_iso: 'COP', nombreMoneda: 'Peso colombiano', precio: 2300000 }],
      descuento: 0,
      cantidad: 20,
      idBusiness: 1,
      idCategoria: 'MCAS',
      nombreCategoria: '',
      imagen: [
        { id: '24', url: '../../../../../assets/imagenes/castillos/castillo-minizigma-inflable1.png', alt: 'Castillo Mini Zigma inflable Recreativo', idComponente: 0 },
        { id: '25', url: '../../../../../assets/imagenes/castillos/castillo-minizigma-inflable2.png', alt: 'Castillo Mini Zigma inflable Recreativo', idComponente: 0 },
        { id: '26', url: '../../../../../assets/imagenes/castillos/castillo-minizigma-inflable3.png', alt: 'Castillo Mini Zigma inflable Recreativo', idComponente: 0 },
        { id: '27', url: '../../../../../assets/imagenes/castillos/castillo-minizigma-inflable4.png', alt: 'Castillo Mini Zigma inflable Recreativo', idComponente: 0 },

    ],
      estado: 'Activo',
      descripcion: '2 X 2 METROS (COLORES E IMPRESIÓN FRONTAL PERSONALIZABLE) (SIN PISCINA DE PELOTAS)',
      comision: 0,
      fechaCreacion: '',
      fechaActualizacion: '',
      idDatosUsuario: '550e8400-e29b-41d4-a716-446655440000'
    },
    {
      id: 'MCAS25-009',
      name: 'MINI ZIGMA BALL POOL',
      precios: [{ codigo_iso: 'COP', nombreMoneda: 'Peso colombiano', precio: 2600000 }],
      descuento: 0,
      cantidad: 20,
      idBusiness: 1,
      idCategoria: 'MCAS',
      nombreCategoria: '',
      imagen: [
         { id: '28', url: '../../../../../assets/imagenes/castillos/castillo-BALL POOL-inflable1.png', alt: 'Castillo MINI ZIGMA BALL POOL inflable Recreativo', idComponente: 0 },
        { id: '29', url: '../../../../../assets/imagenes/castillos/castillo-BALL POOL-inflable2.png', alt: 'Castillo MINI ZIGMA BALL POOL inflable Recreativo', idComponente: 0 },
        { id: '30', url: '../../../../../assets/imagenes/castillos/castillo-BALL POOL-inflable3.png', alt: 'Castillo MINI ZIGMA BALL POOL inflable Recreativo', idComponente: 0 },
        { id: '31', url: '../../../../../assets/imagenes/castillos/castillo-BALL POOL-inflable4.png', alt: 'Castillo MINI ZIGMA BALL POOL inflable Recreativo', idComponente: 0 },
        { id: '32', url: '../../../../../assets/imagenes/castillos/castillo-BALL POOL-inflable5.png', alt: 'Castillo MINI ZIGMA BALL POOL inflable Recreativo', idComponente: 0 },
        { id: '33', url: '../../../../../assets/imagenes/castillos/castillo-BALL POOL-inflable6.png', alt: 'Castillo MINI ZIGMA BALL POOL inflable Recreativo', idComponente: 0 },
      ],
      estado: 'Activo',
      descripcion: '2 X 2 METROS (COLORES E IMPRESIÓN FRONTAL PERSONALIZABLE) + PISCINA DE PELOTAS',
      comision: 0,
      fechaCreacion: '',
      fechaActualizacion: '',
      idDatosUsuario: '550e8400-e29b-41d4-a716-446655440000'
    },
    {
      id: 'MCAS25-010',
      name: 'MINI PATROL',
      precios: [
        { codigo_iso: 'COP', nombreMoneda: 'Peso colombiano', precio: 3400000 }
    ],
      descuento: 0,
      cantidad: 0,
      idBusiness: 1,
      idCategoria: 'MCAS',
      nombreCategoria: '',
      imagen: [
        { id: '34', url: '../../../../../assets/imagenes/castillos/castillo-miniPatrol-inflable1.png', alt: 'Castillo MINI PATROL inflable Recreativo', idComponente: 0 },
        { id: '35', url: '../../../../../assets/imagenes/castillos/castillo-miniPatrol-inflable3.png', alt: 'Castillo MINI PATROL inflable Recreativo', idComponente: 0 },
        { id: '36', url: '../../../../../assets/imagenes/castillos/castillo-miniPatrol-inflable5.png', alt: 'Castillo MINI PATROL inflable Recreativo', idComponente: 0 },
        { id: '37', url: '../../../../../assets/imagenes/castillos/castillo-miniPatrol-inflable2.png', alt: 'Castillo MINI PATROL inflable Recreativo', idComponente: 0 },
        { id: '38', url: '../../../../../assets/imagenes/castillos/castillo-miniPatrol-inflable4.png', alt: 'Castillo MINI PATROL inflable Recreativo', idComponente: 0 },
      ],
      estado: 'Activo',
      descripcion: 'MINI CASTILLO 2.50 ALTO X 3 DE ANCHO X 3 DE FONDO IMPRESIÓN DE LA TOTALIDAD DEL FRENTE',
      comision: 0,
      fechaCreacion: '',
      fechaActualizacion: '',
      idDatosUsuario: '550e8400-e29b-41d4-a716-446655440000'
    },
    {
  id: 'CAS25-001',
  name: 'Castillo Tobogan Patrol',
  precios: [{ codigo_iso: 'COP', nombreMoneda: 'Peso colombiano', precio: 4899000 }],
  descuento: 0,
  cantidad: 10,
  idBusiness: 1,
  idCategoria: 'CAS',
  nombreCategoria: '',
  imagen: [
       { id: '39', url: '../../../../../assets/imagenes/castillos/castillo-ToboganPatrol-inflable1.png', alt: 'Castillo Tobogan Patrol inflable Recreativo', idComponente: 0 },
       { id: '40', url: '../../../../../assets/imagenes/castillos/castillo-ToboganPatrol-inflable2.png', alt: 'Castillo Tobogan Patrol inflable Recreativo', idComponente: 0 },
       { id: '41', url: '../../../../../assets/imagenes/castillos/castillo-ToboganPatrol-inflable3.png', alt: 'Castillo Tobogan Patrol inflable Recreativo', idComponente: 0 },
       { id: '42', url: '../../../../../assets/imagenes/castillos/castillo-ToboganPatrol-inflable4.png', alt: 'Castillo Tobogan Patrol inflable Recreativo', idComponente: 0 },
  ],
  estado: 'Activo',
  descripcion: 'CASTILLO 2.50 ALTO X 4 DE ANCHO X 4 DE FONDO IMPRESION FRONTAL PERSONALIZABLE',
  comision: 0,
  fechaCreacion: '',
  fechaActualizacion: '',
  idDatosUsuario: '550e8400-e29b-41d4-a716-446655440000'
},
{
  id: 'CAS25-002',
  name: 'CASTILLO ALADINO 4X4',
  precios: [{ codigo_iso: 'COP', nombreMoneda: 'Peso colombiano', precio: 4799000 }],
  descuento: 0,
  cantidad: 10,
  idBusiness: 1,
  idCategoria: 'CAS',
  nombreCategoria: '',
  imagen: [ 
       { id: '43', url: '../../../../../assets/imagenes/castillos/castillo-aladino-inflable1.png', alt: 'Castillo Aladino inflable Recreativo', idComponente: 0 },
       { id: '44', url: '../../../../../assets/imagenes/castillos/castillo-aladino-inflable2.png', alt: 'Castillo Aladino inflable Recreativo', idComponente: 0 },
       { id: '45', url: '../../../../../assets/imagenes/castillos/castillo-aladino-inflable3.png', alt: 'Castillo Aladino inflable Recreativo', idComponente: 0 },
       { id: '46', url: '../../../../../assets/imagenes/castillos/castillo-aladino-inflable4.png', alt: 'Castillo Aladino inflable Recreativo', idComponente: 0 },
       { id: '47', url: '../../../../../assets/imagenes/castillos/castillo-aladino-inflable5.png', alt: 'Castillo Aladino inflable Recreativo', idComponente: 0 },
       { id: '48', url: '../../../../../assets/imagenes/castillos/castillo-aladino-inflable6.png', alt: 'Castillo Aladino inflable Recreativo', idComponente: 0 },
    ],
  estado: 'Activo',
  descripcion: 'CASTILLO 2.50 ALTO X 4 DE ANCHO X 4 DE FONDO SIN IMPRESIONES',
  comision: 0,
  fechaCreacion: '',
  fechaActualizacion: '',
  idDatosUsuario: '550e8400-e29b-41d4-a716-446655440000'
},
{
  id: 'CAS25-003',
  name: 'CASTILLO MINIPARQUE',
  precios: [{ codigo_iso: 'COP', nombreMoneda: 'Peso colombiano', precio: 5300000 }],
  descuento: 0,
  cantidad: 1,
  idBusiness: 1,
  idCategoria: 'CAS',
  nombreCategoria: '',
  imagen: [
    { id: '49', url: '../../../../../assets/imagenes/castillos/castillo-miniparque-inflable1.png', alt: 'Castillo Miniparque inflable Recreativo', idComponente: 0 },
    { id: '50', url: '../../../../../assets/imagenes/castillos/castillo-miniparque-inflable2.png', alt: 'Castillo Miniparque inflable Recreativo', idComponente: 0 },
    { id: '51', url: '../../../../../assets/imagenes/castillos/castillo-miniparque-inflable3.png', alt: 'Castillo Miniparque inflable Recreativo', idComponente: 0 },
  ],
  estado: 'Activo',
  descripcion: 'CASTILLO 2.60 ALTO X 4.50 DE ANCHO X 4.50 DE FONDO SIN IMPRESIONES',
  comision: 0,
  fechaCreacion: '',
  fechaActualizacion: '',
  idDatosUsuario: '550e8400-e29b-41d4-a716-446655440000'
},
{
  id: 'CAS25-004',
  name: 'CASTILLO LEGO',
  precios: [{ codigo_iso: 'COP', nombreMoneda: 'Peso colombiano', precio: 5100000 }],
  descuento: 0,
  cantidad: 8,
  idBusiness: 1,
  idCategoria: 'CAS',
  nombreCategoria: '',
  imagen: [
    { id: '52', url: '../../../../../assets/imagenes/castillos/castillo-lego-inflable1.png', alt: 'Castillo Lego inflable Recreativo', idComponente: 0 },
    { id: '53', url: '../../../../../assets/imagenes/castillos/castillo-lego-inflable2.png', alt: 'Castillo Lego inflable Recreativo', idComponente: 0 },
    { id: '54', url: '../../../../../assets/imagenes/castillos/castillo-lego-inflable3.png', alt: 'Castillo Lego inflable Recreativo', idComponente: 0 },
  ],
  estado: 'Activo',
  descripcion: 'CASTILLO 2.50 ALTO X 3 DE ANCHO X 3 DE FONDO SIN IMPRESIONES',
  comision: 0,
  fechaCreacion: '',
  fechaActualizacion: '',
  idDatosUsuario: '550e8400-e29b-41d4-a716-446655440000'
},
{
  id: 'CAS25-005',
  name: 'CASTILLO PALMERAS',
  precios: [{ codigo_iso: 'COP', nombreMoneda: 'Peso colombiano', precio: 5300000 }],
  descuento: 0,
  cantidad: 0,
  idBusiness: 1,
  idCategoria: 'CAS',
  nombreCategoria: '',
  imagen: [
    { id: '55', url: '../../../../../assets/imagenes/castillos/castillo-palmeras-inflable1.png', alt: 'Castillo Palmeras inflable Recreativo', idComponente: 0 },
    { id: '56', url: '../../../../../assets/imagenes/castillos/castillo-palmeras-inflable2.png', alt: 'Castillo Palmeras inflable Recreativo', idComponente: 0 },
    { id: '57', url: '../../../../../assets/imagenes/castillos/castillo-palmeras-inflable3.png', alt: 'Castillo Palmeras inflable Recreativo', idComponente: 0 },
  ],
  estado: 'Activo',
  descripcion: 'CASTILLO 2.70 ALTO X 5 DE ANCHO X 5 DE FONDO SIN IMPRESIONES TORRES EN FORMA DE PALMERAS',
  comision: 0,
  fechaCreacion: '',
  fechaActualizacion: '',
  idDatosUsuario: '550e8400-e29b-41d4-a716-446655440000'
},{
  id: 'MTOB25-001',
  name: 'MINI TOBOGAN COCODRILO Y PALMERAS',
  precios: [{ codigo_iso: 'COP', nombreMoneda: 'Peso colombiano', precio: 6800000 }],
  descuento: 0,
  cantidad: 8,
  idBusiness: 1,
  idCategoria: 'MTOB',
  nombreCategoria: '',
  imagen: [
 { id: '57', url: '../../../../../assets/imagenes/miniToboganes/MiniTobogan-inflable-reino-champiñon1.png', alt: 'Mini Tobogan Cocodrilo y Palmeras inflable Recreativo', idComponente: 0 },
 
  ],
  estado: 'Activo',
  descripcion: 'MINI TOBOGAN 4.50 ALTO X 4 DE ANCHO X 5 DE FONDO SIN IMPRESIONES ENTRADA CABEZA FORMA DE COCODRILO',
  comision: 0,
  fechaCreacion: '',
  fechaActualizacion: '',
  idDatosUsuario: '550e8400-e29b-41d4-a716-446655440000'
},
{
  id: 'MTOB25-002',
  name: 'MINI TOBOGAN DISNEY',
  precios: [{ codigo_iso: 'COP', nombreMoneda: 'Peso colombiano', precio: 5999000 }],
  descuento: 0,
  cantidad: 8,
  idBusiness: 1,
  idCategoria: 'MTOB',
  nombreCategoria: '',
  imagen: [{
    id: '2',
    url: 'https://drive.google.com/file/d/1C_6RPI3Z4-qIeN5bLL6MkR4ZneVO_jY1/view?usp=drive_link',
    alt: 'inflables recreativos',
    idComponente: 0
  }],
  estado: 'Activo',
  descripcion: 'MINI TOBOGAN 4.50 ALTO X 4 DE ANCHO X 5 DE FONDO 2 IMPRESIONES FRONTALES, IMPRESIONES TROQUELADAS EN TORRES, PEDESTAL Y ARCOS',
  comision: 0,
  fechaCreacion: '',
  fechaActualizacion: '',
  idDatosUsuario: '550e8400-e29b-41d4-a716-446655440000'
},
{
  id: 'MTOB25-003',
  name: 'MINI TOBOGAN MARVEL',
  precios: [{ codigo_iso: 'COP', nombreMoneda: 'Peso colombiano', precio: 5999000 }],
  descuento: 0,
  cantidad: 8,
  idBusiness: 1,
  idCategoria: 'MTOB',
  nombreCategoria: '',
  imagen: [{
    id: '3',
    url: 'https://drive.google.com/file/d/1LPDwvgFZq5azSCYMBB_zZkX_Y3U5-Qut/view?usp=drive_link',
    alt: 'inflables recreativos',
    idComponente: 0
  }],
  estado: 'Activo',
  descripcion: 'MINI TOBOGAN 4.50 ALTO X 4 DE ANCHO X 5 DE FONDO 3 IMPRESIONES FRONTALES, COLCHONES IMPRESOS EN TORRES Y PEDESTAL, ARCOS IMPRESOS',
  comision: 0,
  fechaCreacion: '',
  fechaActualizacion: '',
  idDatosUsuario: '550e8400-e29b-41d4-a716-446655440000'
},
{
  id: 'MTOB25-004',
  name: 'MINI TOBOGAN MARVEL 2',
  precios: [{ codigo_iso: 'COP', nombreMoneda: 'Peso colombiano', precio: 6500000 }],
  descuento: 0,
  cantidad: 6,
  idBusiness: 1,
  idCategoria: 'MTOB',
  nombreCategoria: '',
  imagen: [{
    id: '4',
    url: 'https://drive.google.com/file/d/1q5EalGuF9Nu70XbmlaGliGJ3hf4rZjX5/view?usp=drive_link',
    alt: 'inflables recreativos',
    idComponente: 0
  }],
  estado: 'Activo',
  descripcion: '3.50 ALTO X 4 DE ANCHO X 6 DE FONDO IMPRESIONES FRONTALES Y EN ARCOS Y PEDESTAL',
  comision: 0,
  fechaCreacion: '',
  fechaActualizacion: '',
  idDatosUsuario: '550e8400-e29b-41d4-a716-446655440000'
},
{
  id: 'MTOB25-005',
  name: 'MINI TOBOGAN SUPER MARIO',
  precios: [{ codigo_iso: 'COP', nombreMoneda: 'Peso colombiano', precio: 5999000 }],
  descuento: 0,
  cantidad: 6,
  idBusiness: 1,
  idCategoria: 'MTOB',
  nombreCategoria: '',
  imagen: [{
    id: '5',
    url: 'https://drive.google.com/file/d/1P36rzlCNbcoS90Rp6aMEcte0BIcg24uh/view?usp=drive_link',
    alt: 'inflables recreativos',
    idComponente: 0
  }],
  estado: 'Activo',
  descripcion: 'MINI TOBOGAN 4.50 ALTO X 4 DE ANCHO X 5 DE FONDO 3 IMPRESIONES FRONTALES, COLCHON IMPRESO EN PEDESTAL',
  comision: 0,
  fechaCreacion: '',
  fechaActualizacion: '',
  idDatosUsuario: '550e8400-e29b-41d4-a716-446655440000'
},
{
  id: 'MTOB25-006',
  name: 'MINI TOBOGAN TORRE ALTA',
  precios: [{ codigo_iso: 'COP', nombreMoneda: 'Peso colombiano', precio: 6500000 }],
  descuento: 0,
  cantidad: 6,
  idBusiness: 1,
  idCategoria: 'MTOB',
  nombreCategoria: '',
  imagen: [{
    id: '6',
    url: 'https://drive.google.com/file/d/1tDpZ6d54qCGmzqKYxQ0AQmPOeWYRPtP7/view?usp=drive_link',
    alt: 'inflables recreativos',
    idComponente: 0
  }],
  estado: 'Activo',
  descripcion: 'MINI TOBOGAN 4.50 ALTO X 4 DE ANCHO X 5 DE FONDO SIN IMPRESIONES, MALLAS A LOS LADOS DE LA ENTRADA',
  comision: 0,
  fechaCreacion: '',
  fechaActualizacion: '',
  idDatosUsuario: '550e8400-e29b-41d4-a716-446655440000'
},
{
  id: 'MTOB25-007',
  name: 'MINI TOBOGAN JUMBO',
  precios: [{ codigo_iso: 'COP', nombreMoneda: 'Peso colombiano', precio: 6500000 }],
  descuento: 0,
  cantidad: 6,
  idBusiness: 1,
  idCategoria: 'MTOB',
  nombreCategoria: '',
  imagen: [{
    id: '7',
    url: 'https://drive.google.com/file/d/1oiWtIBvD-oQZ8tVVPxPxYpJT6hQLm42_/view?usp=drive_link',
    alt: 'inflables recreativos',
    idComponente: 0
  }],
  estado: 'Activo',
  descripcion: '4 ALTO X 5.30 DE ANCHO X 4.50 DE FONDO 3 IMPRESIONES FRONTALES Y 1 EN TOBOGAN',
  comision: 0,
  fechaCreacion: '',
  fechaActualizacion: '',
  idDatosUsuario: '550e8400-e29b-41d4-a716-446655440000'
},
{
  id: 'MTOB25-008',
  name: 'MINI TOBOGAN JUMBO 2',
  precios: [{ codigo_iso: 'COP', nombreMoneda: 'Peso colombiano', precio: 6900000 }],
  descuento: 0,
  cantidad: 0,
  idBusiness: 1,
  idCategoria: 'MTOB',
  nombreCategoria: '',
  imagen: [{
    id: '8',
    url: 'https://drive.google.com/file/d/1nYIoUKm-mYFy1O0gcDS1f3uleSIMJUOb/view?usp=drive_link',
    alt: 'inflables recreativos',
    idComponente: 0
  }],
  estado: 'Activo',
  descripcion: '4.50 ALTO X 5.30 DE ANCHO X 4.50 DE FONDO 2 MUÑECOS 3D EN CADA ESQUINA 3 IMPRESIONES FRONTALES 1 EN TOBOGAN Y 1 EN ENTRADA',
  comision: 0,
  fechaCreacion: '',
  fechaActualizacion: '',
  idDatosUsuario: '550e8400-e29b-41d4-a716-446655440000'
},
{
  id: 'MTOB25-009',
  name: 'MINI TOBOGAN MICKEY',
  precios: [{ codigo_iso: 'COP', nombreMoneda: 'Peso colombiano', precio: 6500000 }],
  descuento: 0,
  cantidad: 0,
  idBusiness: 1,
  idCategoria: 'MTOB',
  nombreCategoria: '',
  imagen: [{
    id: '9',
    url: 'https://drive.google.com/file/d/1nzBYU-wXSk3fIISoPrPCHokpgPxqOXSH/view?usp=drivesdk',
    alt: 'inflables recreativos',
    idComponente: 0
  }],
  estado: 'Activo',
  descripcion: 'MINI TOBOGAN 4.50 ALTO X 4 DE ANCHO X 5 LARGO, 1 SUBIDA, DOS DESLIZADEROS, ZONA DE BRINCO, 1 MUÑECO 3D E IMPRESIONES FRONTALES A GUSTO',
  comision: 0,
  fechaCreacion: '',
  fechaActualizacion: '',
  idDatosUsuario: '550e8400-e29b-41d4-a716-446655440000'
},
{
  id: 'MTOB25-010',
  name: 'MINI TOBOGAN COLORES',
  precios: [{ codigo_iso: 'COP', nombreMoneda: 'Peso colombiano', precio: 5700000 }],
  descuento: 0,
  cantidad: 5,
  idBusiness: 1,
  idCategoria: 'MTOB',
  nombreCategoria: '',
  imagen: [{
    id: '10',
    url: '',
    alt: 'inflables recreativos',
    idComponente: 0
  }],
  estado: 'Activo',
  descripcion: '',
  comision: 0,
  fechaCreacion: '',
  fechaActualizacion: '',
  idDatosUsuario: '550e8400-e29b-41d4-a716-446655440000'
}


  ];
}

    getProductsData() {
        return [
            {
                id: '1000',
                code: 'f230fh0g3',
                name: 'Bamboo Watch',
                description: 'Product Description',
                image: 'bamboo-watch.jpg',
                price: 65,
                category: 'Accessories',
                quantity: 24,
                inventoryStatus: 'INSTOCK',
                rating: 5
            },
            {
                id: '1001',
                code: 'nvklal433',
                name: 'Black Watch',
                description: 'Product Description',
                image: 'black-watch.jpg',
                price: 72,
                category: 'Accessories',
                quantity: 61,
                inventoryStatus: 'INSTOCK',
                rating: 4
            },
            {
                id: '1002',
                code: 'zz21cz3c1',
                name: 'Blue Band',
                description: 'Product Description',
                image: 'blue-band.jpg',
                price: 79,
                category: 'Fitness',
                quantity: 2,
                inventoryStatus: 'LOWSTOCK',
                rating: 3
            },
            {
                id: '1003',
                code: '244wgerg2',
                name: 'Blue T-Shirt',
                description: 'Product Description',
                image: 'blue-t-shirt.jpg',
                price: 29,
                category: 'Clothing',
                quantity: 25,
                inventoryStatus: 'INSTOCK',
                rating: 5
            },
            {
                id: '1004',
                code: 'h456wer53',
                name: 'Bracelet',
                description: 'Product Description',
                image: 'bracelet.jpg',
                price: 15,
                category: 'Accessories',
                quantity: 73,
                inventoryStatus: 'INSTOCK',
                rating: 4
            },
            {
                id: '1005',
                code: 'av2231fwg',
                name: 'Brown Purse',
                description: 'Product Description',
                image: 'brown-purse.jpg',
                price: 120,
                category: 'Accessories',
                quantity: 0,
                inventoryStatus: 'OUTOFSTOCK',
                rating: 4
            },
            {
                id: '1006',
                code: 'bib36pfvm',
                name: 'Chakra Bracelet',
                description: 'Product Description',
                image: 'chakra-bracelet.jpg',
                price: 32,
                category: 'Accessories',
                quantity: 5,
                inventoryStatus: 'LOWSTOCK',
                rating: 3
            },
            {
                id: '1007',
                code: 'mbvjkgip5',
                name: 'Galaxy Earrings',
                description: 'Product Description',
                image: 'galaxy-earrings.jpg',
                price: 34,
                category: 'Accessories',
                quantity: 23,
                inventoryStatus: 'INSTOCK',
                rating: 5
            },
            {
                id: '1008',
                code: 'vbb124btr',
                name: 'Game Controller',
                description: 'Product Description',
                image: 'game-controller.jpg',
                price: 99,
                category: 'Electronics',
                quantity: 2,
                inventoryStatus: 'LOWSTOCK',
                rating: 4
            },
            {
                id: '1009',
                code: 'cm230f032',
                name: 'Gaming Set',
                description: 'Product Description',
                image: 'gaming-set.jpg',
                price: 299,
                category: 'Electronics',
                quantity: 63,
                inventoryStatus: 'INSTOCK',
                rating: 3
            },
            {
                id: '1010',
                code: 'plb34234v',
                name: 'Gold Phone Case',
                description: 'Product Description',
                image: 'gold-phone-case.jpg',
                price: 24,
                category: 'Accessories',
                quantity: 0,
                inventoryStatus: 'OUTOFSTOCK',
                rating: 4
            },
            {
                id: '1011',
                code: '4920nnc2d',
                name: 'Green Earbuds',
                description: 'Product Description',
                image: 'green-earbuds.jpg',
                price: 89,
                category: 'Electronics',
                quantity: 23,
                inventoryStatus: 'INSTOCK',
                rating: 4
            },
            {
                id: '1012',
                code: '250vm23cc',
                name: 'Green T-Shirt',
                description: 'Product Description',
                image: 'green-t-shirt.jpg',
                price: 49,
                category: 'Clothing',
                quantity: 74,
                inventoryStatus: 'INSTOCK',
                rating: 5
            },
            {
                id: '1013',
                code: 'fldsmn31b',
                name: 'Grey T-Shirt',
                description: 'Product Description',
                image: 'grey-t-shirt.jpg',
                price: 48,
                category: 'Clothing',
                quantity: 0,
                inventoryStatus: 'OUTOFSTOCK',
                rating: 3
            },
            {
                id: '1014',
                code: 'waas1x2as',
                name: 'Headphones',
                description: 'Product Description',
                image: 'headphones.jpg',
                price: 175,
                category: 'Electronics',
                quantity: 8,
                inventoryStatus: 'LOWSTOCK',
                rating: 5
            },
            {
                id: '1015',
                code: 'vb34btbg5',
                name: 'Light Green T-Shirt',
                description: 'Product Description',
                image: 'light-green-t-shirt.jpg',
                price: 49,
                category: 'Clothing',
                quantity: 34,
                inventoryStatus: 'INSTOCK',
                rating: 4
            },
            {
                id: '1016',
                code: 'k8l6j58jl',
                name: 'Lime Band',
                description: 'Product Description',
                image: 'lime-band.jpg',
                price: 79,
                category: 'Fitness',
                quantity: 12,
                inventoryStatus: 'INSTOCK',
                rating: 3
            },
            {
                id: '1017',
                code: 'v435nn85n',
                name: 'Mini Speakers',
                description: 'Product Description',
                image: 'mini-speakers.jpg',
                price: 85,
                category: 'Clothing',
                quantity: 42,
                inventoryStatus: 'INSTOCK',
                rating: 4
            },
            {
                id: '1018',
                code: '09zx9c0zc',
                name: 'Painted Phone Case',
                description: 'Product Description',
                image: 'painted-phone-case.jpg',
                price: 56,
                category: 'Accessories',
                quantity: 41,
                inventoryStatus: 'INSTOCK',
                rating: 5
            },
            {
                id: '1019',
                code: 'mnb5mb2m5',
                name: 'Pink Band',
                description: 'Product Description',
                image: 'pink-band.jpg',
                price: 79,
                category: 'Fitness',
                quantity: 63,
                inventoryStatus: 'INSTOCK',
                rating: 4
            },
            {
                id: '1020',
                code: 'r23fwf2w3',
                name: 'Pink Purse',
                description: 'Product Description',
                image: 'pink-purse.jpg',
                price: 110,
                category: 'Accessories',
                quantity: 0,
                inventoryStatus: 'OUTOFSTOCK',
                rating: 4
            },
            {
                id: '1021',
                code: 'pxpzczo23',
                name: 'Purple Band',
                description: 'Product Description',
                image: 'purple-band.jpg',
                price: 79,
                category: 'Fitness',
                quantity: 6,
                inventoryStatus: 'LOWSTOCK',
                rating: 3
            },
            {
                id: '1022',
                code: '2c42cb5cb',
                name: 'Purple Gemstone Necklace',
                description: 'Product Description',
                image: 'purple-gemstone-necklace.jpg',
                price: 45,
                category: 'Accessories',
                quantity: 62,
                inventoryStatus: 'INSTOCK',
                rating: 4
            },
            {
                id: '1023',
                code: '5k43kkk23',
                name: 'Purple T-Shirt',
                description: 'Product Description',
                image: 'purple-t-shirt.jpg',
                price: 49,
                category: 'Clothing',
                quantity: 2,
                inventoryStatus: 'LOWSTOCK',
                rating: 5
            },
            {
                id: '1024',
                code: 'lm2tny2k4',
                name: 'Shoes',
                description: 'Product Description',
                image: 'shoes.jpg',
                price: 64,
                category: 'Clothing',
                quantity: 0,
                inventoryStatus: 'INSTOCK',
                rating: 4
            },
            {
                id: '1025',
                code: 'nbm5mv45n',
                name: 'Sneakers',
                description: 'Product Description',
                image: 'sneakers.jpg',
                price: 78,
                category: 'Clothing',
                quantity: 52,
                inventoryStatus: 'INSTOCK',
                rating: 4
            },
            {
                id: '1026',
                code: 'zx23zc42c',
                name: 'Teal T-Shirt',
                description: 'Product Description',
                image: 'teal-t-shirt.jpg',
                price: 49,
                category: 'Clothing',
                quantity: 3,
                inventoryStatus: 'LOWSTOCK',
                rating: 3
            },
            {
                id: '1027',
                code: 'acvx872gc',
                name: 'Yellow Earbuds',
                description: 'Product Description',
                image: 'yellow-earbuds.jpg',
                price: 89,
                category: 'Electronics',
                quantity: 35,
                inventoryStatus: 'INSTOCK',
                rating: 3
            },
            {
                id: '1028',
                code: 'tx125ck42',
                name: 'Yoga Mat',
                description: 'Product Description',
                image: 'yoga-mat.jpg',
                price: 20,
                category: 'Fitness',
                quantity: 15,
                inventoryStatus: 'INSTOCK',
                rating: 5
            },
            {
                id: '1029',
                code: 'gwuby345v',
                name: 'Yoga Set',
                description: 'Product Description',
                image: 'yoga-set.jpg',
                price: 20,
                category: 'Fitness',
                quantity: 25,
                inventoryStatus: 'INSTOCK',
                rating: 8
            }
        ];
    }

    getProductsWithOrdersData() {
        return [
            {
                id: '1000',
                code: 'f230fh0g3',
                name: 'Bamboo Watch',
                description: 'Product Description',
                image: 'bamboo-watch.jpg',
                price: 65,
                category: 'Accessories',
                quantity: 24,
                inventoryStatus: 'INSTOCK',
                rating: 5,
                orders: [
                    {
                        id: '1000-0',
                        productCode: 'f230fh0g3',
                        date: '2020-09-13',
                        amount: 65,
                        quantity: 1,
                        customer: 'David James',
                        status: 'PENDING'
                    },
                    {
                        id: '1000-1',
                        productCode: 'f230fh0g3',
                        date: '2020-05-14',
                        amount: 130,
                        quantity: 2,
                        customer: 'Leon Rodrigues',
                        status: 'DELIVERED'
                    },
                    {
                        id: '1000-2',
                        productCode: 'f230fh0g3',
                        date: '2019-01-04',
                        amount: 65,
                        quantity: 1,
                        customer: 'Juan Alejandro',
                        status: 'RETURNED'
                    },
                    {
                        id: '1000-3',
                        productCode: 'f230fh0g3',
                        date: '2020-09-13',
                        amount: 195,
                        quantity: 3,
                        customer: 'Claire Morrow',
                        status: 'CANCELLED'
                    }
                ]
            },
            {
                id: '1001',
                code: 'nvklal433',
                name: 'Black Watch',
                description: 'Product Description',
                image: 'black-watch.jpg',
                price: 72,
                category: 'Accessories',
                quantity: 61,
                inventoryStatus: 'INSTOCK',
                rating: 4,
                orders: [
                    {
                        id: '1001-0',
                        productCode: 'nvklal433',
                        date: '2020-05-14',
                        amount: 72,
                        quantity: 1,
                        customer: 'Maisha Jefferson',
                        status: 'DELIVERED'
                    },
                    {
                        id: '1001-1',
                        productCode: 'nvklal433',
                        date: '2020-02-28',
                        amount: 144,
                        quantity: 2,
                        customer: 'Octavia Murillo',
                        status: 'PENDING'
                    }
                ]
            },
            {
                id: '1002',
                code: 'zz21cz3c1',
                name: 'Blue Band',
                description: 'Product Description',
                image: 'blue-band.jpg',
                price: 79,
                category: 'Fitness',
                quantity: 2,
                inventoryStatus: 'LOWSTOCK',
                rating: 3,
                orders: [
                    {
                        id: '1002-0',
                        productCode: 'zz21cz3c1',
                        date: '2020-07-05',
                        amount: 79,
                        quantity: 1,
                        customer: 'Stacey Leja',
                        status: 'DELIVERED'
                    },
                    {
                        id: '1002-1',
                        productCode: 'zz21cz3c1',
                        date: '2020-02-06',
                        amount: 79,
                        quantity: 1,
                        customer: 'Ashley Wickens',
                        status: 'DELIVERED'
                    }
                ]
            },
            {
                id: '1003',
                code: '244wgerg2',
                name: 'Blue T-Shirt',
                description: 'Product Description',
                image: 'blue-t-shirt.jpg',
                price: 29,
                category: 'Clothing',
                quantity: 25,
                inventoryStatus: 'INSTOCK',
                rating: 5,
                orders: []
            },
            {
                id: '1004',
                code: 'h456wer53',
                name: 'Bracelet',
                description: 'Product Description',
                image: 'bracelet.jpg',
                price: 15,
                category: 'Accessories',
                quantity: 73,
                inventoryStatus: 'INSTOCK',
                rating: 4,
                orders: [
                    {
                        id: '1004-0',
                        productCode: 'h456wer53',
                        date: '2020-09-05',
                        amount: 60,
                        quantity: 4,
                        customer: 'Mayumi Misaki',
                        status: 'PENDING'
                    },
                    {
                        id: '1004-1',
                        productCode: 'h456wer53',
                        date: '2019-04-16',
                        amount: 2,
                        quantity: 30,
                        customer: 'Francesco Salvatore',
                        status: 'DELIVERED'
                    }
                ]
            },
            {
                id: '1005',
                code: 'av2231fwg',
                name: 'Brown Purse',
                description: 'Product Description',
                image: 'brown-purse.jpg',
                price: 120,
                category: 'Accessories',
                quantity: 0,
                inventoryStatus: 'OUTOFSTOCK',
                rating: 4,
                orders: [
                    {
                        id: '1005-0',
                        productCode: 'av2231fwg',
                        date: '2020-01-25',
                        amount: 120,
                        quantity: 1,
                        customer: 'Isabel Sinclair',
                        status: 'RETURNED'
                    },
                    {
                        id: '1005-1',
                        productCode: 'av2231fwg',
                        date: '2019-03-12',
                        amount: 240,
                        quantity: 2,
                        customer: 'Lionel Clifford',
                        status: 'DELIVERED'
                    },
                    {
                        id: '1005-2',
                        productCode: 'av2231fwg',
                        date: '2019-05-05',
                        amount: 120,
                        quantity: 1,
                        customer: 'Cody Chavez',
                        status: 'DELIVERED'
                    }
                ]
            },
            {
                id: '1006',
                code: 'bib36pfvm',
                name: 'Chakra Bracelet',
                description: 'Product Description',
                image: 'chakra-bracelet.jpg',
                price: 32,
                category: 'Accessories',
                quantity: 5,
                inventoryStatus: 'LOWSTOCK',
                rating: 3,
                orders: [
                    {
                        id: '1006-0',
                        productCode: 'bib36pfvm',
                        date: '2020-02-24',
                        amount: 32,
                        quantity: 1,
                        customer: 'Arvin Darci',
                        status: 'DELIVERED'
                    },
                    {
                        id: '1006-1',
                        productCode: 'bib36pfvm',
                        date: '2020-01-14',
                        amount: 64,
                        quantity: 2,
                        customer: 'Izzy Jones',
                        status: 'PENDING'
                    }
                ]
            },
            {
                id: '1007',
                code: 'mbvjkgip5',
                name: 'Galaxy Earrings',
                description: 'Product Description',
                image: 'galaxy-earrings.jpg',
                price: 34,
                category: 'Accessories',
                quantity: 23,
                inventoryStatus: 'INSTOCK',
                rating: 5,
                orders: [
                    {
                        id: '1007-0',
                        productCode: 'mbvjkgip5',
                        date: '2020-06-19',
                        amount: 34,
                        quantity: 1,
                        customer: 'Jennifer Smith',
                        status: 'DELIVERED'
                    }
                ]
            },
            {
                id: '1008',
                code: 'vbb124btr',
                name: 'Game Controller',
                description: 'Product Description',
                image: 'game-controller.jpg',
                price: 99,
                category: 'Electronics',
                quantity: 2,
                inventoryStatus: 'LOWSTOCK',
                rating: 4,
                orders: [
                    {
                        id: '1008-0',
                        productCode: 'vbb124btr',
                        date: '2020-01-05',
                        amount: 99,
                        quantity: 1,
                        customer: 'Jeanfrancois David',
                        status: 'DELIVERED'
                    },
                    {
                        id: '1008-1',
                        productCode: 'vbb124btr',
                        date: '2020-01-19',
                        amount: 198,
                        quantity: 2,
                        customer: 'Ivar Greenwood',
                        status: 'RETURNED'
                    }
                ]
            },
            {
                id: '1009',
                code: 'cm230f032',
                name: 'Gaming Set',
                description: 'Product Description',
                image: 'gaming-set.jpg',
                price: 299,
                category: 'Electronics',
                quantity: 63,
                inventoryStatus: 'INSTOCK',
                rating: 3,
                orders: [
                    {
                        id: '1009-0',
                        productCode: 'cm230f032',
                        date: '2020-06-24',
                        amount: 299,
                        quantity: 1,
                        customer: 'Kadeem Mujtaba',
                        status: 'PENDING'
                    },
                    {
                        id: '1009-1',
                        productCode: 'cm230f032',
                        date: '2020-05-11',
                        amount: 299,
                        quantity: 1,
                        customer: 'Ashley Wickens',
                        status: 'DELIVERED'
                    },
                    {
                        id: '1009-2',
                        productCode: 'cm230f032',
                        date: '2019-02-07',
                        amount: 299,
                        quantity: 1,
                        customer: 'Julie Johnson',
                        status: 'DELIVERED'
                    },
                    {
                        id: '1009-3',
                        productCode: 'cm230f032',
                        date: '2020-04-26',
                        amount: 299,
                        quantity: 1,
                        customer: 'Tony Costa',
                        status: 'CANCELLED'
                    }
                ]
            },
            {
                id: '1010',
                code: 'plb34234v',
                name: 'Gold Phone Case',
                description: 'Product Description',
                image: 'gold-phone-case.jpg',
                price: 24,
                category: 'Accessories',
                quantity: 0,
                inventoryStatus: 'OUTOFSTOCK',
                rating: 4,
                orders: [
                    {
                        id: '1010-0',
                        productCode: 'plb34234v',
                        date: '2020-02-04',
                        amount: 24,
                        quantity: 1,
                        customer: 'James Butt',
                        status: 'DELIVERED'
                    },
                    {
                        id: '1010-1',
                        productCode: 'plb34234v',
                        date: '2020-05-05',
                        amount: 48,
                        quantity: 2,
                        customer: 'Josephine Darakjy',
                        status: 'DELIVERED'
                    }
                ]
            },
            {
                id: '1011',
                code: '4920nnc2d',
                name: 'Green Earbuds',
                description: 'Product Description',
                image: 'green-earbuds.jpg',
                price: 89,
                category: 'Electronics',
                quantity: 23,
                inventoryStatus: 'INSTOCK',
                rating: 4,
                orders: [
                    {
                        id: '1011-0',
                        productCode: '4920nnc2d',
                        date: '2020-06-01',
                        amount: 89,
                        quantity: 1,
                        customer: 'Art Venere',
                        status: 'DELIVERED'
                    }
                ]
            },
            {
                id: '1012',
                code: '250vm23cc',
                name: 'Green T-Shirt',
                description: 'Product Description',
                image: 'green-t-shirt.jpg',
                price: 49,
                category: 'Clothing',
                quantity: 74,
                inventoryStatus: 'INSTOCK',
                rating: 5,
                orders: [
                    {
                        id: '1012-0',
                        productCode: '250vm23cc',
                        date: '2020-02-05',
                        amount: 49,
                        quantity: 1,
                        customer: 'Lenna Paprocki',
                        status: 'DELIVERED'
                    },
                    {
                        id: '1012-1',
                        productCode: '250vm23cc',
                        date: '2020-02-15',
                        amount: 49,
                        quantity: 1,
                        customer: 'Donette Foller',
                        status: 'PENDING'
                    }
                ]
            },
            {
                id: '1013',
                code: 'fldsmn31b',
                name: 'Grey T-Shirt',
                description: 'Product Description',
                image: 'grey-t-shirt.jpg',
                price: 48,
                category: 'Clothing',
                quantity: 0,
                inventoryStatus: 'OUTOFSTOCK',
                rating: 3,
                orders: [
                    {
                        id: '1013-0',
                        productCode: 'fldsmn31b',
                        date: '2020-04-01',
                        amount: 48,
                        quantity: 1,
                        customer: 'Simona Morasca',
                        status: 'DELIVERED'
                    }
                ]
            },
            {
                id: '1014',
                code: 'waas1x2as',
                name: 'Headphones',
                description: 'Product Description',
                image: 'headphones.jpg',
                price: 175,
                category: 'Electronics',
                quantity: 8,
                inventoryStatus: 'LOWSTOCK',
                rating: 5,
                orders: [
                    {
                        id: '1014-0',
                        productCode: 'waas1x2as',
                        date: '2020-05-15',
                        amount: 175,
                        quantity: 1,
                        customer: 'Lenna Paprocki',
                        status: 'DELIVERED'
                    },
                    {
                        id: '1014-1',
                        productCode: 'waas1x2as',
                        date: '2020-01-02',
                        amount: 175,
                        quantity: 1,
                        customer: 'Donette Foller',
                        status: 'CANCELLED'
                    }
                ]
            },
            {
                id: '1015',
                code: 'vb34btbg5',
                name: 'Light Green T-Shirt',
                description: 'Product Description',
                image: 'light-green-t-shirt.jpg',
                price: 49,
                category: 'Clothing',
                quantity: 34,
                inventoryStatus: 'INSTOCK',
                rating: 4,
                orders: [
                    {
                        id: '1015-0',
                        productCode: 'vb34btbg5',
                        date: '2020-07-02',
                        amount: 98,
                        quantity: 2,
                        customer: 'Mitsue Tollner',
                        status: 'DELIVERED'
                    }
                ]
            },
            {
                id: '1016',
                code: 'k8l6j58jl',
                name: 'Lime Band',
                description: 'Product Description',
                image: 'lime-band.jpg',
                price: 79,
                category: 'Fitness',
                quantity: 12,
                inventoryStatus: 'INSTOCK',
                rating: 3,
                orders: []
            },
            {
                id: '1017',
                code: 'v435nn85n',
                name: 'Mini Speakers',
                description: 'Product Description',
                image: 'mini-speakers.jpg',
                price: 85,
                category: 'Clothing',
                quantity: 42,
                inventoryStatus: 'INSTOCK',
                rating: 4,
                orders: [
                    {
                        id: '1017-0',
                        productCode: 'v435nn85n',
                        date: '2020-07-12',
                        amount: 85,
                        quantity: 1,
                        customer: 'Minna Amigon',
                        status: 'DELIVERED'
                    }
                ]
            },
            {
                id: '1018',
                code: '09zx9c0zc',
                name: 'Painted Phone Case',
                description: 'Product Description',
                image: 'painted-phone-case.jpg',
                price: 56,
                category: 'Accessories',
                quantity: 41,
                inventoryStatus: 'INSTOCK',
                rating: 5,
                orders: [
                    {
                        id: '1018-0',
                        productCode: '09zx9c0zc',
                        date: '2020-07-01',
                        amount: 56,
                        quantity: 1,
                        customer: 'Abel Maclead',
                        status: 'DELIVERED'
                    },
                    {
                        id: '1018-1',
                        productCode: '09zx9c0zc',
                        date: '2020-05-02',
                        amount: 56,
                        quantity: 1,
                        customer: 'Minna Amigon',
                        status: 'RETURNED'
                    }
                ]
            },
            {
                id: '1019',
                code: 'mnb5mb2m5',
                name: 'Pink Band',
                description: 'Product Description',
                image: 'pink-band.jpg',
                price: 79,
                category: 'Fitness',
                quantity: 63,
                inventoryStatus: 'INSTOCK',
                rating: 4,
                orders: []
            },
            {
                id: '1020',
                code: 'r23fwf2w3',
                name: 'Pink Purse',
                description: 'Product Description',
                image: 'pink-purse.jpg',
                price: 110,
                category: 'Accessories',
                quantity: 0,
                inventoryStatus: 'OUTOFSTOCK',
                rating: 4,
                orders: [
                    {
                        id: '1020-0',
                        productCode: 'r23fwf2w3',
                        date: '2020-05-29',
                        amount: 110,
                        quantity: 1,
                        customer: 'Kiley Caldarera',
                        status: 'DELIVERED'
                    },
                    {
                        id: '1020-1',
                        productCode: 'r23fwf2w3',
                        date: '2020-02-11',
                        amount: 220,
                        quantity: 2,
                        customer: 'Graciela Ruta',
                        status: 'DELIVERED'
                    }
                ]
            },
            {
                id: '1021',
                code: 'pxpzczo23',
                name: 'Purple Band',
                description: 'Product Description',
                image: 'purple-band.jpg',
                price: 79,
                category: 'Fitness',
                quantity: 6,
                inventoryStatus: 'LOWSTOCK',
                rating: 3,
                orders: [
                    {
                        id: '1021-0',
                        productCode: 'pxpzczo23',
                        date: '2020-02-02',
                        amount: 79,
                        quantity: 1,
                        customer: 'Cammy Albares',
                        status: 'DELIVERED'
                    }
                ]
            },
            {
                id: '1022',
                code: '2c42cb5cb',
                name: 'Purple Gemstone Necklace',
                description: 'Product Description',
                image: 'purple-gemstone-necklace.jpg',
                price: 45,
                category: 'Accessories',
                quantity: 62,
                inventoryStatus: 'INSTOCK',
                rating: 4,
                orders: [
                    {
                        id: '1022-0',
                        productCode: '2c42cb5cb',
                        date: '2020-06-29',
                        amount: 45,
                        quantity: 1,
                        customer: 'Mattie Poquette',
                        status: 'DELIVERED'
                    },
                    {
                        id: '1022-1',
                        productCode: '2c42cb5cb',
                        date: '2020-02-11',
                        amount: 135,
                        quantity: 3,
                        customer: 'Meaghan Garufi',
                        status: 'DELIVERED'
                    }
                ]
            },
            {
                id: '1023',
                code: '5k43kkk23',
                name: 'Purple T-Shirt',
                description: 'Product Description',
                image: 'purple-t-shirt.jpg',
                price: 49,
                category: 'Clothing',
                quantity: 2,
                inventoryStatus: 'LOWSTOCK',
                rating: 5,
                orders: [
                    {
                        id: '1023-0',
                        productCode: '5k43kkk23',
                        date: '2020-04-15',
                        amount: 49,
                        quantity: 1,
                        customer: 'Gladys Rim',
                        status: 'RETURNED'
                    }
                ]
            },
            {
                id: '1024',
                code: 'lm2tny2k4',
                name: 'Shoes',
                description: 'Product Description',
                image: 'shoes.jpg',
                price: 64,
                category: 'Clothing',
                quantity: 0,
                inventoryStatus: 'INSTOCK',
                rating: 4,
                orders: []
            },
            {
                id: '1025',
                code: 'nbm5mv45n',
                name: 'Sneakers',
                description: 'Product Description',
                image: 'sneakers.jpg',
                price: 78,
                category: 'Clothing',
                quantity: 52,
                inventoryStatus: 'INSTOCK',
                rating: 4,
                orders: [
                    {
                        id: '1025-0',
                        productCode: 'nbm5mv45n',
                        date: '2020-02-19',
                        amount: 78,
                        quantity: 1,
                        customer: 'Yuki Whobrey',
                        status: 'DELIVERED'
                    },
                    {
                        id: '1025-1',
                        productCode: 'nbm5mv45n',
                        date: '2020-05-21',
                        amount: 78,
                        quantity: 1,
                        customer: 'Fletcher Flosi',
                        status: 'PENDING'
                    }
                ]
            },
            {
                id: '1026',
                code: 'zx23zc42c',
                name: 'Teal T-Shirt',
                description: 'Product Description',
                image: 'teal-t-shirt.jpg',
                price: 49,
                category: 'Clothing',
                quantity: 3,
                inventoryStatus: 'LOWSTOCK',
                rating: 3,
                orders: [
                    {
                        id: '1026-0',
                        productCode: 'zx23zc42c',
                        date: '2020-04-24',
                        amount: 98,
                        quantity: 2,
                        customer: 'Bette Nicka',
                        status: 'DELIVERED'
                    }
                ]
            },
            {
                id: '1027',
                code: 'acvx872gc',
                name: 'Yellow Earbuds',
                description: 'Product Description',
                image: 'yellow-earbuds.jpg',
                price: 89,
                category: 'Electronics',
                quantity: 35,
                inventoryStatus: 'INSTOCK',
                rating: 3,
                orders: [
                    {
                        id: '1027-0',
                        productCode: 'acvx872gc',
                        date: '2020-01-29',
                        amount: 89,
                        quantity: 1,
                        customer: 'Veronika Inouye',
                        status: 'DELIVERED'
                    },
                    {
                        id: '1027-1',
                        productCode: 'acvx872gc',
                        date: '2020-06-11',
                        amount: 89,
                        quantity: 1,
                        customer: 'Willard Kolmetz',
                        status: 'DELIVERED'
                    }
                ]
            },
            {
                id: '1028',
                code: 'tx125ck42',
                name: 'Yoga Mat',
                description: 'Product Description',
                image: 'yoga-mat.jpg',
                price: 20,
                category: 'Fitness',
                quantity: 15,
                inventoryStatus: 'INSTOCK',
                rating: 5,
                orders: []
            },
            {
                id: '1029',
                code: 'gwuby345v',
                name: 'Yoga Set',
                description: 'Product Description',
                image: 'yoga-set.jpg',
                price: 20,
                category: 'Fitness',
                quantity: 25,
                inventoryStatus: 'INSTOCK',
                rating: 8,
                orders: [
                    {
                        id: '1029-0',
                        productCode: 'gwuby345v',
                        date: '2020-02-14',
                        amount: 4,
                        quantity: 80,
                        customer: 'Maryann Royster',
                        status: 'DELIVERED'
                    }
                ]
            }
        ];
    }

    status: string[] = ['OUTOFSTOCK', 'INSTOCK', 'LOWSTOCK'];

    productNames: string[] = [
        'Bamboo Watch',
        'Black Watch',
        'Blue Band',
        'Blue T-Shirt',
        'Bracelet',
        'Brown Purse',
        'Chakra Bracelet',
        'Galaxy Earrings',
        'Game Controller',
        'Gaming Set',
        'Gold Phone Case',
        'Green Earbuds',
        'Green T-Shirt',
        'Grey T-Shirt',
        'Headphones',
        'Light Green T-Shirt',
        'Lime Band',
        'Mini Speakers',
        'Painted Phone Case',
        'Pink Band',
        'Pink Purse',
        'Purple Band',
        'Purple Gemstone Necklace',
        'Purple T-Shirt',
        'Shoes',
        'Sneakers',
        'Teal T-Shirt',
        'Yellow Earbuds',
        'Yoga Mat',
        'Yoga Set'
    ];

 

    getProductsMini() {
        return Promise.resolve(this.getProductsData().slice(0, 5));
    }

    getProductsSmall() {
        return Promise.resolve(this.getProductsData().slice(0, 10));
    }

    getProducts() {
        return this.getProductsData();
    }

    getProductsWithOrdersSmall() { 
        return Promise.resolve(this.getProductsWithOrdersData().slice(0, 10));
    }

    calculateDiscount(product: ProductoDTO): number {
        if(product){
            if (product.descuento && product.descuento > 0)
                return product.precios[0].precio - (product.precios[0].precio * product.descuento / 100);
            else
                return product.precios[0].precio;
        }else{
            return 0;
        }
    }

    generatePrduct(): Product {
        const product: Product = {
            id: this.generateId(),
            name: this.generateName(),
            description: 'Product Description',
            price: this.generatePrice(),
            quantity: this.generateQuantity(),
            category: 'Product Category',
            inventoryStatus: this.generateStatus(),
            rating: this.generateRating()
        };

        product.image = product.name?.toLocaleLowerCase().split(/[ ,]+/).join('-') + '.jpg';
        return product;
    }

    generateId() {
        let text = '';
        const POSSIBLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i++) {
            text += POSSIBLE.charAt(Math.floor(Math.random() * POSSIBLE.length));
        }

        return text;
    }

    generateName() {
        return this.productNames[Math.floor(Math.random() * Math.floor(30))];
    }

    generatePrice() {
        return Math.floor(Math.random() * Math.floor(299) + 1);
    }

    generateQuantity() {
        return Math.floor(Math.random() * Math.floor(75) + 1);
    }

    generateStatus() {
        return this.status[Math.floor(Math.random() * Math.floor(3))];
    }

    generateRating() {
        return Math.floor(Math.random() * Math.floor(5) + 1);
    }

    /**
     * Devuelve true si el producto no es nulo ni undefined
     * @param product 
     * @returns  boolean
     */
    checkIsProductIsnotEmptyOrNull(product: ProductoDTO): boolean {
        return product != null && product != undefined;
    }
}
