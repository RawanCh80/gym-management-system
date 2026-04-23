import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MemberDetailsModel } from './models/Member-details.model';
import { MemberItemBo } from '../../members/bo/member-item.bo';
import { MemberDetailsBo } from '../../members/bo/member-details.bo';
import { MemberDetailsInterface } from './interface/member-details.interface';


@Injectable({ providedIn: 'root' })
export class MembersClient {
  private readonly API_URL = 'http://localhost:3000/members';

  constructor(private http: HttpClient) {
  }

  private authHeaders(token: string): { headers: HttpHeaders } {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  public createMember(member: MemberDetailsInterface, token: string): Observable<MemberDetailsBo> {
    return this.http.post<MemberDetailsBo>(this.API_URL, member, this.authHeaders(token));
  }

  public getAllMembers(token: string): Observable<MemberItemBo[]> {
    return this.http.get<MemberItemBo[]>(this.API_URL, this.authHeaders(token));
  }

  public getMemberById(id: string, token: string): Observable<MemberDetailsModel> {
    return this.http.get<MemberDetailsModel>(`${this.API_URL}/${id}`, this.authHeaders(token));
  }

  public updateMember(id: string, updates: any, token: string): Observable<MemberDetailsBo> {
    return this.http.put<MemberDetailsBo>(`${this.API_URL}/${id}`, updates, this.authHeaders(token));
  }

  public deleteMember(id: string, token: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`, this.authHeaders(token));
  }
}
