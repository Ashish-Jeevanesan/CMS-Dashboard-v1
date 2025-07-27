import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient | null = null;
  private isBrowser: boolean;
  private sessionSubject = new BehaviorSubject<Session | null>(null);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
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

        this.supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
          this.sessionSubject.next(session);
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

  get session$(): Observable<Session | null> {
    return this.sessionSubject.asObservable();
  }
}