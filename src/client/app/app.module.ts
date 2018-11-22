import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { HotkeyModule } from 'angular2-hotkeys';
import { NgxSmartModalModule } from 'ngx-smart-modal';

import { AppRoutingModule } from './app-routing.module';
import { AboutModule } from './about/about.module';
import { CreateModule } from './create/create.module';
import { HomeModule } from './home/home.module';
import { LoginModule } from './login/login.module';
import { LogoutModule } from './logout/logout.module';
import { NotFoundModule } from './notfound/notfound.module';
import { ProjectModule } from './project/project.module';
import { ProjectsModule } from './projects/projects.module';
import { RegisterModule } from './register/register.module';
import { SharedModule } from './shared/shared.module';

import { AuthService } from './services/auth.service';
import { FileService } from './services/file.service';
import { ProjectService } from './services/project.service';
import { UserService } from './services/user.service';

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
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()
  ],
  declarations: [AppComponent],
  providers: [
    AuthService,
    FileService,
    ProjectService,
    UserService,
    {
      provide: APP_BASE_HREF,
      useValue: '<%= APP_BASE %>'
    }
  ],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]

})
export class AppModule { }
