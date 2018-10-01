// import { Component, EventEmitter, Input, Output } from '@angular/core';
// import { ExporterComponent } from '../exporter/exporter.component';

// @Component({
//   moduleId: module.id,
//   selector: 'sd-actionbar',
//   templateUrl: 'actionbar.component.html',
//   styleUrls: ['actionbar.component.css']
// })
// export class ActionbarComponent {
//   @Input() exporter: ExporterComponent;
//   @Output() actionbarToggling = new EventEmitter();
//   @Output() saving = new EventEmitter();
//   // @Output() onExporting = new EventEmitter();
//   hide = false;

//   toggleActionbar(): void {
//     this.actionbarToggling.emit();
//     this.hide = !this.hide;
//   }

//   showExplorer(): void {
//     if (this.hide) {
//       this.toggleActionbar();
//     }
//   }

//   save(): void {
//     this.saving.emit();
//   }

//   showExport(): void {
//     this.exporter.open();
//     // this.onExporting.emit();
//   }
// }
