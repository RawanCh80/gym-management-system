import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { UpdateAdminFormGroupInterface } from '../interfaces/update-admin-form-group.interface';
import { AdminItemBo } from '../bo/admin-item.bo';
import { UpdatePasswordAdminFormGroupInterface } from '../interfaces/update-password-admin-form-group.interface';
import { AdminFormGroupInterface } from '../interfaces/admin-form-group.interface';

export const AdminsActions = createActionGroup({
  source: 'Admins',
  events: {
    'reset Admin Details Status': emptyProps(),

    'load Admins': props<{ token: string, gymId: string }>(),
    'load Admins Success': props<{ admins: AdminItemBo[] }>(),
    'load Admins Failure': props<{ error: Error }>(),

    'load Admin Details': props<{ token: string; id: string }>(),
    'load Admin Details Success': props<{ admin: AdminItemBo }>(),
    'load Admin Details Failure': props<{ error: Error }>(),

    'create Admin': props<{ token: string; admin: AdminFormGroupInterface }>(),
    'create Admin Success': emptyProps(),
    'create Admin Failure': props<{ error: Error }>(),

    'update Admin Password': props<{ token: string; id: string; passwords: UpdatePasswordAdminFormGroupInterface }>(),
    'update Admin Password Success': emptyProps(),
    'update Admin Password Failure': props<{ error: Error }>(),

    'update Admin Password By Super Admin': props<{ token: string; id: string; newPassword: string }>(),
    'update Admin Password By Super Admin Success': emptyProps(),
    'update Admin Password By Super Admin Failure': props<{ error: Error }>(),

    'update Admin': props<{
      token: string;
      id: string;
      admin: UpdateAdminFormGroupInterface;
    }>(),
    'update Admin Success': emptyProps(),
    'update Admin Failure': props<{ error: Error }>(),

    'delete Admin': props<{ token: string; id: string; gymId: string }>(),
    'delete Admin Success': emptyProps(),
    'delete Admin Failure': props<{ error: Error }>(),
  }
});
