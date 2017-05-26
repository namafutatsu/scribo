import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from './project.component';
import { ProjectRoutingModule } from './project-routing.module';
import { FroalaEditorModule, FroalaViewModule } from 'angular2-froala-wysiwyg';
import { TreeModule } from 'angular-tree-component';
@NgModule({
  imports: [TreeModule,CommonModule, ProjectRoutingModule, FroalaEditorModule.forRoot(), FroalaViewModule.forRoot()],
  declarations: [ProjectComponent],
  exports: [ProjectComponent]
})
export class ProjectModule { }
