import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthedService } from './auth.service';
import { Project, STreeNode } from '../shared/models';

@Injectable()
export class ProjectService extends AuthedService {
  protected controller = 'Project';

  getAll(): Observable<Project[]> {
    return this._get<Project[]>('GetAll');
  }

  get(key: string): Observable<STreeNode[]> {
    return this._post<STreeNode[]>('Get', { Name: key, Read: true });
  }

  post(project: Project): Observable<Project> {
    return this._post<Project>('Post', project);
  }

  export(project: Project): Observable<Blob> {
    return this._getBlob<void>('Export/' + project.Name)
    .pipe(
      map((response: any) => new Blob([response.blob()], { type: 'application/zip' }))
    );
  }
}
