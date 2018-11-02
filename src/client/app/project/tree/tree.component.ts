import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MenuItem, TreeDragDropService } from 'primeng/api';
import { UUID } from 'angular2-uuid';

import { STreeNode } from '../../shared/models';

export class CreationContext {
  folderLabel: string;
  fileLabel: string;
  parent: STreeNode;
  index: number;
}

@Component({
  moduleId: module.id,
  selector: 'sd-tree',
  templateUrl: 'tree.component.html',
  styleUrls: ['tree.component.css'],
  providers: [TreeDragDropService]
})
export class TreeComponent implements OnInit {
  @Input() tree: STreeNode;
  @Output() selected = new EventEmitter<STreeNode>();
  @Output() created = new EventEmitter<STreeNode>();
  @Output() deleted = new EventEmitter<STreeNode>();
  @Output() moved = new EventEmitter<STreeNode>();
  @Output() renaming = new EventEmitter<STreeNode>();

  selectedNode: STreeNode;
  basicContextMenu: MenuItem[];
  contextMenu: MenuItem[];
  dictionary: { [key: string]: STreeNode; } = {};
  structure: string[];
  showNewFolder = false;
  showNewFile = false;
  ngOnInit(): void {
    this.setDictionary(this.tree);
    this.basicContextMenu = [{
      label: 'Rename',
      icon: 'fa fa-i-cursor',
      command: () => this.startRenaming(this.selectedNode)
    },
    {
      label: 'Delete',
      icon: 'fa fa-close',
      command: () => this.delete(this.selectedNode)
    }];
    this.contextMenu = this.basicContextMenu;
    this.structure = this.tree.Structure;
  }

  setDictionary(folder: STreeNode): void {
    this.dictionary[folder.Key] = folder;
    if (folder.children) {
      folder.children.forEach(o => {
        const t = o as STreeNode;
        if (!t.droppable) {
          this.dictionary[t.Key] = t;
        } else {
          this.setDictionary(t);
        }
      });
    }
  }

  updateButtons(node: STreeNode): void {
    const context = this.getCreationContext(node);
    this.showNewFolder = context.folderLabel !== '';
    this.showNewFile = context.fileLabel !== '';
  }

  selectEvent(node: STreeNode): void {
    this.updateButtons(node);
    this.selected.emit(node);
  }

  getCreationContext(node: STreeNode) {
    const level = node.Level;
    let folderLabel = '';
    let fileLabel = '';
    if (this.structure.length === 0) {
      folderLabel = 'Folder';
      fileLabel = 'File';
    } else {
      if (level < this.structure.length - 1) {
        folderLabel = this.structure[level];
      }
      if (level >= this.structure.length - 1) {
        fileLabel = this.structure[this.structure.length - 1];
      }
    }
    let parentKey = node.Key;
    if (!node.droppable) {
      parentKey = node.ParentKey;
    }
    const parent = this.dictionary[parentKey];
    let index = node.Index + 1;
    if (node.droppable) {
      index = node.children.length;
    }
    const context = new CreationContext();
    context.folderLabel = folderLabel;
    context.fileLabel = fileLabel;
    context.parent = parent;
    context.index = index;
    return context;
  }

  setMenuEvent(node: STreeNode) {
    const context = this.getCreationContext(node);
    this.setMenu(context);
  }

  setMenu(context: CreationContext) {
    const newItems = [];
    if (context.folderLabel !== '') {
      newItems.push({
        label: context.folderLabel,
        icon: 'fa fa-folder',
        command: () => this.createFolder(context.folderLabel, context)
      });
    }
    if (context.fileLabel !== '') {
      newItems.push({
        label: context.fileLabel,
        icon: 'fa fa-file',
        command: () => this.createFile(context.fileLabel, context)
      });
    }
    this.contextMenu = [{
      label: 'New',
      icon: 'pi pi-fw pi-plus',
      items: newItems
    }];
    this.contextMenu = this.contextMenu.concat(this.basicContextMenu);
  }

  startRenaming(node: STreeNode) {
    this.renaming.emit(node);
  }

  delete(node: STreeNode): void {
    this.deleted.emit(node);
    if (node.ParentKey) {
      const parent = this.dictionary[node.ParentKey];
      const children = parent.children;
      const index = children.indexOf(node);
      children.splice(index, 1);
      delete this.dictionary[node.Key];
      this.updateIndexes(parent);
    }
  }

  createNode(label: string, context: CreationContext): STreeNode {
    const name = this.getLabel(context.parent, 'New ' + label);
    const node: STreeNode = {
      Key: UUID.UUID(),
      ParentKey: context.parent.Key,
      Index: context.index,
      Level: context.parent.Level + 1,
      Path: context.parent.Path + '/' + name,
      label: name
    };
    context.parent.children.forEach(o => {
      const t = o as STreeNode;
      if (t.Index >= context.index) {
        t.Index += 1;
      }
    });
    this.dictionary[node.Key] = node;
    context.parent.children.splice(context.index, 0, node);
    context.parent.expanded = true;
    this.selectedNode = node;
    this.startRenaming(node);
    this.updateButtons(node);
    this.selected.emit(node);
    const parent = this.dictionary[node.ParentKey];
    this.updateIndexes(parent);
    return node;
  }

  createFolderFromNode(node: STreeNode) {
    const context = this.getCreationContext(node);
    this.createFolder(context.folderLabel, context);
  }

  createFolder(label: string, context: CreationContext) {
    const node = this.createNode(label, context);
    node.children = [];
    node.droppable = true;
    node.collapsedIcon = 'fa fa-folder';
    node.expandedIcon = 'fa fa-folder-open';
    this.created.emit(node);
  }

  createFileFromNode(node: STreeNode) {
    const context = this.getCreationContext(node);
    this.createFile(context.fileLabel, context);
  }

  createFile(label: string, context: CreationContext) {
    const node = this.createNode(label, context);
    node.droppable = false;
    node.icon = 'fa fa-file-o';
    this.created.emit(node);
  }

  moveEvent(event: any): void {
    const node: STreeNode = event.dragNode;
    const parent = this.dictionary[node.ParentKey];
    let newParent: STreeNode = event.dropNode;
    if (!newParent.droppable || event.originalEvent.target.className !== 'ng-star-inserted') {
      newParent = this.dictionary[newParent.ParentKey];
    }
    node.newIndex = event.dropIndex;
    const name = this.getLabel(newParent, node.label);
    node.label = name;
    node.newPath = newParent.Path + '/' + name;
    this.moved.emit(node);
    newParent.expanded = true;
    node.Path = node.newPath;
    node.ParentKey = newParent.Key;
    node.Index = node.newIndex;
    this.updateIndexes(parent);
    this.updateIndexes(newParent);
  }

  updateIndexes(parent: STreeNode) {
    parent.children.forEach(o => (o as STreeNode).Index = parent.children.indexOf(o));
  }

  getLabel(parent: STreeNode, name: string): string {
    const prefix = name;
    let label = name;
    let i = 2;
    while (this.alreadyExists(parent, label)) {
      label = prefix + ' ' + i++;
    }
    return label;
  }

  alreadyExists(parent: STreeNode, name: string) {
    for (const i in parent.children) {
      if (parent.children[i].label === name) {
        return true;
      }
    }
    return false;
  }

  doubleExists(parent: STreeNode, name: string) {
    let count = 0;
    for (const i in parent.children) {
      if (parent.children[i].label === name && count++ >= 1) {
        return true;
      }
    }
    return false;
  }
}
