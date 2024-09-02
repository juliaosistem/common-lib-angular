import { ImagenDTO } from "./ImagenDTO";

export interface SliderDTO{
    id:string,
    imagen?:ImagenDTO,
    descripcion:string,
    titulo:string,
    subTitulo?:string,
    
}