import { PermisoCrudDto } from '../../../services/permisos.service';
import { createGenericCrudActions } from '../state-generic/generic-crud.actions';

const permisosActions = createGenericCrudActions<PermisoCrudDto>('permisos');

/**
 * Acciones CRUD genericas reutilizadas para el catalogo de permisos.
 */
export const PermisosActions = permisosActions;
