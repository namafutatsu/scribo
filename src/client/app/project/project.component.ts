import 'rxjs/add/operator/switchMap';
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';

import { Project }                from '../shared/project/project';
import { Sitem, Sfile, Sfolder }                from '../shared/project/project';
import { ProjectService }         from '../shared/project/project.service';

import { FroalaEditorModule, FroalaViewModule } from 'angular2-froala-wysiwyg';
// declare var $ :any;

@Component({
  moduleId: module.id,
  selector: 'sd-project',
  templateUrl: 'project.component.html',
  styleUrls: ['project.component.css']
})
export class ProjectComponent implements OnInit {
  project: Project;
  selectedItem: Sitem;
  selectedFile: Sfile;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.params
    .switchMap((params: Params) => this.projectService.getProject(+params['id']))
    .subscribe(project => this.project = project);
  }

  select(item: Sitem): void {
    this.selectedItem = item;
    if (item.discriminator === 1) {
      this.selectedFile = item as Sfile;
    } else {
      this.selectedFile = null;
      const folder = item as Sfolder;
      folder.open = !folder.open;
    }
  }

  update() {
    if (this.project !== undefined)
      this.projectService.update(this.project);
  }

  commit() {
    if (this.project !== undefined)
      this.projectService.update(this.project);
  }
  
  editorButtons = ['bold', 'italic', 'underline', 'specialCharacters', 'paragraphFormat','align','print','fullscreen','undo','redo','alert']; 
  public editorOptions: Object = {
    charCounterCount: true,
    theme:'scribo',

    tooltips: false,
    // height:'750',
    inlineMode:false, 
    pluginsEnabled: [ 
      'align', 
      // 'charCounter', 
      // 'codeBeautifier', 
      // 'codeView', 
      // 'colors', 
      'draggable', 
      // 'emoticons', 
      'entities', 
      // 'file', 
      // 'fontFamily', 
      'fontSize', 
      'fullscreen', 
      // 'image', 
      // 'imageManager', 
      'inlineStyle', 
      'lineBreaker', 
      // 'link', 
      'lists', 
      'paragraphFormat', 
      'paragraphStyle', 
      // 'quickInsert', 
      // 'quote', 
      // 'save', 
      // 'table', 
      // 'url', 
      // 'video', 
      'wordPaste',
      'specialCharacters', 
      'wordPaste', 
      'print'  
    ],

    toolbarButtons: this.editorButtons, 
    toolbarButtonsSM: this.editorButtons, 
    toolbarButtonsMD: this.editorButtons, 
    toolbarButtonsXS: this.editorButtons, 
  };
}
