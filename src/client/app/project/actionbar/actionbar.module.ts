import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActionbarComponent } from './actionbar.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule
  ],
  declarations: [ActionbarComponent],
  exports: [ActionbarComponent]
})
export class ActionbarModule { }
