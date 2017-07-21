import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import { Config } from '../shared/config/env.config';
import { AuthService } from './auth.service';
import { Project } from '../shared/models';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class ProjectService {
  private urlProject = `${Config.API}/api/project`;

  constructor(private http: Http, public auth: AuthService) { }

  getProjects(): Promise<Project[]> {
    const url = `${this.urlProject}s`;
    return this.http.get(url, this.auth.options)
      .toPromise()
      .then(response => response.json() as Project[])
      .catch(this.handleError);
  }

  getProject(key: string): Promise<Project> {
    const url = `${this.urlProject}/${key}`;
    return this.http.get(url, this.auth.options)
      .toPromise()
      .then(response => response.json() as Project)
      .catch(this.handleError);
  }

  update(project: Project): Promise<Project> {
    const url = `${this.urlProject}/${project._id}`;
    return this.http
      .put(url, JSON.stringify(project), this.auth.putOptions)
      .toPromise()
      .then(() => project)
      .catch(this.handleError);
  }

  handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
