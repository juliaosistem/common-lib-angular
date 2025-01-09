import { ProductoDTO } from '../componentes/daskboards/daskboard1/models/ProductoDTO';
import { ImagenDTO } from '../componentes/daskboards/daskboard1/models/ImagenDTO';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentServicesService {

  constructor() { }

  findImagenesByIdComponent(imagenDTO:ImagenDTO[],idComponente :string):ImagenDTO[] {
     return imagenDTO.filter(img=> img.id == idComponente)
  }
  
  findProductosByIdCategori(productoDTO:ProductoDTO[],idCategoria :string):ProductoDTO[]{
    return productoDTO.filter(p=> p.idCategorie == idCategoria);
  }
  

}
