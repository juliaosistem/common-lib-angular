import { ColoresDTO } from "./ColoresDTO";

export interface BussinesDTO{
    idBussines: number ;
    nombreNegocio: string;
    numeroIdentificacionNegocio: number;
    telofono : string;
    codigoPais: number;
    colores : ColoresDTO;
    logo: string
    keyWords?: string[]
    descripcion?: string[]
    urlWhatssapp :string
}