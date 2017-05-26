import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'projects', component: ProjectsComponent }
    ])
  ],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
