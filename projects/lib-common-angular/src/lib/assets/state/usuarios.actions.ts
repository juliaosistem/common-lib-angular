import { DatesUserDTO } from '@juliaosistem/core-dtos';
import { createGenericCrudActions } from './state-generic/generic-crud.actions';

// Crear todas las acciones CRUD para usuarios
const userActions = createGenericCrudActions< DatesUserDTO>('usuarios');

export const getUsers = userActions.All;
export const AddUser = userActions.Add;
export const UpdateUser = userActions.Update;
export const DeleteUser = userActions.Delete;

