import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Config } from '../shared/config/env.config';
// import { User } from '../models';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserService {
  private url = `${Config.API}/api/user`;
  private headers = new Headers({'Content-Type': 'application/json'});
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  register(user: any): Observable<any> {
    return this.http.post(this.url, JSON.stringify(user), this.options);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${Config.API}/api/login`, JSON.stringify(credentials), this.options);
  }
}
