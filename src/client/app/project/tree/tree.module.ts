import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ElasticInputModule } from 'angular2-elastic-input';
import { TreeModule } from 'primeng/tree';
import { ContextMenuModule } from 'primeng/contextmenu';

import { TreeComponent } from './tree.component';

@NgModule({
  imports: [
    ContextMenuModule,
    TreeModule,
    FormsModule,
    ElasticInputModule
  ],
  declarations: [TreeComponent],
  exports: [TreeComponent]
})
export class TreeViewModule { }
