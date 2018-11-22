import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { STreeNode } from '../../shared/models';

@Component({
  moduleId: module.id,
  selector: 'sd-explorer',
  templateUrl: 'explorer.component.html',
  styleUrls: ['explorer.component.css']
})
export class ExplorerComponent implements OnInit {
  @Input() project: STreeNode;
  @Output() selecting = new EventEmitter<STreeNode>();
  @Output() saving = new EventEmitter();
  @Output() renaming = new EventEmitter<any>();
  @Output() creating = new EventEmitter<STreeNode>();
  @Output() moving  = new EventEmitter<STreeNode>();
  @Output() deleting  = new EventEmitter<STreeNode>();
  tree: STreeNode[];
  loading = false;

  ngOnInit() {
    this.tree = [this.project];
  }

  onSelected(node: STreeNode) {
    this.selecting.emit(node);
  }

  onCreated(node: STreeNode) {
    this.creating.emit(node);
  }

  onMoved(node: STreeNode) {
    this.moving.emit(node);
  }

  onDeleted(node: STreeNode) {
    this.deleting.emit(node);
  }

  onRenaming(args: any) {
    this.renaming.emit(args);
  }

  save(node: STreeNode) {
    this.saving.emit();
  }
}
