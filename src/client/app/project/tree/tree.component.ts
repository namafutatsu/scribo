import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MenuItem, TreeDragDropService } from 'primeng/api';
import { UUID } from 'angular2-uuid';

import { STreeNode } from '../../shared/models';

export class CreationContext {
  folderLabel: string;
  fileLabel: string;
  parentFile: STreeNode;
  parentFolder: STreeNode;
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
  @Output() deleted = new EventEmitter<STreeNode>();
  @Output() moved = new EventEmitter<STreeNode>();
  @Output() renaming = new EventEmitter<any>();

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
      for (const i in folder.children) {
        const child = folder.children[i] as STreeNode;
        if (child.IsLeaf) {
          this.dictionary[child.Key] = child;
        } else {
          this.setDictionary(child);
        }
      }
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
    let parentKey = node.Key;
    if (node.IsLeaf) {
      parentKey = node.ParentKey;
    }
    const parentFile = this.dictionary[parentKey];
    let parentFolder = this.dictionary[parentKey];
    let folderLabel = '';
    let fileLabel = '';
    let index = node.Index + 1;
    if (!node.IsLeaf) {
      index = node.children.length;
    }
    if (this.structure.length === 0) {
      folderLabel = 'Folder';
      fileLabel = 'File';
    } else {
      if (level < this.structure.length - 1) {
        // Basic child folder creation
        folderLabel = this.structure[level];
      }
      if (level === this.structure.length - 1 && level > 0) {
        // If we are on the last folder, we can create the same kind of folder
        parentFolder = this.dictionary[parentFolder.ParentKey];
        folderLabel = this.structure[level - 1];
      }
      if (level === this.structure.length) {
        // If we are on a file, we can create an uncle
        parentFolder = this.dictionary[parentFolder.ParentKey];
        folderLabel = this.structure[this.structure.length - 2];
        index = parentFolder.children.length;
      }
      if (level >= this.structure.length - 1) {
        // If you are on a folder/file, we can create a child/brother
        fileLabel = this.structure[this.structure.length - 1];
      } else {
        // Instead of a folder, you can directly create a file as a merged version of this folder
        fileLabel = this.structure[level];
      }
    }
    const context = new CreationContext();
    context.folderLabel = folderLabel;
    context.fileLabel = fileLabel;
    context.parentFile = parentFile;
    context.parentFolder = parentFolder;
    context.index = index;
    return context;
  }

  setMenuEvent(node: STreeNode) {
    const context = this.getCreationContext(node);
    this.setMenu(context);
  }

  setMenu(context: CreationContext) {
    const newItems: MenuItem[] = [];
    if (context.folderLabel !== '') {
      newItems.push({
        label: 'New ' + context.folderLabel,
        icon: 'fa fa-folder',
        command: () => this.createNode(context.folderLabel, context, false)
      });
    }
    if (context.fileLabel !== '') {
      newItems.push({
        label: 'New ' + context.fileLabel,
        icon: 'fa fa-file',
        command: () => this.createNode(context.fileLabel, context, true)
      });
    }
    // this.contextMenu = [{
    //   label: 'New',
    //   icon: 'pi pi-fw pi-plus',
    //   items: newItems
    // }];
    this.contextMenu = newItems.concat(this.basicContextMenu);
  }

  startRenaming(node: STreeNode) {
    const parent = this.dictionary[node.ParentKey];
    this.renaming.emit({ node, parent });
  }

  delete(node: STreeNode): void {
    this.deleted.emit(node);
    if (node.ParentKey) {
      this.selectedNode = null;
      this.selected.emit(null);
      const parent = this.dictionary[node.ParentKey];
      const children = parent.children;
      const index = children.indexOf(node);
      children.splice(index, 1);
      delete this.dictionary[node.Key];
      this.updateIndexes(parent);
    }
  }

  createNode(label: string, context: CreationContext, leaf: boolean): STreeNode {
    const parent = leaf ? context.parentFile : context.parentFolder;
    const name = this.getLabel(parent, 'New ' + label);
    const node: STreeNode = {
      Key: UUID.UUID(),
      ParentKey: parent.Key,
      Index: context.index,
      Level: parent.Level + 1,
      Path: parent.Path + '/' + name,
      label: name
    };
    parent.children.forEach(o => {
      const t = o as STreeNode;
      if (t.Index >= context.index) {
        t.Index += 1;
      }
    });
    if (leaf) {
      node.IsLeaf = true;
      node.droppable = !node.IsLeaf;
      node.icon = 'fa fa-file-o';
    } else {
      node.children = [];
      node.IsLeaf = false;
      node.droppable = !node.IsLeaf;
      node.collapsedIcon = 'fa fa-folder';
      node.expandedIcon = 'fa fa-folder-open';
    }
    this.dictionary[node.Key] = node;
    parent.children.splice(context.index, 0, node);
    parent.expanded = true;
    this.selectedNode = node;
    this.updateButtons(node);
    this.selected.emit(node);
    this.updateIndexes(this.dictionary[node.ParentKey]);
    this.startRenaming(node);
    return node;
  }

  createFolderFromNode(node: STreeNode) {
    const context = this.getCreationContext(node);
    this.createNode(context.folderLabel, context, false);
  }

  // createFolder(label: string, context: CreationContext) {
  //   context.parent = context.parentFolder;
  //   const node = this.createNode(label, context);

  //   this.created.emit(node);
  // }

  createFileFromNode(node: STreeNode) {
    const context = this.getCreationContext(node);
    this.createNode(context.fileLabel, context, true);
  }

  // createFile(label: string, context: CreationContext) {
  //   context.parent = context.parentFile;
  //   const node = this.createNode(label, context);

  //   this.created.emit(node);
  // }

  moveEvent(event: any): void {
    const node: STreeNode = event.dragNode;
    const parent = this.dictionary[node.ParentKey];
    let newParent: STreeNode = event.dropNode;
    if (newParent.IsLeaf || event.originalEvent.target.className !== 'ng-star-inserted') {
      newParent = this.dictionary[newParent.ParentKey];
    }
    node.newIndex = event.dropIndex;
    const name = this.getLabel(newParent, node.label, node);
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

  getLabel(parent: STreeNode, name: string, node: STreeNode = null): string {
    const prefix = name;
    let label = name;
    let i = 2;
    while (this.alreadyExists(parent, label, node)) {
      label = prefix + ' (' + i++ + ')';
    }
    return label;
  }

  alreadyExists(parent: STreeNode, name: string, node: STreeNode = null) {
    for (const i in parent.children) {
      const c = parent.children[i];
      if (c !== node && c.label === name) {
        return true;
      }
    }
    return false;
  }

  // doubleExists(parent: STreeNode, name: string) {
  //   let count = 0;
  //   for (const i in parent.children) {
  //     if (parent.children[i].label === name && count++ >= 1) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }
}
