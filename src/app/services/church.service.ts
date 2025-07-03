import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Church {
  name: any;
  id: number;
  city: string;
  state: string;
  country: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChurchService {
  private baseUrl = 'http://localhost:9000';
  constructor(private http: HttpClient) {}

  getChurches(payload: { city: string; state: string }): Observable<Church[]> {
    return this.http.post<Church[]>(`${this.baseUrl}/api/getChurch`, { payload });
  }

  approveChurch(churchId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/approve`, { churchId });
  }

}
