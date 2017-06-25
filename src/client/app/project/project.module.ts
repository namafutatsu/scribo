import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FroalaEditorModule, FroalaViewModule } from 'angular2-froala-wysiwyg';
import { TreeModule } from 'ng2-tree';

import { ProjectComponent } from './project.component';
import { ProjectRoutingModule } from './project-routing.module';
import { EditorModule } from './editor/editor.module';
import { ExplorerModule } from './explorer/explorer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ProjectRoutingModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    TreeModule,
    EditorModule,
    ExplorerModule
  ],
  declarations: [ProjectComponent],
  exports: [ProjectComponent]
})
export class ProjectModule { }
