import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Project, Sitem, Sfile, Sfolder } from '../../shared/models';
import { Node } from './explorer.models'

@Component({
  selector: 'explorer',
  template: 
    `<div id="toolbar">
      <button (click)="this.save()" [disabled]="loading">
        <i class="fa fa-floppy-o" aria-hidden="true"></i>
      </button>
      <button (click)="treeview.create(true)" [disabled]="!selectedItem">
        <i class="fa fa-folder-o" aria-hidden="true"></i>
      </button>
      <button (click)="treeview.create(false)" [disabled]="!selectedItem">
        <i class="fa fa-file-text-o" aria-hidden="true"></i>
      </button>
      <button (click)="treeview.rename()" [disabled]="!selectedItem">
        <i class="fa fa-i-cursor" aria-hidden="true"></i>
      </button>
      <button (click)="treeview.delete()" [disabled]="!selectedItem || selectedItem == project">
        <i class="fa fa-trash-o" aria-hidden="true"></i>
      </button>   
    </div>
    <br/><br/>
    <treeview #treeview [project]="project"
            (onSelected)="onSelected($event)"
            (onCreated)="onCreated($event)"
            (onRenamed)="onRenamed($event)"
            (onDeleted)="onDeleted($event)"
            (onMoved)="onMoved($event)"></treeview>
            `,
  styles: [
    `treeview {
      float:left;
    }
    
    button {
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
    }`
  ]
})
export class ExplorerComponent {
  @Input() project: Project;
  @Output() onFileSelected = new EventEmitter<Sfile>();
  @Output() onFolderSelected = new EventEmitter<Sfolder>();
  @Output() onSaving = new EventEmitter();

  loading = false;
  selectedItem: Sitem;
  selectedFile: Sfile;
  items: { [id: string]: Sitem; } = {};
  parents: { [id: string]: Sfolder; } = {};

  ngOnInit(): void {
    this.loadItems(this.project);
  }

  loadItems(item:Sitem): void {
    this.items[item.id] = item;
    if (item.discriminator == 0) {
      let folder = item as Sfolder;
      folder.sitems.forEach(o => {
        this.loadItems(o);
        this.parents[o.id] = folder;
      });
    }
  }

  onSelected(id: string): void {
    let item = this.items[id];
    this.selectedItem = item;
    if (item.discriminator === 1) {
      let file = item as Sfile;
      this.selectedFile = file;
      this.onFileSelected.emit(file);
    } else {
      let folder = item as Sfolder;
      this.selectedFile = null;
      this.onFolderSelected.emit(folder);
    }
  }

  onCreated(result: any): void {
    let item: Sitem;
    if (result.isFolder) {
      item = new Sfolder();
      (item as Sfolder).sitems = [];
    } else {
      item = new Sfile();
      (item as Sfile).text = "";
    }
    item.id = result.id;
    item.name = result.name;
    item.notes = [];
    let parent = this.items[result.parentId] as Sfolder;
    parent.sitems.filter(o => o.index >= result.index).forEach(o => o.index++);
    parent.sitems.push(item);
    item.index = result.index;
    this.items[item.id] = item;
    this.parents[item.id] = parent;
  }

  onRenamed(name: string) {
    this.selectedItem.name = name;
  }

  setStructure(tree: Node): void {
    let folder = this.items[tree.id] as Sfolder;
    folder.sitems = [];
    let i = 0;
    tree.nodes.forEach(o => {
      let item = this.items[o.id];
      item.index = i++;
      folder.sitems.push(item);
      if (item.discriminator == 0) {
        this.setStructure(o);
      }
    });
  }

  onMoved(tree: Node): void {
    this.setStructure(tree);
  }

  onDeleted() {
    let id = this.selectedItem.id;
    let parent = this.parents[id] as Sfolder;
    let index = this.selectedItem.index;
    parent.sitems.splice(parent.sitems.findIndex(o => o.id === id), 1);
    parent.sitems.filter(o => o.index > index).forEach(o => o.index--);
    delete this.items[id];
    delete this.parents[id];
    this.selectedFile = null;
    this.selectedItem = null;
    this.onFileSelected.emit(null);
  }

  save(): void {
    this.onSaving.emit()
  }

}