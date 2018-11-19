import { NgModule } from '@angular/core';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { EditorComponent } from './editor.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    FroalaEditorModule,
    FroalaViewModule,
    SharedModule
  ],
  declarations: [EditorComponent],
  exports: [EditorComponent]
})
export class EditorModule { }
