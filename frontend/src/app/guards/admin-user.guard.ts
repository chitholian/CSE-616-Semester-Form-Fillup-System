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
import {AuthService} from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AdminUserGuard implements CanActivate, CanActivateChild, CanLoad {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log(state.url);
    switch (state.url) {
      case '/dept-chairman':
        if (this.auth.user && this.auth.user.type == 'chairman')
          return true;
        this.router.navigate(['/login/admin']);
        return false;
      case '/dept-office':
        if (this.auth.user && this.auth.user.type == 'office')
          return true;
        this.router.navigate(['/login/admin']);
        return false;
      case '/bank':
        if (this.auth.user && this.auth.user.type == 'bank')
          return true;
        this.router.navigate(['/login/admin']);
        return false;
      case '/accounts':
        if (this.auth.user && this.auth.user.type == 'accounts')
          return true;
        this.router.navigate(['/login/admin']);
        return false;
      case '/hall-provost':
        if (this.auth.user && this.auth.user.type == 'provost')
          return true;
        this.router.navigate(['/login/admin']);
        return false;
    }
    return true;
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
