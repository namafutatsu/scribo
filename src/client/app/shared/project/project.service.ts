import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Project } from './project';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class ProjectService {
  private projectsUrl = 'api/projects';

  constructor(private http: Http) { }

  getProjects(): Promise<Project[]> {
    return this.http.get(this.projectsUrl)
      .toPromise()
      .then(response => response.json().data as Project[])
      .catch(this.handleError);
  }

  getProject(id: number): Promise<Project> {
    const url = `${this.projectsUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data as Project)
      .catch(this.handleError);
  }

  private headers = new Headers({'Content-Type': 'application/json'});
  update(project: Project): Promise<Project> {
    const url = `${this.projectsUrl}/${project.id}`;
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
