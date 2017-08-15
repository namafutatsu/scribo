import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Project, Sitem, Sfile, Sfolder } from '../../shared/models';

@Component({
  moduleId: module.id,
  selector: 'sd-export',
  templateUrl: 'export.component.html',
  styleUrls: ['export.component.css']
})
export class ExportComponent implements OnInit {
  @Input() project: Project;

  ngOnInit(): void {
  }

}
