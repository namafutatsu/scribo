import 'rxjs/add/operator/switchMap';
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';

import { Project }                from '../shared/project/project';
import { Sitem, Sfile, Sfolder }                from '../shared/project/project';
import { ProjectService }         from '../shared/project/project.service';

import { FroalaEditorModule, FroalaViewModule } from 'angular2-froala-wysiwyg';

@Component({
  moduleId: module.id,
  selector: 'sd-project',
  templateUrl: 'project.component.html',
  styleUrls: ['project.component.css']
})
export class ProjectComponent implements OnInit {
  project: Project;
  /*sfiles: Sfile[] = [];*/
  selectedItem: Sitem;
  selectedFile: Sfile;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.params
    .switchMap((params: Params) => this.projectService.getProject(params['key']))
    .subscribe(project => this.project = project);
/*    .subscribe(function(project) {
      this.project = project;
      this.sfiles = project.sitems*///.filter(s => s as Sfile !== undefined)
    /*});*/
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
  
  buttons = ['bold', 'italic', 'underline', 'specialCharacters', 'paragraphFormat','quote','align','print','fullscreen','undo','redo','alert']; 
  public options: Object = {
    charCounterCount: true,
    theme:'scribo',
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
      'quote', 
      'save', 
      // 'table', 
      // 'url', 
      // 'video', 
      'wordPaste',
      'specialCharacters', 
      'wordPaste', 
      'print'  
    ], 
    toolbarButtons: this.buttons, 
    toolbarButtonsSM: this.buttons, 
    toolbarButtonsMD: this.buttons, 
    toolbarButtonsXS: this.buttons, 
  };
}
