import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { SupabaseService } from './supabase.client.service';
import { UserService, User } from './user.service';
import { Session, AuthChangeEvent } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private sessionSubject = new BehaviorSubject<Session | null>(null);
  private authInitialized = new BehaviorSubject<boolean>(false);
  private isBrowser: boolean;

  constructor(
    private supabaseService: SupabaseService,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    if (this.isBrowser) {
      this.initializeAuth();
    } else {
      // For SSR, auth is considered initialized and there's no session.
      this.authInitialized.next(true);
    }
  }

  private async initializeAuth() {
    // Listen for auth state changes (fires on load and on login/logout)
    this.supabaseService.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      this.sessionSubject.next(session);

      if (session?.user?.email) {
        try {
          const userWithRole = await firstValueFrom(this.userService.getCurrentUserRole(session.user.email));
          this.setCurrentUser(userWithRole || null);
          console.log('User logged in with role:', userWithRole?.role?.roleName);
        } catch (error) {
          console.error('Error fetching user role:', error);
          this.setCurrentUser(null);
        }
      } else {
        this.setCurrentUser(null);
      }

      // Mark auth as initialized after the first event is processed.
      if (!this.authInitialized.value) {
        this.authInitialized.next(true);
      }
    });
  }

  private setCurrentUser(user: User | null) {
    if (user) {
      console.log('Fetched user:', user);
      console.log('Fetched role:', user.role);
    } else {
      console.log('No user fetched');
    }
    this.currentUserSubject.next(user);
  }

  // Observables for components to subscribe to
  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  get session$(): Observable<Session | null> {
    return this.sessionSubject.asObservable();
  }

  get authInitialized$(): Observable<boolean> {
    return this.authInitialized.asObservable();
  }

  // Get current user synchronously
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Get current session synchronously
  getCurrentSession(): Session | null {
    return this.sessionSubject.value;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.sessionSubject.value !== null;
  }

  // Check if current user is admin
  isAdmin(): boolean {
    const currentUser = this.getCurrentUser();
    return this.userService.isUserAdmin(currentUser);
  }

  // Check if current user has specific role
  hasRole(roleName: string): boolean {
    const currentUser = this.getCurrentUser();
    return currentUser?.role?.roleName?.toUpperCase() === roleName.toUpperCase();
  }

  // Check if current user can approve/rollback churches
  canManageChurches(): boolean {
    return this.isAdmin();
  }

  // Check if current user can manage users
  canManageUsers(): boolean {
    return this.isAdmin();
  }

  // Login method
  async login(email: string, password: string) {
    const result = await this.supabaseService.auth.signInWithPassword({
      email,
      password
    });
    
    return result;
  }

  // Logout method
  async logout() {
    const result = await this.supabaseService.auth.signOut();
    this.currentUserSubject.next(null);
    this.sessionSubject.next(null);
    return result;
  }
}