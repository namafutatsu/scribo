import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxSmartModalModule } from 'ngx-smart-modal';
import { HotkeyModule } from 'angular2-hotkeys';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { ActionbarModule } from './actionbar/actionbar.module';
import { EditorModule } from './editor/editor.module';
import { ExplorerModule } from './explorer/explorer.module';
import { ExporterModule } from './exporter/exporter.module';
import { LoginModule } from '../login/login.module';
import { ProjectComponent } from './project.component';
import { ProjectRoutingModule } from './project-routing.module';
import { SharedModule } from '../shared/shared.module';
// import { AutofocusDirective } from '../shared/directives/autofocus';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProjectRoutingModule,
    EditorModule,
    ExplorerModule,
    ActionbarModule,
    ExporterModule,
    SharedModule,
    LoginModule,
    HotkeyModule,
    NgxSmartModalModule,
    MatSidenavModule,
    // MatButtonModule,
    // ButtonModule,
    DialogModule
  ],
  entryComponents: [
  ],
  declarations: [
    ProjectComponent,
    // AutofocusDirective
  ],
  exports: [ProjectComponent]
})
export class ProjectModule { }
