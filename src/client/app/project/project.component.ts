import 'rxjs/add/operator/switchMap';
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';

import { FroalaEditorModule, FroalaViewModule } from 'angular2-froala-wysiwyg';
import { NodeEvent, Tree, TreeModel, RenamableNode, TreeModelSettings, Ng2TreeSettings } from 'ng2-tree';
import { UUID }                   from 'angular2-uuid';

import { Project, Note, Sitem, Sfile, Sfolder } from '../shared/models';
import { ProjectService }         from '../shared/services/project.service';

@Component({
  moduleId: module.id,
  selector: 'sd-project',
  templateUrl: 'project.component.html',
  styleUrls: ['project.component.css']
})
export class ProjectComponent implements OnInit {
  project: Project;
  selectedItem: Sitem;
  selectedFile: Sfile;
  selectedNode: Tree;
  editorButtons = [
    'bold',
    'italic',
    'underline',
    'specialCharacters',
    'paragraphFormat',
    'align',
    'print',
    'fullscreen',
    'undo',
    'redo',
    'alert'
  ];
  editorOptions: Object = {
    charCounterCount: true,
    theme:'scribo',
    tooltips: false,
    // height:'750',
    inlineMode:false,
    pluginsEnabled: [
      'align',
      // 'charCounter',
      // 'codeBeautifier',
      // 'codeView',
      // 'colors',
      'draggable',
      // 'emoticons',
      'entities',
      // 'file',
      // 'fontFamily',
      'fontSize',
      'fullscreen',
      // 'image',
      // 'imageManager',
      'inlineStyle',
      'lineBreaker',
      // 'link',
      'lists',
      'paragraphFormat',
      'paragraphStyle',
      // 'quickInsert',
      // 'quote',
      // 'save',
      // 'table',
      // 'url',
      // 'video',
      'wordPaste',
      'specialCharacters',
      'wordPaste',
      'print'
    ],

    toolbarButtons: this.editorButtons,
    toolbarButtonsSM: this.editorButtons,
    toolbarButtonsMD: this.editorButtons,
    toolbarButtonsXS: this.editorButtons,
  };
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
    }
  };
  public tree: TreeModel = {
    value: 'Loading...'
  };
  ids: { [id: string]: Sitem; } = {};
  nodes: {[ id: string]: TreeModel; } = {};

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.params
    .switchMap((params: Params) => this.projectService.getProject(params['key']))
    .subscribe(project => {
      this.project = project;
      this.loadIds(this.project);
      this.loadTreeModel(this.project);
    });
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

  loadTreeModel(item:Sitem): void {
    this.tree = this.loadNode(item);
    this.tree.settings = this.treeSettings;
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
    this.selectItem(item);
  }

  selectItem(item: Sitem): void {
    this.selectedItem = item;
    if (item.discriminator === 1) {
      this.selectedFile = item as Sfile;
    } else {
      this.selectedFile = null;
      // const folder = item as Sfolder;
      // folder.open = !folder.open;
    }
  }

  clickNote(note: Note): void {
    note.status = (note.status + 2) % 3 - 1;
  }

  public saveButton() {
    if (this.project !== undefined)
      this.projectService.update(this.project);
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
