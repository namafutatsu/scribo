import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectComponent } from './project.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'project/:id', component: ProjectComponent }
    ])
  ],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
