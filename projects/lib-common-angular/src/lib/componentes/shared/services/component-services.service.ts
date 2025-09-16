import { Injectable } from '@angular/core';
import { ImagenDTO, ProductoDTO } from '@juliaosistem/core-dtos';

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
