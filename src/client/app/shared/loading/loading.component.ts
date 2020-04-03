import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'sd-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent {
  @Input() condition: boolean;
}
