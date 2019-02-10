import {Injectable} from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminUserGuard implements CanActivate, CanActivateChild, CanLoad {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (state.url.startsWith('/dept-chairman')) {
      if (this.auth.user && this.auth.user.type === 'chairman') {
        return true;
      }
      this.router.navigate(['/login/admin']);
      return false;
    }
    if (state.url.startsWith('/dept-office')) {
      if (this.auth.user && this.auth.user.type === 'office') {
        return true;
      }
      this.router.navigate(['/login/admin']);
      return false;
    }
    if (state.url.startsWith('/bank')) {
      if (this.auth.user && this.auth.user.type === 'bank') {
        return true;
      }
      this.router.navigate(['/login/admin']);
      return false;
    }
    if (state.url.startsWith('/accounts')) {
      if (this.auth.user && this.auth.user.type === 'accounts') {
        return true;
      }
      this.router.navigate(['/login/admin']);
      return false;
    }
    return false;
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  constructor(private auth: AuthService, private router: Router) {
  }
}
