import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';

import { NodeEvent, Tree, TreeModel, TreeModelSettings } from 'ng2-tree';
import { UUID } from 'angular2-uuid';

import { Project, Sitem, Sfolder } from '../../../shared/models';
import { Node } from '../explorer.models';

@Component({
  moduleId: module.id,
  selector: 'sd-treeview',
  templateUrl: 'treeview.component.html',
  styleUrls: ['treeview.component.css']
})
export class TreeviewComponent implements OnInit, OnChanges {
  @Input() project: Project;
  @Input() contentChangeAlertFromExplorer: boolean;
  @Output() selected = new EventEmitter<string>();
  @Output() created = new EventEmitter<any>();
  @Output() renamed = new EventEmitter<string>();
  @Output() deleted = new EventEmitter();
  @Output() moved = new EventEmitter<Node>();

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

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    if (changes.contentChangeAlertFromExplorer.currentValue) {
      this.selectedNode.value += ' ●';
    }
  }

  loadNode(item: Sitem): TreeModel {
    const node: TreeModel = {
        value: item.Name,
        id: item.Key
    };
    // this.nodes[item.id] = node;
    if (item.Discriminator === 0) {
      const children: TreeModel[] = [];
      (item as Sfolder).Items
        .sort((a, b) => a.Index - b.Index)
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
    this.selected.emit(e.node.node.id as string);
  }

  create(isFolder: boolean) {
    const node = this.selectedNode;
    const parent = node.isLeaf() ? node.parent : node;
    const child = parent.createNode(isFolder);
    child.node.settings = this.treeSettings;
  }

  onNodeCreated(e: NodeEvent): void {
    const id = UUID.UUID();
    e.node.node.id = id;
    // this.nodes[id] = e.node.node;
    const result = {
      id: id,
      Name: e.node.value,
      parentId: e.node.parent.node.id,
      Index: e.node.positionInParent,
      isFolder: e.node.isBranch()
    };
    this.created.emit(result);
  }

  rename(): void {
    this.selectedNode.markAsBeingRenamed();
  }

  getRoot(node: Tree): Tree {
    return node.isRoot() ? node : this.getRoot(node.parent);
  }

  getStructure(tree: Tree): Node {
    const node = new Node();
    node.id = tree.node.id as string;
    node.Name = tree.value as string;
    node.nodes = [];
    if (tree.children !== null) {
      tree.children.forEach(o => node.nodes.push(this.getStructure(o)));
    }
    return node;
  }

  onNodeMoved(e: NodeEvent): void {
    this.moved.emit(this.getStructure(this.getRoot(e.node)));
  }

  onNodeRenamed(e: NodeEvent): void {
    this.renamed.emit(e.node.value);
  }

  delete(): void {
    const node = this.selectedNode;
    this.selectedNode = null;
    // let id = node.node.id;
    // delete this.nodes[id];
    node.parent.removeChild(node);
    this.deleted.emit();
  }
}
