import { NgModule } from '@angular/core';

import { TreeViewModule } from '../tree/tree.module';
import { ExplorerComponent } from './explorer.component';

@NgModule({
  imports: [
    TreeViewModule
  ],
  declarations: [ExplorerComponent],
  exports: [ExplorerComponent]
})
export class ExplorerModule { }
