import { NgModule } from '@angular/core';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { EditorComponent } from './editor.component';

@NgModule({
  imports: [
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
  ],
  declarations: [EditorComponent],
  exports: [EditorComponent]
})
export class EditorModule { }
