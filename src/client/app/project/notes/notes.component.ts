import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Project, Sitem, Sfile, Sfolder, Note } from '../../shared/models';

@Component({
  moduleId: module.id,
  selector: 'sd-notes',
  templateUrl: 'notes.component.html',
  styleUrls: ['notes.component.css']
})
export class NotesComponent implements OnInit {
  @Input() file: Sfile;

  ngOnInit(): void {
  }

  clickNote(note: Note): void {
    note.status = (note.status + 2) % 3 - 1;
  }
}
