import { NgModule }               from '@angular/core';

import { TreeModule } from 'ng2-tree';

import { ExplorerComponent }        from './explorer.component';

@NgModule({
  imports: [
    TreeModule,
  ],
  declarations: [ExplorerComponent],
  exports: [ExplorerComponent]
})
export class ExplorerModule { }
