import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HotkeyModule } from 'angular2-hotkeys';

import { ProjectComponent } from './project.component';
import { ProjectRoutingModule } from './project-routing.module';
import { EditorModule } from './editor/editor.module';
import { ExplorerModule } from './explorer/explorer.module';
import { SharedModule } from '../shared/shared.module';
import { LoginModule } from '../login/login.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ProjectRoutingModule,
    EditorModule,
    ExplorerModule,
    SharedModule,
    LoginModule,
    HotkeyModule
  ],
  declarations: [ProjectComponent],
  exports: [ProjectComponent]
})
export class ProjectModule { }
