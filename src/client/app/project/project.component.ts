import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location, NgClass } from '@angular/common';

import { HotkeyModule, HotkeysService, Hotkey } from 'angular2-hotkeys';
import { DialogService } from 'ng2-bootstrap-modal';

import { ExporterComponent } from './exporter/exporter.component';
import { AuthService } from '../services/auth.service';
import { Project, Note, Sitem, Sfile, Sfolder } from '../shared/models';
import { ProjectService } from '../services/project.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { Observable } from 'rxjs/Observable';

interface CssClass { name: string; value: string; }

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
  showExplorer = true;
  initShowNotes = false;
  lockNotes = false;
  showNotes = false;
  cssColumns = [
    { name: 'explorer', value: 'explorer-ab' },
    { name: 'editor', value: 'editor-ab' },
    { name: 'notes', value: 'notes-ab' }
  ];

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private location: Location,
    public auth: AuthService,
    public toast: ToastComponent,
    private hotkeysService: HotkeysService,
    private dialogService: DialogService
  ) {
      this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      event.preventDefault();
      this.onSaving();
      return false;
    }));
  }

  ngOnInit(): void {
    this.updateClasses();
    if (this.auth.loggedIn) {
      this.route.params
      .switchMap((params: Params) => this.projectService.getProject(params['key']))
      .subscribe(project => {
        this.project = project;
        this.isLoading = false;
      });
    }
  }

  onExplorerToggling(): void {
    this.showExplorer = !this.showExplorer;
    this.updateClasses();
  }

  onNotesToggling(): void {
    if (this.lockNotes)
      return;
    if (this.showNotes) {
      this.showNotes = false;
      this.lockNotes = true;
      setTimeout(() => {
        this.initShowNotes = false;
        this.lockNotes = false;
      }, 500);
    } else {
      this.initShowNotes = true;
      this.showNotes = true;
    }
    // this.initShowNotes = true;
    // this.showNotes = !this.showNotes;
    this.updateClasses();
  }

  updateClasses() {
    this.cssColumns.forEach(column => {
      column.value = column.name + '-' +
        (this.showExplorer === true ? '0' : '') + '1' +
        (this.showNotes === true ? '2' : '');
    });
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

  onExporting(): void {
    if (this.project !== undefined) {
      let disposable = this.dialogService.addDialog(ExporterComponent)//, {}, { backdropColor: '#24292f' })
      .subscribe((isConfirmed) => {
          if(isConfirmed) {
            this.projectService.export(this.project);
          }
      });
    }
  }
}
