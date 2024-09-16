import { BussinesDTO } from './BussinesDTO';
import { ImagenDTO } from './ImagenDTO';
import { MenuActive } from './MenuDTO';

export interface PlantillaDTO{
    id: string,
    bussinesDTO?:BussinesDTO,
    menu?:MenuActive,
    imagenes?:ImagenDTO[]
}