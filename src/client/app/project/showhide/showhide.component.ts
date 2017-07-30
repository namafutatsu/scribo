import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'sd-showhide',
  templateUrl: 'showhide.component.html',
  styleUrls: ['showhide.component.css']
})
export class ShowhideComponent {
  @Output() onToggling = new EventEmitter();
  hide = false;

  toggle(): void {
    this.onToggling.emit();
    this.hide = !this.hide;
  }
}
