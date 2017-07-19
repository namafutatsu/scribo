import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { Project } from '../shared/models';
import { ProjectService } from '../services/project.service';

@Component({
  moduleId: module.id,
  selector: 'sd-projects',
  templateUrl: 'projects.component.html',
  styleUrls: ['projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: Project[];
  isLoading = true;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects(): void {
    this.projectService
      .getProjects()
      .then(projects => {
        this.projects = projects;
        this.isLoading = false;
      });
  }

  select(project: Project): void {
    this.router.navigate(['/project', project.key]);
  }
}
