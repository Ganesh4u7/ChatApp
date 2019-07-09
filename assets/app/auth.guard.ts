import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {LoginService} from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private service: LoginService){

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.service.isLoggedStatus;
  }
}
