import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GymInterface } from './interface/gym.interface';


@Injectable({ providedIn: 'root' })
export class GymsClient {
  private readonly API_URL = 'http://localhost:3000/gyms';

  constructor(private http: HttpClient) {
  }

  private authHeaders(token: string): { headers: HttpHeaders } {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  public createGym(gym: GymInterface, token: string): Observable<GymInterface> {
    return this.http.post<GymInterface>(
      this.API_URL,
      gym,
      this.authHeaders(token)
    );
  }

  public getAllGyms(token: string): Observable<GymInterface[]> {
    return this.http.get<GymInterface[]>(
      this.API_URL,
      this.authHeaders(token)
    );
  }

  public getGymById(id: string, token: string): Observable<GymInterface> {
    return this.http.get<GymInterface>(
      `${this.API_URL}/${id}`,
      this.authHeaders(token)
    );
  }

  public updateGym(id: string, gym: GymInterface, token: string): Observable<GymInterface> {
    return this.http.put<GymInterface>(
      `${this.API_URL}/${id}`,
      gym,
      this.authHeaders(token)
    );
  }

  public deleteGym(id: string, token: string): Observable<any> {
    return this.http.delete(
      `${this.API_URL}/${id}`,
      this.authHeaders(token)
    );
  }
}
