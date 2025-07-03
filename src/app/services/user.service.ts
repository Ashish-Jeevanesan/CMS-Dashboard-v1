import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface User {
  userId: number;
  userName: string;
  userFName: string;
  userLName: string | null;
  userEmail: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
private baseUrl = 'http://localhost:9000';
  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/api/getUsers`);
  }
}
