import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AdminForUpdateDto } from '../dto/admin-for-update.dto';
import { AdminFormGroupInterface } from '../interfaces/admin-form-group.interface';
import { AdminForCreationDto } from '../dto/admin-for-creation.dto';
import { AdminsClient } from '../../_clients/admins/admins.client';
import { AdminInterface } from '../../_clients/admins/interface/admin.interface';
import { AdminItemBo } from '../bo/admin-item.bo';

@Injectable({ providedIn: 'root' })
export class AdminsService {
  constructor(private adminsClient: AdminsClient) {
  }

  public createAdmin(formGroupValue: AdminFormGroupInterface, token: string): Observable<any> {
    const adminDto = new AdminForCreationDto(formGroupValue);
    return this.adminsClient.createAdmin(adminDto.toJSON(), token);
  }

  public getAdmins(token: string): Observable<AdminItemBo[]> {
    return this.adminsClient
      .getAllAdmins(token)
      .pipe(
        map((admins: AdminInterface[]) =>
          admins.map(admin => new AdminItemBo(admin))
        )
      );
  }

  public getAdminDetails(id: string, token: string): Observable<AdminItemBo> {
    return this.adminsClient
      .getAdminById(id, token)
      .pipe(
        map((admin: AdminInterface) =>
          new AdminItemBo(admin))
      );
  }

  public updateAdmin(adminId: string, formGroupValue: AdminFormGroupInterface, token: string): Observable<any> {
    const adminDto = new AdminForUpdateDto(formGroupValue);
    return this.adminsClient.updateAdmin(adminId, adminDto.toJSON(), token);
  }

  public deleteAdmin(adminId: string, token: string): Observable<void> {
    return this.adminsClient.deleteAdmin(adminId, token);
  }
}
