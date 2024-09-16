import { MenuActive } from './MenuDTO';
import { ColoresDTO } from "./ColoresDTO";
import { ModuloDTO } from "./ModuloDTO";
import { ProductoDTO } from './ProductoDTO';

export interface BussinesDTO{

    idBussines: number;
    nombreNegocio: string;
    numeroIdentificacionNegocio: number;
    telofono : string;
    codigoPais: number;
    colores?: ColoresDTO;
    logo: string
    keyWords?: string[]
    descripcion?: string[]
    urlWhatssapp :string
    email? :string 
    direccion? :string
    lenguaje?:string;
    modulos:ModuloDTO[];
    menu?:MenuActive[];
    productos?:ProductoDTO[];
}