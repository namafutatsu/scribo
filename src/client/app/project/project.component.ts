import 'rxjs/add/operator/switchMap';
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';

import { Project, Note, Sitem, Sfile, Sfolder } from '../shared/project/project';
import { ProjectService }         from '../shared/project/project.service';

import { FroalaEditorModule, FroalaViewModule } from 'angular2-froala-wysiwyg';
// import { TreeModule }             from 'angular-tree-component';
import { NodeEvent, Tree, TreeModel, RenamableNode, TreeModelSettings, Ng2TreeSettings } from 'ng2-tree';
import { UUID }                   from 'angular2-uuid';

// declare var $ :any;

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
  editorButtons = ['bold',
    'italic',
    'underline',
    'specialCharacters',
    'paragraphFormat',
    'align',
    'print',
    'fullscreen',
    'undo',
    'redo',
    'alert'];
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

  loadTreeModel(item:Sitem): void {
    this.tree = this.loadNode(item);
    this.tree.settings = this.treeSettings;
  }

  loadNode(item:Sitem): TreeModel {
    let node: TreeModel = {
        value: item.name,
        id: item.id
    };
    this.nodes[item.id] = node;
    if (item.discriminator == 0) {
      var children: TreeModel[] = [];
      (item as Sfolder).sitems.forEach(o => children.push(this.loadNode(o)))
      node.children = children;
    }
    return node;
  }

  public onNodeRemoved(e: NodeEvent): void {
  }

  public onNodeMoved(e: NodeEvent): void {
    // let id = e.node.node.id;
    // let previousParentId = e.previousParent.node.id;
    // let item = this.ids[id];
    // let previousParent = this.ids[previousParentId] as Sfolder;
    // previousParent.sitems.splice(previousParent.sitems.findIndex(o => o.id == e.node.node.id))
    // let parentId = e.node.parent.id;
    // let parent = this.ids[parentId] as Sfolder;
    // parent.sitems.push(item);
  }

  public onNodeRenamed(e: NodeEvent): void {
    let item:Sitem = this.ids[e.node.node.id];
    item.name = e.node.value;
  }

  public onNodeCreated(e: NodeEvent): void {
  }

  public onNodeSelected(e: NodeEvent): void {
    this.selectedNode = e.node;
    let item:Sitem = this.ids[e.node.node.id];
    this.selectItem(item);
    // if (e.node.isBranch && !e.node.isNodeExpanded) {
    //   e.node.;
    // }
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

  save() {
    if (this.project !== undefined)
      this.projectService.update(this.project);
  }

  rename(node:Tree) {
    node.markAsBeingRenamed();
  }

  delete(node:Tree) {
  }

  newFile(node:Tree) {
  }

  newFolder(node:Tree) {
  }
}
