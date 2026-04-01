import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { MemberDetailsBo } from '../bo/member-details.bo';
import { MemberFormGroupInterface } from '../interfaces/member-form-group.interface';
import { MemberItemBo } from '../bo/member-item.bo';

export const MembersActions = createActionGroup({
  source: 'Members',
  events: {
    'reset Member Details Status': emptyProps(),

    'load Members': props<{ token: string }>(),
    'load Members Success': props<{ members: MemberItemBo[] }>(),
    'load Members Failure': props<{ error: Error }>(),

    'load Member Details': props<{ token: string, id: string }>(),
    'load Member Details Success': props<{ member: MemberDetailsBo }>(),
    'load Member Details Failure': props<{ error: Error }>(),

    'create Member': props<{ token: string, member: MemberFormGroupInterface }>(),
    'create Member Success': emptyProps(),
    'create Member Failure': props<{ error: Error }>(),

    'update Member': props<{ token: string, id: string, member: MemberFormGroupInterface }>(),
    'update Member Success': emptyProps(),
    'update Member Failure': props<{ error: Error }>(),

    'delete Member': props<{ token: string, id: string }>(),
    'delete Member Success': emptyProps(),
    'delete Member Failure': props<{ error: Error }>(),
  }
});
