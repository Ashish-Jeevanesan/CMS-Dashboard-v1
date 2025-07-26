import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient | null = null;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    // Only initialize Supabase client in browser environment
    if (this.isBrowser) {
      try {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            flowType: 'pkce'
          },
          global: {
            headers: {
              'X-Client-Info': 'cms-dashboard'
            }
          }
        });
      } catch (error) {
        console.error('Failed to initialize Supabase client:', error);
      }
    }
  }

  get auth() {
    if (!this.isBrowser || !this.supabase) {
      // Return mock auth for SSR or failed initialization
      return {
        onAuthStateChange: () => ({ data: { subscription: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase not initialized') }),
        signOut: () => Promise.resolve({ error: null })
      } as any;
    }
    return this.supabase.auth;
  }

  from(table: string) {
    if (!this.isBrowser || !this.supabase) {
      // Return mock query builder for SSR or failed initialization
      return {
        select: () => ({
          eq: () => Promise.resolve({ data: [], error: null }),
          update: () => ({
            eq: () => ({
              select: () => Promise.resolve({ data: [], error: null })
            })
          })
        }),
        update: () => ({
          eq: () => ({
            select: () => Promise.resolve({ data: [], error: null })
          })
        })
      } as any;
    }
    return this.supabase.from(table);
  }

  // Helper method to check if Supabase is properly initialized
  isInitialized(): boolean {
    return this.isBrowser && this.supabase !== null;
  }
}
