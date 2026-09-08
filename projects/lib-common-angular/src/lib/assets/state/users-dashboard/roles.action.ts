import { RoleCrudDto } from '../../../services/roles.service';
import { createGenericCrudActions } from '../state-generic/generic-crud.actions';

const rolesActions = createGenericCrudActions<RoleCrudDto>('roles');

/**
 * Acciones CRUD genericas reutilizadas para el catalogo de roles.
 */
export const RolesActions = rolesActions;
