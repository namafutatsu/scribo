import { Component, EventEmitter, Output } from '@angular/core';

export enum PanelType {
  none,
  explorer,
  noter,
  drafter,
  sheeter,
  snapshoter,
  stater,
  downloader,
  publisher,
  settingser
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
    PanelType.drafter,
    PanelType.sheeter,
    PanelType.snapshoter,
    PanelType.stater,
    PanelType.downloader,
    PanelType.publisher,
    PanelType.settingser
  ];
  titles: { [key: number]: string; } = {
    [PanelType.explorer]: 'Files',
    [PanelType.noter]: 'Notes',
    [PanelType.drafter]: 'Drafts',
    [PanelType.sheeter]: 'Sheets',
    [PanelType.stater]: 'Statistics',
    [PanelType.snapshoter]: 'Historic',
    [PanelType.downloader]: 'Download',
    [PanelType.publisher]: 'Publish',
    [PanelType.settingser]: 'Settings'
  };
  classes: { [key: number]: string; } = {
    [PanelType.explorer]: 'fa-files-o',
    [PanelType.noter]: 'fa-sticky-note',
    [PanelType.drafter]: 'fa-pencil',
    [PanelType.sheeter]: 'fa-id-card',
    [PanelType.stater]: 'fa-calendar',
    [PanelType.snapshoter]: 'fa-history',
    [PanelType.downloader]: 'fa-download',
    [PanelType.publisher]: 'fa-book',
    [PanelType.settingser]: 'fa-cogs'
  };

  // getTitle(type: PanelType) {
  //   return (type === this.panelType ? 'Hide ' : 'Show ') + this.titles[type];
  // }

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
