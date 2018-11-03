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
  // showActionBar = false;
  showPanel = false;
  namingNode: STreeNode;
  namingParent: STreeNode;
  namingInput: string;
  namingMessage: string;
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
        // this.showActionBar = true;
        this.showPanel = true;
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

  onRenaming(args: any) {
    this.namingMessage = null;
    this.namingNode = args.node;
    this.namingParent = args.parent;
    this.namingInput = this.namingNode.label;
    setTimeout (() => {const element: HTMLInputElement = this.nameInput.nativeElement;
      element.select();
    }, 100);
  }

  rename() {
    for (const i in this.namingParent.children) {
      const c = this.namingParent.children[i];
      if (c !== this.namingNode && c.label === this.namingInput) {
        this.namingMessage = 'Another element with the same name already exists';
        return;
      }
    }
    this.namingNode.label = this.namingInput;
    this.namingNode.Path = this.namingParent.Path + '/' + this.namingInput;
    this.namingNode = null;
  }

  onRenameInpuKey(event: any) {
    if (event.keyCode === 13) {
      this.rename();
    } else if (event.keyCode === 27) {
      this.namingNode = null;
    }
  }
}
