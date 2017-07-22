import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { HotkeyModule, HotkeysService, Hotkey } from 'angular2-hotkeys';

import { AuthService } from '../services/auth.service';
import { Project, Note, Sitem, Sfile, Sfolder } from '../shared/models';
import { ProjectService } from '../services/project.service';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  moduleId: module.id,
  selector: 'sd-project',
  templateUrl: 'project.component.html',
  styleUrls: ['project.component.css']
})
export class ProjectComponent implements OnInit {
  project: Project;
  file: Sfile;
  isLoading = true;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private location: Location,
    public auth: AuthService,
    public toast: ToastComponent,
    private hotkeysService: HotkeysService
  ) {
      this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      event.preventDefault();
      this.onSaving();
      return false; // Prevent bubbling
    }));
  }

  ngOnInit(): void {
    if (this.auth.loggedIn) {
      this.route.params
      .switchMap((params: Params) => this.projectService.getProject(params['key']))
      .subscribe(project => {
        this.project = project;
        this.isLoading = false;
      });
    }
  }

  onFolderSelected(folder: Sfolder) {
    this.file = null;
  }

  onFileSelected(file: Sfile) {
    this.file = file;
  }

  onSaving(): void {
    if (this.project !== undefined) {
      this.projectService.update(this.project).then(res => {
        this.toast.setMessage('Saved', 'success');
      });
    }
  }

  clickNote(note: Note): void {
    note.status = (note.status + 2) % 3 - 1;
  }
}
