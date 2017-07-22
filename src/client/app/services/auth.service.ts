import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Headers, Http, RequestOptions } from '@angular/http';

import { JwtHelper } from 'angular2-jwt';

import { UserService } from './user.service';
import { User } from '../shared/models';

@Injectable()
export class AuthService {
  loggedIn = false;
  isAdmin = false;
  user: User;
  token: string;
  options: RequestOptions;
  putOptions: RequestOptions;
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(private userService: UserService,
              private router: Router) {
    this.token = localStorage.getItem('token');
    if (this.token) {
      const decodedUser = this.decodeUserFromToken(this.token);
      this.setUser(decodedUser);
      this.setHeaders();
    }
  }

  login(credentials: any) {
    return this.userService.login(credentials).map(res => res.json()).map(
      res => {
        this.token = res.token;
        this.setHeaders();
        localStorage.setItem('token', res.token);
        const decodedUser = this.decodeUserFromToken(res.token);
        this.setUser(decodedUser);
        return this.loggedIn;
      }
    );
  }

  setHeaders() {
    let header = new Headers({ 'Authorization': 'Bearer ' + this.token });
    this.options = new RequestOptions({ headers: header });
    let putHeader = new Headers({ 'Authorization': 'Bearer ' + this.token, 'Content-Type': 'application/json' });
    this.putOptions = new RequestOptions({ headers: putHeader });
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedIn = false;
    this.isAdmin = false;
    this.user = null;
    this.router.navigate(['/']);
  }

  decodeUserFromToken(token: any) {
    return this.jwtHelper.decodeToken(token).user;
  }

  setUser(decodedUser: any) {
    this.loggedIn = true;
    this.user = new User();
    this.user._id = decodedUser._id;
    this.user.username = decodedUser.username;
/*     decodedUser.role === 'admin' ? this.isAdmin = true : this.isAdmin = false;
    delete decodedUser.role; */
  }

}
