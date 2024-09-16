import { ImagenDTO } from "./ImagenDTO";

export interface ProductoDTO {
        idProduct: string | undefined;
        idBussines: number | undefined;
        idCategorie?: string;
        name: string;
        price_cop?: number;
        price_usd?: number;
        price_eur?:number; 
        amount?: number;
        description: string;
        ulrProduct?: string;
        state?: number | undefined;
        country?: number | undefined;
        creator?: string | undefined;
        icono?:string
        imagen: ImagenDTO;
      
}