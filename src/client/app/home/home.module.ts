import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { LoginModule } from '../login/login.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    HomeRoutingModule,
    SharedModule,
    LoginModule
  ],
  declarations: [HomeComponent],
  exports: [HomeComponent]
})
export class HomeModule { }
