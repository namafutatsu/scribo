import 'rxjs/add/operator/switchMap';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';

import { HotkeysService, Hotkey } from 'angular2-hotkeys';
// import { FormGroup } from '@angular/material';

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
  toggle = true;
  explorerClasses = ['show', 'hide'];
  explorerClass = 0;
  editorClasses = ['shrink', 'expand'];
  editorClass = 0;
  options: FormGroup;
  showActionBar = true;
  showPanel = false;

  constructor(
    public projectService: ProjectService,
    private route: ActivatedRoute,
    private location: Location,
    public auth: AuthService,
    public toast: ToastComponent,
    private hotkeysService: HotkeysService,
    private fb: FormBuilder
  ) {
      this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      event.preventDefault();
      this.onSaving();
      return false; // Prevent bubbling
    }));
    this.options = fb.group({
      bottom: 0,
      top: 48
    });
  }

  ngOnInit(): void {
    if (this.auth.loggedIn) {
      this.route.params
      .switchMap((params: Params) => this.projectService.getProject(params['key']))
      .subscribe(project => {
        this.project = project;
        this.isLoading = false;
        this.showPanel = true;
        this.showActionBar = true;
      });
    }
  }

  onActionbarToggling(): void {
    this.explorerClass = (this.explorerClass + 1) % 2;
    this.editorClass = (this.editorClass + 1) % 2;
    this.toggle = !this.toggle;
    this.showPanel = !this.showPanel;
  }

  onFolderSelected(folder: Sfolder) {
    this.file = null;
  }

  onFileSelected(file: Sfile) {
    this.file = file;
  }

  onSaving(): void {
    // if (this.project !== undefined) {
    //   this.projectService.update(this.project).then(res => {
    //     this.toast.setMessage('Saved', 'success');
    //   });
    // }
  }

  clickNote(note: Note): void {
    note.status = (note.status + 2) % 3 - 1;
  }
}
