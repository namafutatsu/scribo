import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ToolbarComponent } from './toolbar/toolbar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ToastComponent } from './toast/toast.component';
import { LoadingComponent } from './loading/loading.component';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    ToolbarComponent,
    NavbarComponent,
    ToastComponent,
    LoadingComponent
  ],
  exports: [
    // Shared Modules
    CommonModule,
    FormsModule,
    RouterModule,
    // Shared Components
    ToolbarComponent,
    NavbarComponent,
    ToastComponent,
    LoadingComponent
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        ToastComponent
      ]
    };
  }
}
