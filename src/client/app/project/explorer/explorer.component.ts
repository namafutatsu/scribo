import { Component, Input, Output, EventEmitter } from '@angular/core';

import { NodeEvent, Tree, TreeModel, RenamableNode,TreeModelSettings,
  Ng2TreeSettings } from 'ng2-tree';
import { UUID } from 'angular2-uuid';

import { Project, Note, Sitem, Sfile, Sfolder } from '../../shared/models';

@Component({
  selector: 'explorer',
  template: `
  <div id="toolbar">
    <button (click)="saveButton()" [disabled]="loading">
      <i class="fa fa-floppy-o" aria-hidden="true"></i>
    </button>
    <button (click)="newFolderButton(selectedNode)" [disabled]="!selectedItem">
      <i class="fa fa-folder-o" aria-hidden="true"></i>
    </button>
    <button (click)="newFileButton(selectedNode)" [disabled]="!selectedItem">
      <i class="fa fa-file-text-o" aria-hidden="true"></i>
    </button>
    <button (click)="renameButton(selectedNode)" [disabled]="!selectedItem">
      <i class="fa fa-i-cursor" aria-hidden="true"></i>
    </button>
    <button (click)="deleteButton(selectedNode)" [disabled]="!selectedItem">
      <i class="fa fa-trash-o" aria-hidden="true"></i>
    </button>   
  </div>
  <br/><br/>
  <tree [tree]="tree"
          (nodeRenamed)="onNodeRenamed($event)"
          (nodeSelected)="onNodeSelected($event)"
          (nodeMoved)="onNodeMoved($event)"
          (nodeCreated)="onNodeCreated($event)"></tree>`,
  styles: [
    `button {
      color: #4f4f51;
      background-color: #f2eae1;
      transition: background-color 0.2s ease 0s;
      font-size: 14px;
      width:38px;
      height:38px;
      float:left;
      outline: 0;
      border: 0;
      margin: 0px 2px;
      padding: 0;
      cursor: pointer;
    }

    button:hover {
      background-color: #e0dad3;
    }

    button:active {
      background-color: #cecac4;
    }

    button:disabled {
      color: #b3ada7;
      cursor: auto;
    }

    input {
      height:25px;
      width:130px;
      margin: 0;
      padding: 0;
      border:0;
      float:left;
    }`
  ]
})
export class ExplorerComponent {
  @Input() project: Project;
  @Output() onFileSelect = new EventEmitter<Sfile>();
  @Output() onFolderSelect = new EventEmitter<Sfolder>();
  @Output() onSave = new EventEmitter();

  loading = false;
  selectedItem: Sitem;
  selectedFile: Sfile;
  selectedNode: Tree;
  treeSettings: TreeModelSettings = {
    cssClasses: {
      expanded: 'fa fa-caret-down',
      collapsed: 'fa fa-caret-right',
      empty: 'fa fa-caret-right disabled',
      leaf: 'fa'
    },
    templates: {
      node: '<i class="fa fa-folder-o"></i>',
      leaf: '<i class="fa fa-file-o"></i>'
    },
    rightMenu: false
  };
  public tree: TreeModel = {
    value: 'Loading...'
  };
  ids: { [id: string]: Sitem; } = {};
  nodes: {[ id: string]: TreeModel; } = {};

  ngOnInit(): void {
    this.loadIds(this.project);
    this.loadTreeModel();
  }

  loadIds(item:Sitem): void {
    this.ids[item.id] = item;
    if (item.discriminator == 0) {
      (item as Sfolder).sitems.forEach(o => this.loadIds(o));
    }
  }

  loadNode(item:Sitem): TreeModel {
    let node: TreeModel = {
        value: item.name,// + "." + item.index,
        id: item.id
    };
    this.nodes[item.id] = node;
    if (item.discriminator == 0) {
      var children: TreeModel[] = [];
      (item as Sfolder).sitems
        .sort((a,b) => a.index - b.index)
        .forEach(o => children.push(this.loadNode(o)))
      node.children = children;
    }
    return node;
  }

  loadTreeModel(): void {
    this.tree = this.loadNode(this.project);
    this.tree.settings = this.treeSettings;
  }

  onSelect(item: Sitem): void {
    this.selectedItem = item;
    if (item.discriminator === 1) {
      let file = item as Sfile;
      this.selectedFile = file;
      this.onFileSelect.emit(file);
    } else {
      let folder = item as Sfolder;
      this.selectedFile = null;
      this.onFolderSelect.emit(folder);
      // const folder = item as Sfolder;
      // folder.open = !folder.open;
    }
  }

  // public onNodeRemoved(e: NodeEvent): void {

  // }

  public onNodeMoved(e: any): void {
    let id = e.node.node.id;
    let previousParentId = e.previousParent.node.id;
    let item = this.ids[id];
    let parentId = e.node.parent.node.id;
    let parent = this.ids[parentId] as Sfolder;
    let index = e.node.positionInParent;
    let previousIndex = item.index;
    if (previousParentId !== parentId) {
      let previousParent = this.ids[previousParentId] as Sfolder;
      this.remove(previousParent, item);
      this.add(parent, item);
      previousParent.sitems.filter(o => o.index > previousIndex).forEach(o => o.index--);
      parent.sitems.filter(o => o.index >= index).forEach(o => o.index++);
    } else {
      parent.sitems.find(o => o.index === index).index = previousIndex;
    }
    // if (previousIndex < index) {
    //   parent.sitems.filter(o => o.index >= previousIndex && o.index < index).forEach(o => o.index--);
    // } else {
    //   parent.sitems.filter(o => o.index >= index && o.index < previousIndex).forEach(o => o.index++);
    // }
    item.index = index;
  }

  // public updateIndexes(parent: Sfolder) {
  //   let i = 0;
  //   this.nodes[parent.id].children.forEach(o => this.ids[o.id].index = i++)
  // }

  public remove(parent: Sfolder, item: Sitem) {
    let index = parent.sitems.indexOf(item);
    if (index > -1)
      parent.sitems.splice(index, 1);
  }

  public add(parent: Sfolder, item:Sitem) {
    parent.sitems.push(item);
  }

  public onNodeRenamed(e: NodeEvent): void {
    let item:Sitem = this.ids[e.node.node.id];
    item.name = e.node.value;
  }

  public createSitemFromNode(node: Tree): Sitem {
    let item: Sitem;
    if (node.isLeaf()) {
      item = new Sfile();
      (item as Sfile).text = "";
    } else {
      item = new Sfolder();
      (item as Sfolder).sitems = [];
    }
    item.notes = [];
    item.id = node.node.id as string;
    item.index = node.positionInParent;
    item.name = node.value;
    (this.ids[node.parent.node.id] as Sfolder).sitems.push(item);
    return item;
  }

  public onNodeCreated(e: NodeEvent): void {
    let id = UUID.UUID();
    e.node.node.id = id;
    this.ids[id] = this.createSitemFromNode(e.node);
    this.nodes[id] = e.node.node;
  }

  public onNodeSelected(e: NodeEvent): void {
    this.selectedNode = e.node;
    let item:Sitem = this.ids[e.node.node.id];
    this.onSelect(item);
  }

  public saveButton() {
    this.onSave.emit();
    // this.loading = true;
    // if (this.project !== undefined)
    //   this.projectService.update(this.project).then(() => this.loading = false);
  }

  public renameButton(node:Tree) {
    node.markAsBeingRenamed();
  }

  public deleteButton(node:Tree) {
    let id = node.node.id;
    delete this.ids[id];
    delete this.nodes[id];
    let parent = this.ids[node.parent.node.id] as Sfolder;
    let index = node.positionInParent;
    parent.sitems.filter(o => o.index > index).forEach(o => o.index--);
    parent.sitems.splice(parent.sitems.findIndex(o => o.id === id), 1);
    node.parent.removeChild(node);
    this.selectedNode = undefined;
    this.selectedFile = undefined;
    this.selectedItem = undefined;
  }

  private newItem(node:Tree, isFolder:boolean) {
    let parent = node.isLeaf() ? node.parent : node;
    let child = parent.createNode(isFolder);
    child.node.settings = this.treeSettings;
  }

  public newFileButton(node:Tree) {
    this.newItem(node, false);
  }

  public newFolderButton(node:Tree) {
    this.newItem(node, true);
  }

}