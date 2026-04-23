import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AdminForUpdateDto } from '../dto/admin-for-update.dto';
import { UpdateAdminFormGroupInterface } from '../interfaces/update-admin-form-group.interface';
import { AdminsClient } from '../../_clients/admins/admins.client';
import { AdminItemBo } from '../bo/admin-item.bo';
import { RegisterDto } from '../../reigister-page/dto/register.dto';
import { AdminModel } from '../../_clients/admins/models/admin.model';
import { AdminFormGroupInterface } from '../interfaces/admin-form-group.interface';
import { UpdatePasswordAdminFormGroupInterface } from '../interfaces/update-password-admin-form-group.interface';
import { AdminPasswordUpdateDto } from '../dto/admin-password-update.dto';

@Injectable({ providedIn: 'root' })
export class AdminsService {
  constructor(private adminsClient: AdminsClient) {
  }

  public createAdmin(formGroupValue: AdminFormGroupInterface, token: string): Observable<any> {
    const adminDto = new RegisterDto(formGroupValue);
    return this.adminsClient.registerAdmin(adminDto.toJSON(), token);
  }

  public getAdmins(token: string, gymId: string): Observable<AdminItemBo[]> {
    return this.adminsClient
      .getAllAdmins(token, gymId)
      .pipe(
        map((admins: AdminModel[]) =>
          admins.map(admin => new AdminItemBo(admin))
        )
      );
  }

  public getAdminDetails(id: string, token: string): Observable<AdminItemBo> {
    return this.adminsClient
      .getAdminById(id, token)
      .pipe(
        map((admin: AdminModel) =>
          new AdminItemBo(admin))
      );
  }

  public updateAdmin(adminId: string, formGroupValue: UpdateAdminFormGroupInterface, token: string): Observable<any> {
    const adminDto = new AdminForUpdateDto(formGroupValue);
    return this.adminsClient.updateAdmin(adminId, adminDto.toJSON(), token);
  }

  public updateAdminPasswordByHim(adminId: string, formGroupValue: UpdatePasswordAdminFormGroupInterface, token: string): Observable<any> {
    const adminDto = new AdminPasswordUpdateDto(formGroupValue);
    return this.adminsClient.updateAdminPassword(adminId, adminDto.toJSON(), token);
  }

  public updatePasswordBySuperAdmin(adminId: string, newPassword: string, token: string): Observable<any> {
    return this.adminsClient.updatePasswordBySuperAdmin(adminId, newPassword, token);
  }

  public deleteAdmin(adminId: string, token: string): Observable<void> {
    return this.adminsClient.deleteAdmin(adminId, token);
  }
}
