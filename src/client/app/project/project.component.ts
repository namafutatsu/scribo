import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { HotkeysService, Hotkey } from 'angular2-hotkeys';

import { AuthService } from '../services/auth.service';
import { STreeNode } from '../shared/models';
import { ProjectService } from '../services/project.service';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  moduleId: module.id,
  selector: 'sd-project',
  templateUrl: 'project.component.html',
  styleUrls: ['project.component.css']
})
export class ProjectComponent implements OnInit {
  project: STreeNode[];
  file: STreeNode;
  isLoading = true;
  showActionBar = true;
  showPanel = false;

  constructor(
    public projectService: ProjectService,
    private route: ActivatedRoute,
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
      .switchMap((params: Params) => this.projectService.get(params['key']))
      .subscribe(project => {
        this.project = project;
        this.isLoading = false;
        this.showPanel = true;
        this.showActionBar = true;
      });
    }
  }

  onActionbarToggling(): void {
    this.showPanel = !this.showPanel;
  }

  onFolderSelected(folder: STreeNode) {
    this.file = null;
  }

  onFileSelected(file: STreeNode) {
    this.file = file;
  }

  onSaving(): void {
    // if (this.project !== undefined) {
    //   this.projectService.update(this.project).then(res => {
    //     this.toast.setMessage('Saved', 'success');
    //   });
    // }
  }

  // clickNote(note: Note): void {
  //   note.status = (note.status + 2) % 3 - 1;
  // }
}
