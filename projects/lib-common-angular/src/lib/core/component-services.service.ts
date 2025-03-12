import { Injectable } from '@angular/core';
import{ImagenDTO} from 'juliaositembackenexpress/dist/api/dtos/bussines/ImagenDTO';
import { ProductoDTO } from 'juliaositembackenexpress/dist/api/dtos/bussines/productoDTO';

@Injectable({
  providedIn: 'root'
})
export class ComponentServicesService {

  constructor() { }

  findImagenesByIdComponent(imagenDTO:ImagenDTO[],idComponente :string):ImagenDTO[] {
     return imagenDTO.filter(img=> img.id == idComponente)
  }
  
  findProductosByIdCategori(productoDTO:ProductoDTO[],idCategoria :string):ProductoDTO[]{
    return productoDTO.filter(p=> p.idCategoria == idCategoria);
  }
  

}
