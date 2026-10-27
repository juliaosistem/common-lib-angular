import { UserProfileSavePayload } from "../../../componentes/shared/molecules/user-profile-dialog1/user-profile-dialog1.component";
import { PlantillaResponse } from 'juliaositembackenexpress/dist/utils/PlantillaResponse';


export type UserSection = 'employees' | 'clients' | 'all';

/**
 * Nombre real del rol de negocio usado para filtrar usuarios en el backend
 * (`GET /user/all-by-role?role=`). EMPLEADO agrupa personal interno y
 * USUARIO agrupa clientes finales.
 */
export type RoleFilter = 'EMPLEADO' | 'USUARIO';

export interface UsersDashboardStateModel extends PlantillaResponse<Record<string, unknown>> {
  employees: Record<string, unknown>[];
  clients: Record<string, unknown>[];
  all: Record<string, unknown>[];
  loading: boolean;
  error: string;
}

export interface SaveUserProfileCommand {
  section: UserSection;
  userId: string | null;
  payload: UserProfileSavePayload;
}
