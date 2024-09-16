import { SliderDTO } from './SliderDTO';
import { ImagenDTO } from "./ImagenDTO"

export interface ComponentesDTO{
    id:string
    nombreComponente:string
    descripcion?:string
    ruta?:string
    parenId?:string
    rolesConPermiso?:String[]
    imagenes?:ImagenDTO[]
    sliderDTO?:SliderDTO[]
    version:string
}