import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Church {
churchName: any;
  id: number;
  name: string;
}
@Injectable({
  providedIn: 'root'
})
export class ChurchService {
  private baseUrl = 'http://localhost:8080';
  constructor(private http: HttpClient) { }

  getChurches(city: string, state: string): Observable<Church[]> {
    return this.http.post<Church[]>(`${this.baseUrl}/list`, { city, state });
  }

  approveChurch(churchId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/approve`, { churchId });
  }

}
