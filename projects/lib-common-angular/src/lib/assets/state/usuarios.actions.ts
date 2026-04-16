import { LoginDTO, RegisterUserDTO } from '@juliaosistem/core-dtos';
import { createGenericCrudActions } from './state-generic/generic-crud.actions';

// Crear todas las acciones CRUD para usuarios
const userActions = createGenericCrudActions<RegisterUserDTO>('usuarios');

export const getUsers = userActions.All;
export const AddUser = userActions.Add;
export const UpdateUser = userActions.Update;
export const DeleteUser = userActions.Delete;
export class Login {
	static readonly type = '[usuarios] LOGIN';
	constructor(public payload: LoginDTO) {}
}

// Acción Refresh Token
export class RefreshToken {
	static readonly type = '[usuarios] REFRESH_TOKEN';
	constructor(public payload: { refreshToken: string }) {}
}