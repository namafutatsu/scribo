import { Injectable } from '@angular/core';
import { Http, RequestOptions, ResponseContentType } from '@angular/http';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { AuthService } from './auth.service';
import { Config } from '../shared/config/env.config';
import { Project } from '../shared/models';

import 'rxjs/add/operator/toPromise';

const saveAs = require('file-saver');

@Injectable()
export class ProjectService {
  private projectUrl = `${Config.API}/api/Project`;
  private fileUrl = `${Config.API}/api/File`;
  private directoryUrl = `${Config.API}/api/Directory`;

  constructor(
    private http: Http,
    private httpClient: HttpClient,
    public auth: AuthService) {}

  getProjects(): Promise<Project[]> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.auth.token);
    return this.httpClient.get(`${this.projectUrl}/GetAll`, { headers })
      .toPromise()
      .then(response => response as Project[])
      .catch(error => this.handleError(error, this.auth));
  }

  getProject(key: string): Promise<Project> {
    const url = `${this.projectUrl}/Get`; ///${key}
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.auth.token);
    return this.httpClient.post(url, { Name: key, Read: true }, { headers })
      .toPromise()
      .then(response => response as Project)
      .catch(error => this.handleError(error, this.auth));
  }

  // update(project: Project): Promise<Project> {
  //   const url = `${this.url}/${project.Id}`;
  //   const headers = new HttpHeaders()
  //     .set('Content-Type', 'application/json')
  //     .set('Authorization', 'Bearer ' + this.auth.token);
  //   return this.httpClient.put(url, project, { headers })
  //     .toPromise()
  //     .then(() => project)
  //     .catch(error => this.handleError(error, this.auth));
  // }

  insert(project: Project): Promise<Project> {
    const url = `${this.projectUrl}`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.auth.token);
    return this.httpClient.post(`${this.projectUrl}/Post`, project, { headers })
      .toPromise()
      .then(() => project)
      .catch(error => this.handleError(error, this.auth));
  }

  export(project: Project): Promise<Project> {
    const url = `${Config.API}/api/export/${project.Name}`;
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
    )
    .catch(error => this.handleError(error, this.auth));
  }

  handleError(error: HttpErrorResponse, auth: AuthService): Promise<any> {
    if (error.status === 401) {
      auth.logout();
    }
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
