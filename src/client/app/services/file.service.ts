import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthedService } from './auth.service';

@Injectable()
export class FileService extends AuthedService {
  protected controller = 'File';

  get(projectName: string, key: string): Observable<string> {
    return this._post<string>('Read', { Project: projectName, Key: key, Read: true });
  }

  // getAll(projectName: string): Observable<{ [key: string]: string; }> {
  //   return this._post<{ [key: string]: string; }>('ReadAll', { Project: projectName });
  // }
}
