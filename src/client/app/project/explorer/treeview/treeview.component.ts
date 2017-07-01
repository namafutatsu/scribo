import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { NodeEvent, Tree, TreeModel, TreeModelSettings } from 'ng2-tree';
import { UUID } from 'angular2-uuid';

import { Project, Sitem, Sfolder } from '../../../shared/models';
import { Node } from '../explorer.models';

@Component({
  moduleId: module.id,
  selector: 's-treeview',
  templateUrl: 'treeview.component.html',
  styleUrls: ['treeview.component.css']
})
export class TreeviewComponent implements OnInit {
  @Input() project: Project;
  @Output() onSelected = new EventEmitter<string>();
  @Output() onCreated = new EventEmitter<any>();
  @Output() onRenamed = new EventEmitter<string>();
  @Output() onDeleted = new EventEmitter();
  @Output() onMoved = new EventEmitter<Node>();

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
  // nodes: {[ id: string]: TreeModel; } = {};

  ngOnInit(): void {
    this.loadTreeModel();
  }

  loadNode(item: Sitem): TreeModel {
    let node: TreeModel = {
        value: item.name,
        id: item.id
    };
    // this.nodes[item.id] = node;
    if (item.discriminator === 0) {
      var children: TreeModel[] = [];
      (item as Sfolder).sitems
        .sort((a,b) => a.index - b.index)
        .forEach(o => children.push(this.loadNode(o)));
      node.children = children;
    }
    return node;
  }

  loadTreeModel(): void {
    this.tree = this.loadNode(this.project);
    this.tree.settings = this.treeSettings;
  }

  onNodeSelected(e: NodeEvent): void {
    this.selectedNode = e.node;
    this.onSelected.emit(e.node.node.id as string);
  }

  create(isFolder:boolean) {
    let node = this.selectedNode;
    let parent = node.isLeaf() ? node.parent : node;
    let child = parent.createNode(isFolder);
    child.node.settings = this.treeSettings;
  }

  onNodeCreated(e: NodeEvent): void {
    let id = UUID.UUID();
    e.node.node.id = id;
    // this.nodes[id] = e.node.node;
    let result = {
      id: id,
      name: e.node.value,
      parentId: e.node.parent.node.id,
      index: e.node.positionInParent,
      isFolder: e.node.isBranch()
    };
    this.onCreated.emit(result);
  }

  rename(): void {
    this.selectedNode.markAsBeingRenamed();
  }

  getRoot(node: Tree): Tree {
    return node.isRoot() ? node : this.getRoot(node.parent);
  }

  getStructure(tree: Tree): Node {
    let root = this.getRoot(tree);
    let node = new Node();
    node.id = tree.node.id as string;
    node.name = tree.value as string;
    node.nodes = [];
    if (tree.children !== undefined) {
      tree.children.forEach(o => node.nodes.push(this.getStructure(o)));
    }
    return node;
  }

  onNodeMoved(e: NodeEvent): void {
    this.onMoved.emit(this.getStructure(e.node));

  }

  onNodeRenamed(e: NodeEvent): void {
    this.onRenamed.emit(e.node.value);
  }

  delete(): void {
    let node = this.selectedNode;
    this.selectedNode = null;
    let id = node.node.id;
    // delete this.nodes[id];
    node.parent.removeChild(node);
    this.onDeleted.emit();
  }
}
