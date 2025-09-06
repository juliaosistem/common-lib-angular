import { ProductoDTO } from '@juliaosistem/core-dtos';
import { createGenericCrudActions } from './generic-crud.actions';

// Crear todas las acciones CRUD para productos
const productActions = createGenericCrudActions<ProductoDTO, ProductoDTO>('ProductoDTO');

