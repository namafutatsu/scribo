import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Project, Sitem, Sfile, Sfolder, Note } from '../../shared/models';

declare var $ :any;

@Component({
  moduleId: module.id,
  selector: 'sd-notes',
  templateUrl: 'notes.component.html',
  styleUrls: ['notes.component.css']
})
export class NotesComponent implements OnInit {
  @Input() file: Sfile;

  buttons: string[] = [];
  options: Object = {
    charCounterCount: true,
    theme:'scribo',
    tooltips: false,
    // height:'750',
    inlineMode:true,
    pluginsEnabled: [
      'align',
      'draggable',
      'entities',
      'fontSize',
      'inlineStyle',
      'lineBreaker',
      'lists',
      'paragraphFormat',
      'paragraphStyle',
      'save',
      'wordPaste',
      'wordPaste',
      'print'
    ],
    toolbarButtons: this.buttons,
    toolbarButtonsSM: this.buttons,
    toolbarButtonsMD: this.buttons,
    toolbarButtonsXS: this.buttons,
    lineBreakerOffset: 1,
    enter: $.FroalaEditor.ENTER_DIV,
    // events : {
    //   'froalaEditor.save.before' : (e: any, editor: any) =>
    //     this.onSaving.emit()
    // },
    toolbarStickyOffset: 48
  };

  ngOnInit(): void {
  }

  clickNote(note: Note): void {
    note.status = (note.status + 2) % 3 - 1;
  }
}
