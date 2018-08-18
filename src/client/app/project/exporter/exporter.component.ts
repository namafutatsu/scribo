import { Component, Input } from '@angular/core';

import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { FormGroup } from '@angular/forms';

import { Project } from '../../shared/models';
import { ProjectService } from '../../services/project.service';

export interface ConfirmModel {
  title: string;
  message: string;
}

@Component({
  moduleId: module.id,
  selector: 'sd-exporter',
  templateUrl: 'exporter.component.html',
  styleUrls: ['exporter.component.css']
})

export class ExporterComponent {
  @Input() project: Project;
  @Input() projectService: ProjectService;

  exporterForm: FormGroup;
  modal: NgxSmartModalComponent;
  title = 'Download';
  message = 'Export your project';
  public formats: string[] = [
    'html',
    'md',
    'doc',
    'pdf',
    'epub',
    'mobi'
  ];
  public contents: string[] = [
    'file',
    'folder',
    'project'
  ];
  public selectedFormat = 'html';

  constructor(public ngxSmartModalService: NgxSmartModalService) {
  }

  open() {
    this.ngxSmartModalService.getModal('modal').open();
  }

  setFormat(format: string) {
    this.selectedFormat = format;
  }

  confirm() {
    this.projectService.export(this.project).then(
      () => this.ngxSmartModalService.getModal('modal').close()
    );
  }
}
