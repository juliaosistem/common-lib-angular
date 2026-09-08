import { UserProfileSavePayload } from '../../../componentes/shared/molecules/user-profile-dialog1/user-profile-dialog1.component';
import { RoleFilter, UserSection } from './users-dashboard.models';

export class LoadUsersDashboard {
  static readonly type = '[UsersDashboard] Load Users';

  constructor(public section: UserSection) {}
}

export class SaveUsersDashboardProfile {
  static readonly type = '[UsersDashboard] Save User Profile';

  constructor(
    public section: UserSection,
    public userId: string | null,
    public payload: UserProfileSavePayload,
  ) {}
}

export class DeleteUsersDashboard {
  static readonly type = '[UsersDashboard] Delete User';

  constructor(
    public section: UserSection,
    public userId: string,
  ) {}
}

export class SetUsersDashboardRoleFilter {
  static readonly type = '[UsersDashboard] Set Role Filter';

  constructor(public roleFilter: RoleFilter) {}
}
