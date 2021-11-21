import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Subscription} from "rxjs";
import {UserService} from "./user-service";

@Injectable({
  providedIn: 'root'
})
export class AuthentGuardService implements CanActivate{

  currentUserType = 0;
  userSuscribe: Subscription;

  constructor(private userService: UserService,
              private router: Router) {
    this.userSuscribe = this.userService.userSubject.subscribe(
      (user) => {
        this.currentUserType = user;
      }
    );
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.currentUserType !== 0) {
      return true;
    } else {
      this.router.navigate(['/auth']);
    }
    return false;
  }
}
