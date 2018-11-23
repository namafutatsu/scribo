import { Component, EventEmitter, Output } from '@angular/core';

export enum PanelType {
  none,
  explorer,
  noter,
  sheeter,
  snapshoter,
  stater,
  downloader,
  publisher
}

@Component({
  moduleId: module.id,
  selector: 'sd-actionbar',
  templateUrl: 'actionbar.component.html',
  styleUrls: ['actionbar.component.css']
})
export class ActionbarComponent {
  @Output() saving = new EventEmitter();
  @Output() switching = new EventEmitter<PanelType>();
  public panelType = PanelType.explorer;
  panels = [
    PanelType.explorer,
    PanelType.noter,
    PanelType.sheeter,
    PanelType.snapshoter,
    PanelType.stater,
    PanelType.downloader,
    PanelType.publisher
  ];
  titles: { [key: number]: string; } = {
    [PanelType.explorer]: 'files',
    [PanelType.sheeter]: 'sheets',
    [PanelType.noter]: 'notes',
    [PanelType.stater]: 'statistics',
    [PanelType.snapshoter]: 'historique',
    [PanelType.downloader]: 'download',
    [PanelType.publisher]: 'publish'
  };
  classes: { [key: number]: string; } = {
    [PanelType.explorer]: 'fa-files-o',
    [PanelType.sheeter]: 'fa-id-card',
    [PanelType.noter]: 'fa-sticky-note',
    [PanelType.stater]: 'fa-calendar',
    [PanelType.snapshoter]: 'fa-history',
    [PanelType.downloader]: 'fa-download',
    [PanelType.publisher]: 'fa-book'
  };

  getTitle(type: PanelType) {
    return (type === this.panelType ? 'Hide ' : 'Show ') + this.titles[type];
  }

  toggle(type: PanelType) {
    if (this.panelType === type) {
      this.panelType = PanelType.none;
    } else {
      this.panelType = type;
    }
    this.switching.emit(this.panelType);
  }

  save() {
    this.saving.emit();
  }
}
