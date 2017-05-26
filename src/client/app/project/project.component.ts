import 'rxjs/add/operator/switchMap';
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';

import { Project }                from '../shared/project/project';
import { Sfile }                from '../shared/project/project';
import { ProjectService }         from '../shared/project/project.service';

import { FroalaEditorModule, FroalaViewModule } from 'angular2-froala-wysiwyg';
import { TreeModule } from 'angular-tree-component';

@Component({
  moduleId: module.id,
  selector: 'sd-project',
  templateUrl: 'project.component.html',
  styleUrls: ['project.component.css']
})
export class ProjectComponent implements OnInit {
  project: Project;
  /*sfiles: Sfile[] = [];*/
  selectedSfile: Sfile;

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

  select(sfile: Sfile): void {
    this.selectedSfile = sfile;
  }

  public options: Object = {
    charCounterCount: true,
    toolbarButtons: ['bold', 'italic', 'underline', 'specialCharacters', 'paragraphFormat','quote','align','print','undo','redo','alert'],
    toolbarButtonsXS: ['bold', 'italic', 'underline', 'specialCharacters', 'paragraphFormat','quote','align','print','undo','redo','alert'],
    toolbarButtonsSM: ['bold', 'italic', 'underline', 'specialCharacters', 'paragraphFormat','quote','align','print','undo','redo','alert'],
    toolbarButtonsMD: ['bold', 'italic', 'underline', 'specialCharacters', 'paragraphFormat','quote','align','print','undo','redo','alert']
  };

    nodes = [
    {
      id: 1,
      name: 'root1',
      children: [
        { id: 2, name: 'child1' },
        { id: 3, name: 'child2' }
      ]
    },
    {
      id: 4,
      name: 'root2',
      children: [
        { id: 5, name: 'child2.1' },
        {
          id: 6,
          name: 'child2.2',
          children: [
            { id: 7, name: 'subsub' }
          ]
        }
      ]
    }
  ];
}
