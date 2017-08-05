import { Component, OnInit } from '@angular/core';
// import { Location } from '@angular/common';
// import { ActivatedRoute, Params } from '@angular/router';

import { AuthService } from '../../services/auth.service';

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css'],
})
export class NavbarComponent { // implements OnInit
  constructor(
    public auth: AuthService,
    // private location: Location,
    // private route: ActivatedRoute,
  ) {}

  // ngOnInit(): void {
  //   this.route.params
  //   .switchMap((params: Params) => this.projectService.getProject(params['key']))
  //   .subscribe(project => {
  //   });
  // }
}
