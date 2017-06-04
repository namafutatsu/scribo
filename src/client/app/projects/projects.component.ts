import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { Project }                from '../shared/project/project';
import { ProjectService }         from '../shared/project/project.service';

@Component({
  moduleId: module.id,
  selector: 'sd-projects',
  templateUrl: 'projects.component.html',
  styleUrls: ['projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: Project[];

  constructor(
    private projectService: ProjectService,
    private router: Router) { }

  ngOnInit(): void {
    this.getProjects();
  }
  
  getProjects(): void {
    this.projectService
        .getProjects()
        .then(projects => this.projects = projects);
  }

  select(project: Project): void {
    this.router.navigate(['/project', project.key]);
  }
}
