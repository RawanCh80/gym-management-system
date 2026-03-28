import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { MemberBo } from '../bo/member.bo';
import { MembersClient } from '../../_clients/members/members.client';
import { MemberInterface } from '../../_clients/members/interface/members.interface';
import { MemberForUpdateDto } from '../dto/member-for-update.dto';
import { MemberFormGroupInterface } from '../interfaces/member-form-group.interface';
import { MemberForCreationDto } from '../dto/member-for-creation.dto';

@Injectable({ providedIn: 'root' })
export class MembersService {
  constructor(private membersClient: MembersClient) {
  }

  public createMember(formGroupValue: MemberFormGroupInterface, token: string): Observable<any> {
    const memberDto = new MemberForCreationDto(formGroupValue);
    return this.membersClient.createMember(memberDto.toJSON(), token);
  }

  public getMembers(token: string): Observable<MemberBo[]> {
    return this.membersClient
      .getAllMembers(token)
      .pipe(
        map((members: MemberInterface[]) =>
          members.map(member => new MemberBo(member))
        )
      );
  }

  public getMemberDetails(id: string, token: string): Observable<MemberBo> {
    return this.membersClient
      .getMemberById(id, token)
      .pipe(
        map((member: MemberInterface) =>
          new MemberBo(member))
      );
  }

  public updateMember(memberId: string, formGroupValue: MemberFormGroupInterface, token: string): Observable<any> {
    const memberDto = new MemberForUpdateDto(formGroupValue);
    return this.membersClient.updateMember(memberId, memberDto.toJSON(), token);
  }

  public deleteMember(memberId: string, token: string): Observable<void> {
    return this.membersClient.deleteMember(memberId, token);
  }
}
