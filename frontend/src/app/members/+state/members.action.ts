import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { MemberBo } from '../bo/member.bo';
import { MemberFormGroupInterface } from '../interfaces/member-form-group.interface';

export const MembersActions = createActionGroup({
  source: 'Members',
  events: {
    'reset Member Details Status': emptyProps(),

    'load Members': props<{ token: string }>(),
    'load Members Success': props<{ members: MemberBo[] }>(),
    'load Members Failure': props<{ error: Error }>(),

    'load Member Details': props<{ token: string, id: string }>(),
    'load Member Details Success': props<{ member: MemberBo }>(),
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
