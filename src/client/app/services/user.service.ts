import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Config } from '../shared/config/env.config';
// import { User } from '../models';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserService {
  private url = `${Config.API}/api/User/`;
  // private headers = new Headers({'Content-Type': 'application/json'});
  // private options = new RequestOptions({ headers: this.headers });

  constructor(private httpClient: HttpClient) { }

  register(user: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post(`${this.url}SignUp`, user, { headers });
  }

  login(credentials: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post(`${this.url}SignIn`, credentials, { headers });
  }
}
