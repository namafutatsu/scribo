import { NgModule }               from '@angular/core';

import { ExplorerComponent }        from './explorer.component';
import { TreeviewModule } from './treeview/treeview.module';

@NgModule({
  imports: [
    TreeviewModule
  ],
  declarations: [ExplorerComponent],
  exports: [ExplorerComponent]
})
export class ExplorerModule { }
