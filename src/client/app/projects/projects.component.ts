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
  name: string;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private auth: AuthService,
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
        this.projects = projects.sort(o => o.index);
        this.isLoading = false;
      });
  }

  select(project: Project): void {
    this.router.navigate(['/project', project.key]);
  }

  create(): void {
    this.creation = true;
  }

  save(): void {
    let file = new Sfile();
    file.id = UUID.UUID();
    file.discriminator = 1;
    file.name = 'New file';
    file.index = 0;
    file.notes = [];
    file.text = "";
    let project = new Project();
    project.name = this.name;
    project.id = UUID.UUID();
    project.index = this.projects.length;
    project.notes = [];
    project.sitems = [ file ];
    project.open = false;
    project.key = this.name.replace(" ", "");
    project.discriminator = 0;
    this.projectService.insert(project).then(res => {
        this.toast.setMessage('New project created', 'success');
    });
    this.router.navigate(['/project', project.key]);
  }
}
