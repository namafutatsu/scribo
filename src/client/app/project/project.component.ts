import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild, ElementRef, OnChanges, HostListener } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { HotkeysService, Hotkey } from 'angular2-hotkeys';

import { AuthService } from '../services/auth.service';
import { FileService } from '../services/file.service';
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
  texts: { [key: string]: string; } = {};
  updating = false;
  uploading = false;
  uploadingTexts = new Set<string>();
  @ViewChild('nameInput') private nameInput: ElementRef;
  @ViewChild('pending') private pending: ElementRef;
  @ViewChild('warning') private warning: ElementRef;

  constructor(
    public auth: AuthService,
    public fileService: FileService,
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

  ngOnInit() {
    this.updateIcons();
    this.auth.disconnected.subscribe(o => this.updateIcons());
    if (this.auth.loggedIn) {
      this.route.params
        .switchMap((params: Params) => this.projectService.get(params['key'])).subscribe(project => {
          this.project = project;
          this.isLoading = false;
          // this.showActionBar = true;
          this.showPanel = true;
          this.projectService.read(project.label).subscribe(texts => {
            this.getTexts(texts);
          });
        });
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  public beforeunloadHandler($event: any) {
    if (this.updating || this.uploading) {
      $event.returnValue = 'Changes you made may not be saved';
    }
  }

  getTexts(folder: STreeNode) {
    if (folder.children) {
      for (const i in folder.children) {
        const child = folder.children[i] as STreeNode;
        if (child.IsLeaf) {
          this.texts[child.Key] = child.data;
        } else {
          this.getTexts(child);
        }
      }
    }
  }

  onActionbarToggling() {
    this.showPanel = !this.showPanel;
  }

  onSelecting(node: STreeNode) {
    this.save();
    if (node) {
      if (!node.IsLeaf) {
        this.file = null;
      } else {
        this.file = node;
      }
    } else {
      this.file = null;
    }
  }

  updateIcons() {
    this.pending.nativeElement.hidden = this.auth.disconnected.value || (!this.uploading && !this.updating);
    this.warning.nativeElement.hidden = !this.auth.disconnected.value;
  }

  save() {
    // this.update();
    if (this.file) {
      const key = this.file.Key;
      if (!this.uploadingTexts.has(key)) {
        this.uploadingTexts.add(key);
        this.uploading = true;
        this.updateIcons();
      }
      this.updating = true;
      this.updateIcons();
      this.uploadingTexts.forEach(o => {
        this.fileService.write(this.project.label, o, this.texts[o]).subscribe(res => {
          // this.disconnected = false;
          this.updateIcons();
          this.uploadingTexts.delete(key);
          if (this.uploadingTexts.size === 0) {
            this.uploading = false;
            this.updateIcons();
          }
        });
        // , err => {
        //   this.disconnected = true;
        //   this.updateIcons();
        // });
      });
    }
  }

  onSaving() {
    this.save();
  }

  onCreating(node: STreeNode) {
    this.texts[node.Key] = ' ';
    this.onSelecting(node);
    this.update();
  }

  onMoving(node: STreeNode) {
    this.update();
  }

  onDeleting(node: STreeNode) {
    this.update();
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
    this.update();
  }

  onRenameInpuKey(event: any) {
    if (event.keyCode === 13) {
      this.rename();
    } else if (event.keyCode === 27) {
      this.namingNode = null;
    }
  }

  update() {
    this.updating = true;
    this.updateIcons();
    this.projectService.update(this.project).subscribe(res => {
      // this.disconnected = false;
      this.updating = false;
      this.updateIcons();
    });
    // , err => {
    //   // this.disconnected = true;
    //   this.updateIcons();
    // });
  }
}
