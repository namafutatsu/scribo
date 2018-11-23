import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { JwtHelperService } from '@auth0/angular-jwt';

import { UserService } from './user.service';
import { User } from '../shared/models';
import { Config } from '../shared/config/env.config';

@Injectable()
export class AuthService {
  public headers: HttpHeaders;
  public disconnected = new BehaviorSubject<boolean>(false);
  loggedIn = false;
  // isAdmin = false;
  user: User;
  token: string;
  jwtHelperService: JwtHelperService = new JwtHelperService();

  constructor(
    private httpClient: HttpClient,
    private userService: UserService,
    private router: Router) {
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.setHeaders();
      const decodedUser = this.decodeUserFromToken(this.token);
      this.setUser(decodedUser);
    }
  }

  login(credentials: any) {
    return this.userService.login(credentials).map(
      (res: any) => {
        this.disconnected.next(false);
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
    this.headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.token);
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedIn = false;
    // this.isAdmin = false;
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
    // decodedUser.role === 'admin' ? this.isAdmin = true : this.isAdmin = false;
    // delete decodedUser.role;
  }

  get<T>(operation = 'operation', url: string): Observable<T> {
    return this.httpClient.get<T>(url, { headers: this.headers })
    .pipe(
      tap(o => this.disconnected.next(false)),
      catchError(this.handleError(operation, null))
    );
  }

  getBlob<T>(operation = 'operation', url: string): Observable<T> {
    const options = {
      headers: this.headers,
      observe: 'response' as 'body',
      responseType: 'blob' as 'json'
    };
    return this.httpClient.get<T>(url, options)
    .pipe(
      tap(o => this.disconnected.next(false)),
      catchError(this.handleError(operation, null))
    );
  }

  post<T>(operation = 'operation', url: string, model: any): Observable<T> {
    model.Time = Date.now();
    return this.httpClient.post<T>(url, model, { headers: this.headers })
    .pipe(
      tap(o => this.disconnected.next(false)),
      catchError(this.handleError(operation, null))
    );
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.disconnected.next(true);
      console.error(error);
      if (error.status === 401) {
        this.logout();
      }
      // this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

@Injectable()
export abstract class AuthedService {
  protected abstract controller: string;
  private url = `${Config.API}/api`;
  constructor(
    protected auth: AuthService
  ) {}

  protected _get<T>(action: string): Observable<T> {
    return this.auth.get<T>(this.controller + '.' + action, `${this.url}/${this.controller}/${action}`);
  }

  protected _getBlob<T>(action: string): Observable<T> {
    return this.auth.getBlob<T>(this.controller + '.' + action, `${this.url}/${this.controller}/${action}`);
  }

  protected _post<T>(action: string, model: any): Observable<T> {
    return this.auth.post<T>(this.controller + '.' + action, `${this.url}/${this.controller}/${action}`, model);
  }
}
