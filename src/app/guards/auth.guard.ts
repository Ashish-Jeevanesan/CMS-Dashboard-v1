import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map, filter, take, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    // Wait for the auth service to be initialized before checking the session.
    return this.authService.authInitialized$.pipe(
      filter(initialized => initialized), // Wait until the initial auth check is complete.
      take(1), // Take the first `true` value and then stop listening to this.
      switchMap(() => this.authService.session$), // Now, get the current session state.
      map(session => {
        if (session) {
          return true; // User is authenticated, allow access to the route.
        }
        // User is not authenticated, redirect to the login page.
        return this.router.createUrlTree(['/login']);
      })
    );
  }
}