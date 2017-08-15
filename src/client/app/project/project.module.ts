import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HotkeyModule } from 'angular2-hotkeys';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectComponent } from './project.component';
import { ProjectRoutingModule } from './project-routing.module';
import { EditorModule } from './editor/editor.module';
import { ExplorerModule } from './explorer/explorer.module';
import { SharedModule } from '../shared/shared.module';
import { LoginModule } from '../login/login.module';
import { ActionbarModule } from './actionbar/actionbar.module';
import { ExportModule } from './export/export.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ProjectRoutingModule,
    EditorModule,
    ExplorerModule,
    ActionbarModule,
    SharedModule,
    LoginModule,
    HotkeyModule,
    ExportModule,
    BrowserAnimationsModule
  ],
  declarations: [ProjectComponent],
  exports: [ProjectComponent]
})
export class ProjectModule { }
