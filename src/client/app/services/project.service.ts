import { Injectable } from '@angular/core';
import { Http, RequestOptions, ResponseContentType } from '@angular/http';

import { AuthService } from './auth.service';
import { Config } from '../shared/config/env.config';
import { Project } from '../shared/models';

import 'rxjs/add/operator/toPromise';

const saveAs = require('file-saver');

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

  insert(project: Project): Promise<Project> {
    const url = `${this.urlProject}`;
    return this.http
      .post(url, JSON.stringify(project), this.auth.putOptions)
      .toPromise()
      .then(() => project)
      .catch(this.handleError);
  }

  export(project: Project): Promise<Project> {
    const url = `${Config.API}/api/export/${project._id}`;
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
