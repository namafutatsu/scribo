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

  get(name: string): Observable<STreeNode> {
    return this._post<STreeNode>('Get', { Name: name, Read: false });
  }

  read(name: string): Observable<STreeNode> {
    return this._post<STreeNode>('Get', { Name: name, Read: true });
  }

  update(project: STreeNode): Observable<STreeNode> {
    const copy = this.copy(project);
    return this._post<STreeNode>('Put', copy);
  }

  copy(item: STreeNode): STreeNode {
    const copy = new STreeNode();
    copy.label = item.label;
    copy.Index = item.Index;
    copy.Key = item.Key;
    copy.IsLeaf = item.IsLeaf;
    copy.ParentKey = item.ParentKey;
    copy.Path = item.Path;
    if (!item.IsLeaf) {
      copy.children = [];
      for (const i in item.children) {
        const child = item.children[i] as STreeNode;
        copy.children.push(this.copy(child));
      }
      // item.children.forEach(o => copy.children.push(this.copy(o as STreeNode)));
    }
    return copy;
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
