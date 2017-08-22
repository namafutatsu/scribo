import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'sd-actionbar',
  templateUrl: 'actionbar.component.html',
  styleUrls: ['actionbar.component.css']
})
export class ActionbarComponent {
  @Output() onExplorerToggling = new EventEmitter();
  @Output() onNotesToggling = new EventEmitter();
  @Output() onSaving = new EventEmitter();
  @Output() onExporting = new EventEmitter();
  // hide = false;

  toggleExplorer(): void {
    this.onExplorerToggling.emit();
    // this.hide = !this.hide;
  }

  toggleNotes(): void {
    this.onNotesToggling.emit();
  }

  // showExplorer(): void {
  //   if (this.hide) {
  //     this.toggleActionbar();
  //   }
  // }

  save(): void {
    this.onSaving.emit();
  }

  showExport(): void {
    this.onExporting.emit();
  }
}
