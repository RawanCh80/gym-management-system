import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminInterface } from './interface/admin.interface';


@Injectable({ providedIn: 'root' })
export class AdminsClient {
  private readonly API_URL = 'http://localhost:3000/admins';

  constructor(private http: HttpClient) {
  }

  private authHeaders(token: string): { headers: HttpHeaders } {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  public createAdmin(admin: AdminInterface, token: string): Observable<AdminInterface> {
    return this.http.post<AdminInterface>(
      this.API_URL,
      admin,
      this.authHeaders(token)
    );
  }

  public getAllAdmins(token: string): Observable<AdminInterface[]> {
    return this.http.get<AdminInterface[]>(
      this.API_URL,
      this.authHeaders(token)
    );
  }

  public getAdminById(id: string, token: string): Observable<AdminInterface> {
    return this.http.get<AdminInterface>(
      `${this.API_URL}/${id}`,
      this.authHeaders(token)
    );
  }

  public updateAdmin(id: string, admin: AdminInterface, token: string): Observable<AdminInterface> {
    return this.http.put<AdminInterface>(
      `${this.API_URL}/${id}`,
      admin,
      this.authHeaders(token)
    );
  }

  public deleteAdmin(id: string, token: string): Observable<any> {
    return this.http.delete(
      `${this.API_URL}/${id}`,
      this.authHeaders(token)
    );
  }
}
