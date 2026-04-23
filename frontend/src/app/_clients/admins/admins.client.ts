import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminInterface } from './interface/admin.interface';
import { AdminModel } from './models/admin.model';
import { UpdateAdminInterface } from './interface/update-admin.interface';
import {
  UpdatePasswordAdminFormGroupInterface
} from '../../admins/interfaces/update-password-admin-form-group.interface';


@Injectable({ providedIn: 'root' })
export class AdminsClient {
  private readonly API_URL = 'http://localhost:3000/admins';

  constructor(private http: HttpClient) {
  }

  private authHeaders(token: string): { headers: HttpHeaders } {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  public registerAdmin(admin: AdminInterface, token: string): Observable<AdminModel> {
    return this.http.post<AdminModel>(
      `${this.API_URL}/register`,
      {
        username: admin.username,
        email: admin.email,
        password: admin.password,
        gymId: admin.gymId
      },
      this.authHeaders(token)
    );
  }

  public getAllAdmins(token: string, gymId: string): Observable<AdminModel[]> {
    return this.http.get<AdminModel[]>(
      `${this.API_URL}?gymId=${gymId}`, // 🔹 append gymId as query param
      this.authHeaders(token)
    );
  }

  public getAdminById(id: string, token: string): Observable<AdminModel> {
    return this.http.get<AdminModel>(
      `${this.API_URL}/${id}`,
      this.authHeaders(token)
    );
  }

  public updateAdmin(id: string, admin: UpdateAdminInterface, token: string): Observable<AdminModel> {
    return this.http.put<AdminModel>(
      `${this.API_URL}/${id}`,
      admin,
      this.authHeaders(token)
    );
  }

  public updateAdminPassword(id: string, passwords: UpdatePasswordAdminFormGroupInterface, token: string): Observable<AdminModel> {
    return this.http.put<AdminModel>(
      `${this.API_URL}/${id}/password`,
      passwords,
      this.authHeaders(token)
    );
  }

  public updatePasswordBySuperAdmin(id: string, newPassword: string, token: string): Observable<AdminModel> {
    return this.http.put<AdminModel>(
      `${this.API_URL}/${id}/password/reset`,
      { newPassword },
      this.authHeaders(token)
    );
  }

  public deleteAdmin(id: string, token: string): Observable<any> {
    return this.http.delete(
      `${this.API_URL}/${id}`, this.authHeaders(token)
    );
  }
}
