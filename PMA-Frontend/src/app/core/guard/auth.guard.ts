import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";

import { AuthService } from "../service/auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  if (this.authService.currentUserValue) {
   // console.log(this.authService.currentUserValue);

      const userRole = this.authService.currentUserValue.roles;
     // console.log(userRole);

      if (route.data.role && route.data.role.indexOf(userRole[0]) === -1) {
        this.authService.logout()
        return false;
      }
      return true;
    }

    this.authService.logout()
    return false;
  }
}
