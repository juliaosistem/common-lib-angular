import { BussinesDTO } from './BussinesDTO';
import { MenuActive } from './MenuDTO';
import { SliderDTO } from './SliderDTO';

export interface PlantillaDTO{
    id: string,
    bussinesDTO?:BussinesDTO,
    slider?:SliderDTO[],
    menu?:MenuActive,
}