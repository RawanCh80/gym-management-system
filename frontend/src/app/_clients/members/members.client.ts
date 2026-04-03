import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MemberInterface } from './interface/members.interface';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class MembersClient {
  private readonly API_URL = 'http://localhost:3000/members';

  constructor(private http: HttpClient) {
  }

  private authHeaders(token: string): { headers: HttpHeaders } {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  public createMember(member: MemberInterface, token: string): Observable<MemberInterface> {
    return this.http.post<MemberInterface>(this.API_URL, member, this.authHeaders(token));
  }

  public getAllMembers(token: string): Observable<MemberInterface[]> {
    return this.http.get<MemberInterface[]>(this.API_URL, this.authHeaders(token));
  }

  public getMemberById(id: string, token: string): Observable<MemberInterface> {
    return this.http.get<MemberInterface>(`${this.API_URL}/${id}`, this.authHeaders(token));
  }

  public updateMember(id: string, updates: any, token: string): Observable<MemberInterface> {
    return this.http.put<MemberInterface>(`${this.API_URL}/${id}`, updates, this.authHeaders(token));
  }

  public deleteMember(id: string, token: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`, this.authHeaders(token));
  }
}
