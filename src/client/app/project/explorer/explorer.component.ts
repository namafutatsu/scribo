import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { STreeNode } from '../../shared/models';

@Component({
  moduleId: module.id,
  selector: 'sd-explorer',
  templateUrl: 'explorer.component.html',
  styleUrls: ['explorer.component.css']
})
export class ExplorerComponent implements OnInit {
  @Input() project: STreeNode[];
  @Output() fileSelected = new EventEmitter<STreeNode>();
  @Output() folderSelected = new EventEmitter<STreeNode>();
  @Output() saving = new EventEmitter();

  loading = false;

  ngOnInit(): void {
    // todo
  }

  onSelected(node: STreeNode): void {
    if (node) {
      if (node.droppable) {
        this.folderSelected.emit(node);
      } else {
        this.fileSelected.emit(node);
      }
    }
  }

  onCreated(result: any): void {
    // todo
  }

  onRenamed(node: STreeNode) {
    // todo
  }

  onMoved(tree: Node): void {
    // todo
  }

  onDeleted() {
    // todo
  }

  save(): void {
    this.saving.emit();
  }
}
