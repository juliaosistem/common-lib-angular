import { ColoresDTO } from "./ColoresDTO";
import { ModuloDTO } from "./ModuloDTO";

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

}