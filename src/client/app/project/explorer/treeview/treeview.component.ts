import { Component, Input, Output, EventEmitter } from '@angular/core';

import { NodeEvent, Tree, TreeModel, RenamableNode,TreeModelSettings,
  Ng2TreeSettings } from 'ng2-tree';
import { UUID } from 'angular2-uuid';

import { Project, Sitem, Sfolder } from '../../../shared/models';

@Component({
  selector: 'treeview',
  template: `
  <tree [tree]="tree"
          (nodeRenamed)="onNodeRenamed($event)"
          (nodeSelected)="onNodeSelected($event)"
          (nodeMoved)="onNodeMoved($event)"
          (nodeCreated)="onNodeCreated($event)"></tree>`,
  styles: [
    `input {
      height:25px;
      width:130px;
      margin: 0;
      padding: 0;
      border:0;
      float:left;
    }`
  ]
})
export class TreeviewComponent {
  @Input() project: Project;
  @Output() onSelected = new EventEmitter<string>();
  @Output() onCreated = new EventEmitter<any>();
  @Output() onRenamed = new EventEmitter<string>();
  @Output() onDeleted = new EventEmitter<string>();
  @Output() onMoved = new EventEmitter<any>();

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
  nodes: {[ id: string]: TreeModel; } = {};

  ngOnInit(): void {
    this.loadTreeModel();
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

  public onNodeSelected(e: NodeEvent): void {
    this.selectedNode = e.node;
    this.onSelected.emit(e.node.node.id as string);
  }

  public onNodeMoved(e: any): void {
    let result = {
      id : e.node.node.id,
      previousParentId : e.previousParent.node.id,
      parentId : e.node.parent.node.id,
      index : e.node.positionInParent
    }
    this.onMoved.emit(result);
  }

  public create(isFolder:boolean) {
    let node = this.selectedNode;
    let parent = node.isLeaf() ? node.parent : node;
    let child = parent.createNode(isFolder);
    child.node.settings = this.treeSettings;
  }

  public onNodeCreated(e: NodeEvent): void {
    let id = UUID.UUID();
    e.node.node.id = id;
    this.nodes[id] = e.node.node;
    let result = {
      id: id,
      name: e.node.value,
      parentId: e.node.parent.node.id,
      index: e.node.positionInParent,
      isFolder: e.node.isBranch()
    };
    this.onCreated.emit(result);
  }

  public rename(): void {
    this.selectedNode.markAsBeingRenamed();
  }

  public onNodeRenamed(e: NodeEvent): void {
    this.onRenamed.emit(e.node.value);
  }

  public delete(): void {
    let node = this.selectedNode;
    let parentId = node.parent.node.id as string;
    this.selectedNode = undefined;
    let id = node.node.id;
    delete this.nodes[id];
    node.parent.removeChild(node);
    this.onDeleted.emit(parentId);
  }
}