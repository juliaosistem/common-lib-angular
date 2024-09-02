import { ComponentesDTO } from "./componentesDTO"

export interface ModuloDTO{
    id:string
    nombreModulo:string,
    rolPermiso:string,
    componentes:ComponentesDTO[]
}