import { map, Observable } from 'rxjs';
import { MemberDetailsBo } from '../bo/member-details.bo';
import { MembersClient } from '../../_clients/members/members.client';
import { MemberFormGroupInterface } from '../interfaces/member-form-group.interface';
import { MemberForCreationDto } from '../dto/member-for-creation.dto';
import { Injectable } from '@angular/core';
import { MemberDetailsModel } from '../../_clients/members/models/Member-details.model';
import { MemberItemBo } from '../bo/member-item.bo';
import { MemberForUpdateDto } from '../dto/member-for-update.dto';

@Injectable({ providedIn: 'root' })
export class MembersService {
  constructor(private membersClient: MembersClient) {
  }

  public createMember(formGroupValue: MemberFormGroupInterface, token: string): Observable<any> {
    const memberDto = new MemberForCreationDto(formGroupValue);
    return this.membersClient.createMember(memberDto.toJSON(), token);
  }

  public getMembers(token: string): Observable<MemberItemBo[]> {
    return this.membersClient
      .getAllMembers(token)
      .pipe(
        map((members: MemberItemBo[]) =>
          members.map(member => new MemberItemBo(member))
        )
      );
  }

  public getMemberDetails(id: string, token: string): Observable<MemberDetailsBo> {
    return this.membersClient
      .getMemberById(id, token)
      .pipe(
        map((member: MemberDetailsModel) =>
          new MemberDetailsBo(member))
      );
  }

  public updateMember(memberId: string, formGroupValue: MemberFormGroupInterface, token: string): Observable<any> {
    const memberDto = new MemberForUpdateDto('edit-member',formGroupValue);
    return this.membersClient.updateMember(memberId, memberDto.toJSON(), token);
  }

  public deleteMember(memberId: string, token: string): Observable<void> {
    return this.membersClient.deleteMember(memberId, token);
  }
}
