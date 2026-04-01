import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { GymDetailsBo } from '../bo/gym-details.bo';
import { GymFormGroupInterface } from '../interfaces/gym-form-group.interface';
import { GymItemBo } from '../bo/gym-item.bo';

export const GymsActions = createActionGroup({
  source: 'Gyms',
  events: {
    'reset Gym Details Status': emptyProps(),

    'load Gyms': props<{ token: string }>(),
    'load Gyms Success': props<{ gyms: GymItemBo[] }>(),
    'load Gyms Failure': props<{ error: Error }>(),

    'load Gym Details': props<{ token: string; id: string }>(),
    'load Gym Details Success': props<{ gym: GymDetailsBo }>(),
    'load Gym Details Failure': props<{ error: Error }>(),

    'create Gym': props<{ token: string; gym: GymFormGroupInterface }>(),
    'create Gym Success': emptyProps(),
    'create Gym Failure': props<{ error: Error }>(),

    'update Gym': props<{
      token: string;
      id: string;
      gym: GymFormGroupInterface;
    }>(),
    'update Gym Success': emptyProps(),
    'update Gym Failure': props<{ error: Error }>(),

    'delete Gym': props<{ token: string; id: string }>(),
    'delete Gym Success': emptyProps(),
    'delete Gym Failure': props<{ error: Error }>(),
  }
});
