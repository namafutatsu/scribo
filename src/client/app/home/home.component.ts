import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeComponent {
  constructor(public auth: AuthService) {}
}
