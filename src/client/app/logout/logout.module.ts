import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LogoutComponent } from './logout.component';
import { LogoutRoutingModule } from './logout-routing.module';

@NgModule({
  imports: [
      CommonModule,
      LogoutRoutingModule,
      FormsModule,
      ReactiveFormsModule,
    ],
  declarations: [LogoutComponent],
  exports: [LogoutComponent]
})
export class LogoutModule { }
