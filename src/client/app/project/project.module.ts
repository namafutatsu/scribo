import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { HotkeyModule } from 'angular2-hotkeys';

import { ActionbarModule } from './actionbar/actionbar.module';
import { EditorModule } from './editor/editor.module';
import { ExplorerModule } from './explorer/explorer.module';
import { ExporterComponent } from './exporter/exporter.component';
import { LoginModule } from '../login/login.module';
import { ProjectComponent } from './project.component';
import { ProjectRoutingModule } from './project-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    // FormsModule,
    // ReactiveFormsModule,
    ProjectRoutingModule,
    EditorModule,
    ExplorerModule,
    ActionbarModule,
    SharedModule,
    LoginModule,
    HotkeyModule,
    BootstrapModalModule
  ],
  entryComponents: [
    ExporterComponent
  ],
  declarations: [
    ExporterComponent,
    ProjectComponent
  ],
  exports: [ProjectComponent]
})
export class ProjectModule { }
