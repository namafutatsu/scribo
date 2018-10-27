import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { ProjectService } from '../services/project.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { Project } from '../shared/models';

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
    public auth: AuthService,
    public toast: ToastComponent
  ) { }

  ngOnInit(): void {
    if (this.auth.loggedIn) {
      this.getProjects()
        .subscribe(projects => this.projects = projects);
    }
  }

  getProjects(): Observable<Project[]> {
    return this.projectService
      .getAll()
      .pipe(
        tap(_ => this.isLoading = false),
        map((projects: Project[]) => projects.sort(o => o.Index))
      );
  }

  select(project: Project): void {
    this.router.navigate(['/project', project.Name]);
  }

  create(): void {
    this.router.navigate(['/create']);
  }
}
