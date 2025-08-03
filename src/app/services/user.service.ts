import { Injectable } from '@angular/core';
import { Observable, from, last } from 'rxjs';
import { SupabaseService } from './supabase.client.service';

export interface Role {
  roleId: number;
  roleName: string;
  roleDescription?: string;
}

export interface Church {
  churchId: number;
  churchName: string;
  isActive?: boolean;
}

export interface AccessPermissions {
  read: boolean;
  write: boolean;
  delete: boolean;
}

export interface AccessMap {
  [key: string]: AccessPermissions;
}

export interface User {
  userId: number;
  userName: string;
  userFName: string;
  userLName: string | null;
  userEmail: string;
  userRole?: number;
  role?: Role;
  church?: Church;
  accessMap?: AccessMap;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private supabase: SupabaseService) { }

  getUsers(): Observable<User[]> {
    // Convert Supabase promise to Observable for consistency with existing components
    return from(this.fetchUsers());
  }

  // Get a specific user by ID
  getUserById(userId: number): Observable<User | null> {
    return from(this.fetchUserById(userId));
  }

  // Get users with pagination
  getUsersPaginated(page: number = 0, limit: number = 50): Observable<User[]> {
    return from(this.fetchUsersPaginated(page, limit));
  }

  // Get current user's role information by email
  getCurrentUserRole(email: string): Observable<User | null> {
    return from(this.fetchCurrentUserRole(email));
  }

  // Check if user has admin role
  isUserAdmin(user: User | null): boolean {
    return user?.role?.roleName?.toUpperCase() === 'ADMIN';
  }

  getActiveChurches(): Observable<Church[]> {
    return from(this.fetchActiveChurches());
  }

  async updateUserChurch(userId: number, churchId: number): Promise<User | null> {
    console.log(`Updating user ${userId} with church ${churchId}`);
    const { data, error } = await this.supabase
      .from('o102_user')
      .update({ church_id: churchId })
      .eq('user_id', userId)
      .select(); // Select the church details if needed

    if (error) {
      console.error('Error updating user church:', error);
      throw error;
    }
    return data && data.length > 0 ? {
      userId: data[0].user_id,
      userName: data[0].user_name, // Assuming these fields are returned or can be defaulted
      userFName: data[0].user_f_name,
      userLName: data[0].user_l_name || null, // Ensure userLName is included
      userEmail: data[0].user_email,
      userRole: data[0].user_role, // Ensure userRole is included
      church: { churchId: data[0].church_id, churchName: data[0].church_name || '' } } : null;
  }

  private async fetchUsers(): Promise<User[]> {
    try {
      const { data, error } = await this.supabase
        .from('o102_user')
        .select(`
          user_id,
          user_name,
          user_f_name,
          user_l_name,
          user_email,
          user_role,
          o103_roles!user_role (
            role_id,
            role_nm
          ),
          o101_church!church_id (
            church_id,
            church_name
          )
        `)
        .order('user_id', { ascending: true });
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      return (data ?? []).map((item: any) => ({
        userId: item.user_id,
        userName: item.user_name || 'N/A',
        userFName: item.user_f_name || 'N/A',
        userLName: item.user_l_name || null,
        userEmail: item.user_email || 'N/A',
        userRole: item.user_role,
        role: item.o103_roles ? {
          roleId: item.o103_roles.role_id,
          roleName: item.o103_roles.role_nm
        } : undefined,
        church: item.o101_church ? {
          churchId: item.o101_church.church_id,
          churchName: item.o101_church.church_name
        } : undefined
      }));
    } catch (error) {
      console.error('Error fetching users from Supabase:', error);
      throw error;
    }
  }

  private async fetchUserById(userId: number): Promise<User | null> {
    try {
      const { data, error } = await this.supabase
        .from('o102_user')
        .select('user_id, user_name, user_f_name, user_l_name, user_email')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      if (!data) return null;
      
      return {
        userId: data.user_id,
        userName: data.user_name || 'N/A',
        userFName: data.user_f_name || 'N/A',
        userLName: data.user_l_name || null,
        userEmail: data.user_email || 'N/A'
      };
    } catch (error) {
      console.error('Error fetching user by ID from Supabase:', error);
      throw error;
    }
  }

  private async fetchUsersPaginated(page: number, limit: number): Promise<User[]> {
    try {
      const from = page * limit;
      const to = from + limit - 1;
      
      const { data, error } = await this.supabase
        .from('o102_user')
        .select('user_id, user_name, user_f_name, user_l_name, user_email')
        .order('user_id', { ascending: true })
        .range(from, to);
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      return (data ?? []).map((item: any) => ({
        userId: item.user_id,
        userName: item.user_name || 'N/A',
        userFName: item.user_f_name || 'N/A',
        userLName: item.user_l_name || null,
        userEmail: item.user_email || 'N/A'
      }));
    } catch (error) {
      console.error('Error fetching paginated users from Supabase:', error);
      throw error;
    }
  }

  public async fetchCurrentUserRole(email: string): Promise<User | null> {
    console.log('Querying user by email:', email); // Add this line
    try {
      const { data, error } = await this.supabase
        .from('o102_user')
        .select(`
          user_id,
          user_name,
          user_f_name,
          user_l_name,
          user_email,
          user_role,
          o103_roles!user_role (
            role_id,
            role_nm
          )
        `)
        .eq('user_email', email)
        .single();
      
      if (error) {
        console.error('Supabase error fetching user role:', error);
        throw error;
      }
      
      if (!data) return null;
      
      console.log('Fetched current user role data:', data); // Debug log
      
      return {
        userId: data.user_id,
        userName: data.user_name || 'N/A',
        userFName: data.user_f_name || 'N/A',
        userLName: data.user_l_name || null,
        userEmail: data.user_email || 'N/A',
        userRole: data.user_role,
        role: data.o103_roles ? {
          roleId: data.o103_roles.role_id,
          roleName: data.o103_roles.role_nm
        } : undefined
      };
    } catch (error) {
      console.error('Error fetching current user role from Supabase:', error);
      throw error;
    }
  }

  async updateUserAccess(userId: number, accessMap: AccessMap): Promise<void> {
    // Need to get the user ID for last update by from session or context.
    try {
      console.log(`Updating access for user ${userId}`, accessMap); // Debug log
      const { data,error } = await this.supabase
        .from('o102_user')
        .update({ access_map: accessMap },
          { last_updated_by: 2, // Assuming 2 is the ID of the user performing the action
            last_updated_date: new Date().toISOString()
          }
        )
        .eq('user_id', userId)
        .select(); // Select to ensure the update is applied

      if (error) throw error;

      if(data && data.length > 0) {
      console.log(`User ${userId} access updated successfully with data:`, data);
      } else {
        console.warn(`No data returned for user ${userId} after access update.`);
      }

    } catch (error) {
      console.error('Error updating user access:', error);
      throw error;
    }
    
  }

  private async fetchActiveChurches(): Promise<Church[]> {
    try {
      const { data, error } = await this.supabase
        .from('o101_church')
        .select('church_id, church_name')
        .eq('active_fl', 'Y')
        .order('church_name');

      if (error) throw error;

      return data.map((church: any) => ({
        churchId: church.church_id,
        churchName: church.church_name
      }));
    } catch (error) {
      console.error('Error fetching churches:', error);
      throw error;
    }
  }

  // Keep the HTTP fallback method for backward compatibility if needed
  // You can remove this if you're fully migrating to Supabase
  /*
  private baseUrl = 'http://localhost:9000';
  
  getUsersFromAPI(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/api/getUsers`);
  }
  */
}
