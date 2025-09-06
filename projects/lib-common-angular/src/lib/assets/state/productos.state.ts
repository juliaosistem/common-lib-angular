import { Injectable } from '@angular/core';
import { ProductoDTO } from '@juliaosistem/core-dtos';
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';
import { ProductService } from '../../componentes/shared/services/product.service';
import { createGenericCrudActions } from './generic-crud.actions';
import { GenericCrudState } from './generic-crud.state';
import { State } from '@ngxs/store';

// Definimos acciones específicas para Producto
const productActions = createGenericCrudActions<ProductoDTO>('ProductoDTO');

@State<PlantillaResponse<ProductoDTO>>({
  name: 'productos',
  defaults: {
    data: undefined,
    dataList: [],
    message: '',
    rta: false,
  },
})
@Injectable()
export class ProductosState extends GenericCrudState<ProductoDTO, ProductoDTO> {
  constructor(service: ProductService) {
    super(service, productActions); // 👈 Pasamos servicio + acciones
  }

  // Aquí puedes añadir acciones personalizadas solo para Productos
  // @Action(CustomAction) ...
}
