import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HotkeyModule } from 'angular2-hotkeys';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AboutModule } from './about/about.module';
import { CreateModule } from './create/create.module';
import { ProjectsModule } from './projects/projects.module';
import { ProjectModule } from './project/project.module';
import { HomeModule } from './home/home.module';
import { RegisterModule } from './register/register.module';
import { LoginModule } from './login/login.module';
import { LogoutModule } from './logout/logout.module';
import { NotFoundModule } from './notfound/notfound.module';
import { SharedModule } from './shared/shared.module';
import { ProjectService } from './services/project.service';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    AboutModule,
    CreateModule,
    HomeModule,
    ProjectsModule,
    ProjectModule,
    RegisterModule,
    LoginModule,
    LogoutModule,
    SharedModule.forRoot(),
    HotkeyModule.forRoot(),
    NgxSmartModalModule.forRoot(),
    NotFoundModule,
    BrowserAnimationsModule,
    // FroalaEditorModule.forRoot(),
    // FroalaViewModule.forRoot()
  ],
  declarations: [AppComponent],
  providers: [
    ProjectService,
    UserService,
    AuthService,
    {
      provide: APP_BASE_HREF,
      useValue: '<%= APP_BASE %>'
    }
  ],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]

})
export class AppModule { }
