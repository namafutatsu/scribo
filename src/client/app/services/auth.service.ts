import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Headers, RequestOptions } from '@angular/http';

import { JwtHelperService } from '@auth0/angular-jwt';

import { UserService } from './user.service';
import { User } from '../shared/models';

@Injectable()
export class AuthService {
  loggedIn = false;
  isAdmin = false;
  user: User;
  token: string;
  header: Headers;
  options: RequestOptions;
  putOptions: RequestOptions;
  jwtHelperService: JwtHelperService = new JwtHelperService();

  constructor(private userService: UserService, private router: Router) {
    this.token = localStorage.getItem('token');
    if (this.token) {
      const decodedUser = this.decodeUserFromToken(this.token);
      this.setUser(decodedUser);
      this.setHeaders();
    }
  }

  login(credentials: any) {
    return this.userService.login(credentials).map(
      (res: any) => {
        this.token = res.Token;
        this.setHeaders();
        localStorage.setItem('token', res.Token);
        const decodedUser = this.decodeUserFromToken(res.Token);
        this.setUser(decodedUser);
        return this.loggedIn;
      }
    );
  }

  setHeaders() {
    this.header = new Headers({ 'Authorization': 'Bearer ' + this.token });
    this.options = new RequestOptions({ headers: this.header });
    const putHeader = new Headers({ 'Authorization': 'Bearer ' + this.token, 'Content-Type': 'application/json' });
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
    return this.jwtHelperService.decodeToken(token);
  }

  setUser(decodedUser: any) {
    this.loggedIn = true;
    this.user = new User();
    this.user.Id = decodedUser.nameid;
    this.user.Username = decodedUser.unique_name;
    this.user.Mail = decodedUser.email;
/*     decodedUser.role === 'admin' ? this.isAdmin = true : this.isAdmin = false;
    delete decodedUser.role; */
  }

}
