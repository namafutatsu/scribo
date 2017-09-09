import { NgModule }               from '@angular/core';

import { FroalaEditorModule, FroalaViewModule } from 'angular2-froala-wysiwyg';

import { EditorComponent }        from './editor.component';

@NgModule({
  imports: [
    FroalaEditorModule,
    FroalaViewModule,
  ],
  declarations: [EditorComponent],
  exports: [EditorComponent]
})
export class EditorModule { }
