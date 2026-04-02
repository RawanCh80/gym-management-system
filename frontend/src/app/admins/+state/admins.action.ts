import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AdminFormGroupInterface } from '../interfaces/admin-form-group.interface';
import { AdminItemBo } from '../bo/admin-item.bo';

export const AdminsActions = createActionGroup({
  source: 'Admins',
  events: {
    'reset Admin Details Status': emptyProps(),

    'load Admins': props<{ token: string }>(),
    'load Admins Success': props<{ admins: AdminItemBo[] }>(),
    'load Admins Failure': props<{ error: Error }>(),

    'load Admin Details': props<{ token: string; id: string }>(),
    'load Admin Details Success': props<{ admin: AdminItemBo }>(),
    'load Admin Details Failure': props<{ error: Error }>(),

    'create Admin': props<{ token: string; admin: AdminFormGroupInterface }>(),
    'create Admin Success': emptyProps(),
    'create Admin Failure': props<{ error: Error }>(),

    'update Admin': props<{
      token: string;
      id: string;
      admin: AdminFormGroupInterface;
    }>(),
    'update Admin Success': emptyProps(),
    'update Admin Failure': props<{ error: Error }>(),

    'delete Admin': props<{ token: string; id: string }>(),
    'delete Admin Success': emptyProps(),
    'delete Admin Failure': props<{ error: Error }>(),
  }
});
