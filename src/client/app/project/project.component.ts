import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { HotkeysService, Hotkey } from 'angular2-hotkeys';

import { AuthService } from '../services/auth.service';
import { ProjectService } from '../services/project.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { STreeNode } from '../shared/models';

@Component({
  moduleId: module.id,
  selector: 'sd-project',
  templateUrl: 'project.component.html',
  styleUrls: ['project.component.css']
})
export class ProjectComponent implements OnInit {
  project: STreeNode;
  file: STreeNode;
  isLoading = true;
  showActionBar = true;
  showPanel = false;
  renamingNode: STreeNode;
  renamingInput: string;
  @ViewChild('nameInput') private nameInput: ElementRef;

  constructor(
    public auth: AuthService,
    public projectService: ProjectService,
    public toast: ToastComponent,
    private hotkeysService: HotkeysService,
    private route: ActivatedRoute
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

  onRenaming(node: STreeNode) {
    this.renamingInput = node.label;
    this.renamingNode = node;
    setTimeout (() => {const element: HTMLInputElement = this.nameInput.nativeElement;
      element.select();
    }, 100);
  }

  // clickNote(note: Note): void {
  //   note.status = (note.status + 2) % 3 - 1;
  // }
}
