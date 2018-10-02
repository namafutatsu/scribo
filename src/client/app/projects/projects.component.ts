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
    this.creation = true;
  }

  // save(): void {
  //   const file = new Sfile();
  //   file.id = UUID.UUID();
  //   file.Discriminator = 1;
  //   file.Name = 'New file';
  //   file.Index = 0;
  //   file.notes = [];
  //   file.Text = '';
  //   const project = new Project();
  //   project.Name = this.Name;
  //   project.id = UUID.UUID();
  //   project.Index = this.projects.length;
  //   project.notes = [];
  //   project.Items = [ file ];
  //   project.open = false;
  //   project.key = this.Name.replace(/[^0-9a-z]/gi, '');
  //   project.Discriminator = 0;
  //   this.projectService.insert(project).then(res => {
  //     this.toast.setMessage('New project created', 'success');
  //   });
  //   this.router.navigate(['/project', project.key]);
  // }
}
