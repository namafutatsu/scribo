import { Injectable } from '@angular/core';
import { Http, RequestOptions, ResponseContentType } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthService } from './auth.service';
import { Config } from '../shared/config/env.config';
import { Project } from '../shared/models';

import 'rxjs/add/operator/toPromise';

const saveAs = require('file-saver');

@Injectable()
export class ProjectService {
  private urlProject = `${Config.API}/api/Project`;

  constructor(private http: Http, private httpClient: HttpClient, public auth: AuthService) { }

  getProjects(): Promise<Project[]> {
    const url = `${this.urlProject}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + this.auth.token);

    // const headerSettings: {[name: string]: string | string[]; } = {};
    // headerSettings['Authorization'] = 'Bearer ' + this.auth.token;
    // headerSettings['Content-Type'] = 'application/json';
    // const newHeader = new HttpHeaders(headerSettings);
    return this.httpClient.get(url + '/GetAll', {headers})
      .toPromise()
      .then(response => response as Project[])
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
    const url = `${this.urlProject}/${project.Id}`;
    return this.http
      .put(url, JSON.stringify(project), this.auth.putOptions)
      .toPromise()
      .then(() => project)
      .catch(this.handleError);
  }

  insert(project: Project): Promise<Project> {
    const url = `${this.urlProject}`;
    return this.http
      .post(url, JSON.stringify(project), this.auth.putOptions)
      .toPromise()
      .then(() => project)
      .catch(this.handleError);
  }

  export(project: Project): Promise<Project> {
    const url = `${Config.API}/api/export/${project.Id}`;
    const options = new RequestOptions({
      headers: this.auth.header,
      responseType: ResponseContentType.Blob
    });
    return this.http.post(url, {}, options)
      .toPromise()
      .then((response: any) => {
        const blob = new Blob([response.blob()], { type: 'application/zip' });
        const filename = project.key + '.zip';
        saveAs(blob, filename);
      }
    ).catch(this.handleError);
  }

  handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
