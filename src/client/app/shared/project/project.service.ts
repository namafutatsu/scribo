import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Config } from '../config/env.config';
import { Project } from './project';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class ProjectService {
  private projectsUrl = `${Config.API}/api/projects`;

  constructor(private http: Http) { }

  getProjects(): Promise<Project[]> {
    return this.http.get(this.projectsUrl)
      .toPromise()
      .then(response => response.json() as Project[])
      .catch(this.handleError);
  }

  getProject(key: string): Promise<Project> {
    const url = `${this.projectsUrl}/${key}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json() as Project)
      .catch(this.handleError);
  }

  private headers = new Headers({'Content-Type': 'application/json'});
  update(project: Project): Promise<Project> {
    const url = `${this.projectsUrl}/put`;
    return this.http
      .put(url, JSON.stringify(project), {headers: this.headers})
      .toPromise()
      .then(() => project)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
