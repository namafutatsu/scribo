import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UUID } from 'angular2-uuid';

import { AuthService } from '../services/auth.service';
import { Project, Sfile } from '../shared/models';
import { ProjectService } from '../services/project.service';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  moduleId: module.id,
  selector: 'sd-projects',
  templateUrl: 'projects.component.html',
  styleUrls: ['projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: Project[];
  isLoading = true;
  creation = false;
  Name: string;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    public auth: AuthService,
    public toast: ToastComponent
  ) { }

  ngOnInit(): void {
    if (this.auth.loggedIn) {
      this.getProjects();
    }
  }

  getProjects(): void {
    this.projectService
      .getProjects()
      .then(projects => {
        this.projects = projects.sort(o => o.Index);
        this.isLoading = false;
      });
  }

  select(project: Project): void {
    this.router.navigate(['/project', project.Name]);
  }

  create(): void {
    this.router.navigate(['/create']);
  }
}
