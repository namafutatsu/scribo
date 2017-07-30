import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowhideComponent } from './showhide.component';

@NgModule({
  imports: [CommonModule
  ],
  declarations: [ShowhideComponent],
  exports: [ShowhideComponent]
})
export class ShowhideModule { }
