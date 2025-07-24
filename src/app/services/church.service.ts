import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { supabase } from './supabase.client.service';

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
  /**
   * The Logic is shifted from the backend to the frontend. 
  private baseUrl = 'http://localhost:9000';
  constructor(private http: HttpClient) {}

  getChurches(payload: { city: string; state: string }): Observable<Church[]> {
    return this.http.post<Church[]>(`${this.baseUrl}/api/getChurch`, { payload });
  }

  approveChurch(churchId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/approve`, { churchId });
  }**/
 /**active_fl: "Y"
​​
church_add2: "chennai"
​​
church_address_1: "thoriapakkam"
​​
church_city: "chennai"
​​
church_country: "India"
​​
church_id: 2
​​
church_location: "oca"
​​
church_name: "oca"
​​
church_pin: null
​​
church_state: "tamil nadu"
​​
created_by: 2
​​
created_date: "2025-06-11"
​​
fts: "'chennai':2B 'nadu':4C 'oca':1A 'tamil':3C"
​​
"last_updated _by": null
​​
last_updated_by: null
​​
last_updated_date: null
​​
status: null
 */
  async getChurches(payload: { city: string; state: string; }) {
    const { data, error } = await supabase
      .from('o101_church')
      .select('church_name, church_id, church_city, church_state, church_country, status');
    if (error) throw error;
    // Map DB fields to your Church interface
    return (data ?? []).map((item: any) => ({
      name: item.church_name,
      id: item.church_id,
      city: item.church_city,
      state: item.church_state,
      country: item.church_country,
      status: item.status
    }));
  }

  async approveChurch(id: number, status: string) {
    const { data, error } = await supabase
      .from('o101_church')
      .update({ status })
      .eq('church_id', id)
      .select();
    if (error) throw error;
    return data;
  }
}
