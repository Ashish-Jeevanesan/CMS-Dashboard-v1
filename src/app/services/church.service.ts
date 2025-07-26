import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SupabaseService } from './supabase.client.service';

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
  constructor(private supabase: SupabaseService) {}

  async getChurches(payload: { city: string; state: string; }) {
    const { data, error } = await this.supabase
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
    const { data, error } = await this.supabase
      .from('o101_church')
      .update({
        status,
        last_updated_by: 2, // Assuming 2 is the ID of the user performing the action
        last_updated_date: new Date().toISOString()
      })
      .eq('church_id', id)
      .select();
    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error(`No church found with id ${id}`);
    }
    return data;
  }
}
