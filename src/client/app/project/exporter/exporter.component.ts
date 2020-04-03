import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { Project, Sitem, Sfile, Sfolder } from '../../shared/models';

export interface ConfirmModel {
  title:string;
  message:string;
}

@Component({
  moduleId: module.id,
  selector: 'sd-exporter',
  templateUrl: 'exporter.component.html',
  styleUrls: ['exporter.component.css']
})
export class ExporterComponent extends DialogComponent<ConfirmModel, boolean> implements ConfirmModel, OnInit {
  exporterForm: FormGroup;
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
  public selectedFormat: string = 'html';

  @Input() project: Project;

  constructor(dialogService: DialogService) {
    super(dialogService);
  }

  ngOnInit(): void {
  }

  setFormat(format: string) {
    this.selectedFormat = format;
  }

  confirm() {
    this.result = true;
    this.close();
  }
}
