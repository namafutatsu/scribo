import { NgModule } from '@angular/core';

import { TreeModule } from 'ng2-tree';

import { TreeviewComponent } from './treeview.component';

@NgModule({
  imports: [TreeModule],
  declarations: [TreeviewComponent],
  exports: [TreeviewComponent]
})
export class TreeviewModule { }
