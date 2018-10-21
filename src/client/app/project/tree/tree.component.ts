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
  @Input() tree: STreeNode[];
  @Output() selected = new EventEmitter<STreeNode>();
  @Output() created = new EventEmitter<STreeNode>();
  @Output() renamed = new EventEmitter<STreeNode>();
  @Output() deleted = new EventEmitter<STreeNode>();
  @Output() moved = new EventEmitter<STreeNode>();

  selectedNode: STreeNode;
  basicContextMenu: MenuItem[];
  contextMenu: MenuItem[];
  dictionary: { [key: string]: STreeNode; } = {};
  structure: string[];
  showNewFolder = false;
  showNewFile = false;
  ngOnInit(): void {
    this.setDictionary(this.tree[0]);
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
    this.structure = this.tree[0].Structure;
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
    this.stopRenaming(node);
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
    this.stopRenaming(null);
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
    node.type = 'rename';
  }

  stopRenaming(node: STreeNode) {
    for (const key in this.dictionary) {
      const otherNode = this.dictionary[key];
      if (node !== otherNode && otherNode.type === 'rename') {
        this.rename(otherNode);
      }
    }
  }

  rename(node: STreeNode) {
    node.type = 'default';
    node.Path = node.Path.substr(0, node.Path.lastIndexOf('/') + 1) + node.label;
    this.renamed.emit(node);
  }

  delete(node: STreeNode): void {
    this.stopRenaming(null);
    if (node.ParentKey) {
      const children = this.dictionary[node.ParentKey].children;
      const index = children.indexOf(node);
      children.splice(index, 1);
      delete this.dictionary[node.Key];
      this.deleted.emit(node);
    }
  }

  createNode(label: string, context: CreationContext): STreeNode {
    this.stopRenaming(null);
    const name = label + ' ' + (context.index + 1).toString();
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
    this.renamed.emit(node);
    this.updateButtons(node);
    this.selected.emit(node);
    return node;
  }

  createFolderFromNode(node: STreeNode) {
    const context = this.getCreationContext(node);
    return this.createFolder(context.folderLabel, context);
  }

  createFolder(label: string, context: CreationContext): STreeNode {
    const node = this.createNode(label, context);
    node.children = [];
    node.droppable = true;
    node.collapsedIcon = 'fa fa-folder';
    node.expandedIcon = 'fa fa-folder-open';
    return node;
  }

  createFileFromNode(node: STreeNode) {
    const context = this.getCreationContext(node);
    return this.createFile(context.fileLabel, context);
  }

  createFile(label: string, context: CreationContext): STreeNode {
    const node = this.createNode(label, context);
    node.droppable = false;
    node.icon = 'fa fa-file-o';
    return node;
  }

  moveEvent(event: any): void {
    const node: STreeNode = event.dragNode;
    const newParent: STreeNode = event.dropNode;
    const newIndex: number = event.index;
    newParent.expanded = true;
    node.Path = newParent.Path + '/' + node.label;
    node.ParentKey = newParent.Key;
    node.Index = newIndex;
    this.moved.emit(node);
  }
}
