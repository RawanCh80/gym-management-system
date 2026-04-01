import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GymDetailsBo } from '../bo/gym-details.bo';
import { GymForUpdateDto } from '../dto/gym-for-update.dto';
import { GymFormGroupInterface } from '../interfaces/gym-form-group.interface';
import { GymForCreationDto } from '../dto/gym-for-creation.dto';
import { GymsClient } from '../../_clients/gyms/gyms.client';
import { GymInterface } from '../../_clients/gyms/interface/gym.interface';

@Injectable({ providedIn: 'root' })
export class GymsService {
  constructor(private gymsClient: GymsClient) {
  }

  public createGym(formGroupValue: GymFormGroupInterface, token: string): Observable<any> {
    const gymDto = new GymForCreationDto(formGroupValue);
    return this.gymsClient.createGym(gymDto.toJSON(), token);
  }

  public getGyms(token: string): Observable<GymDetailsBo[]> {
    return this.gymsClient
      .getAllGyms(token)
      .pipe(
        map((gyms: GymInterface[]) =>
          gyms.map(gym => new GymDetailsBo(gym))
        )
      );
  }

  public getGymDetails(id: string, token: string): Observable<GymDetailsBo> {
    return this.gymsClient
      .getGymById(id, token)
      .pipe(
        map((gym: GymInterface) =>
          new GymDetailsBo(gym))
      );
  }

  public updateGym(gymId: string, formGroupValue: GymFormGroupInterface, token: string): Observable<any> {
    const gymDto = new GymForUpdateDto(formGroupValue);
    return this.gymsClient.updateGym(gymId, gymDto.toJSON(), token);
  }

  public deleteGym(gymId: string, token: string): Observable<void> {
    return this.gymsClient.deleteGym(gymId, token);
  }
}
