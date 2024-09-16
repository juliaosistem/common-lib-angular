import { ModuloDTO } from './ModuloDTO';
export interface MenuDTO{
      id:string,
      icon?: string,
      url: string,
      itemName: string,
      subItemName: string
      nameRol:string[],
      moduloDTO?:ModuloDTO,
      
  }
  
  export interface MenuActive{
      
      rolActive:string,
      menuModel:MenuDTO[];
  }