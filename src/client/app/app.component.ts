import { Component } from '@angular/core';
import { Config } from './shared/config/env.config';
import './operators';
import { AuthService } from './services/auth.service';

/**
 * This class represents the main application component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent {
  constructor(
    public auth: AuthService
  ) {
    console.log('Environment config', Config);
  }
}
