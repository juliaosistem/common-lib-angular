import { BussinesDTO } from './BussinesDTO';
import { ImagenDTO } from './ImagenDTO';
import { MenuActive } from './MenuDTO';
import { SliderDTO } from './SliderDTO';

export interface PlantillaDTO{
    id: string,
    bussinesDTO?:BussinesDTO,
    slider?:SliderDTO[],
    menu?:MenuActive,
    imagenes?:ImagenDTO[]
}