import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Project, Sitem, Sfile, Sfolder } from '../../shared/models';

@Component({
  selector: 'explorer',
  template: `
  <div id="toolbar">
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
    <button (click)="treeview.delete()" [disabled]="!selectedItem">
      <i class="fa fa-trash-o" aria-hidden="true"></i>
    </button>   
  </div>
  <br/><br/>
  <treeview #treeview [project]="project"
          (onSelected)="onSelected($event)"
          (onCreated)="onCreated($event)"
          (onRenamed)="onRenamed($event)"
          (onDeleted)="onDeleted($event)"
          (onMoved)="onMoved($event)"
          ></treeview>`,
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
  ids: { [id: string]: Sitem; } = {};

  ngOnInit(): void {
    this.loadIds(this.project);
  }

  loadIds(item:Sitem): void {
    this.ids[item.id] = item;
    if (item.discriminator == 0) {
      (item as Sfolder).sitems.forEach(o => this.loadIds(o));
    }
  }

  onSelected(id: string): void {
    let item = this.ids[id];
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



  // public onNodeMoved(e: any): void {
  //   let id = e.node.node.id;
  //   let previousParentId = e.previousParent.node.id;
  //   let item = this.ids[id];
  //   let parentId = e.node.parent.node.id;
  //   let parent = this.ids[parentId] as Sfolder;
  //   let index = e.node.positionInParent;
  //   let previousIndex = item.index;
  //   if (previousParentId !== parentId) {
  //     let previousParent = this.ids[previousParentId] as Sfolder;
  //     this.remove(previousParent, item);
  //     this.add(parent, item);
  //     previousParent.sitems.filter(o => o.index > previousIndex).forEach(o => o.index--);
  //     parent.sitems.filter(o => o.index >= index).forEach(o => o.index++);
  //   } else {
  //     parent.sitems.find(o => o.index === index).index = previousIndex;
  //   }
  //   item.index = index;
  // }

  // public remove(parent: Sfolder, item: Sitem) {
  //   let index = parent.sitems.indexOf(item);
  //   if (index > -1)
  //     parent.sitems.splice(index, 1);
  // }

  // public add(parent: Sfolder, item:Sitem) {
  //   parent.sitems.push(item);
  // }

  public onMoved(result: any): void {
    let id = result.id;
    let parentId = result.parentId;
    let index = result.index;
    let previousParentId = result.previousParentId;
    let item = this.ids[id];
    let parent = this.ids[parentId] as Sfolder;
    let previousIndex = item.index;
    if (previousParentId !== parentId) {
      let previousParent = this.ids[previousParentId] as Sfolder;
      previousParent.sitems.splice(previousIndex, 1);
      previousParent.sitems.filter(o => o.index > previousIndex).forEach(o => o.index--);
      parent.sitems.push(item);
      parent.sitems.filter(o => o.index >= index).forEach(o => o.index++);
    } else {
      parent.sitems.find(o => o.index === index).index = previousIndex;
    }
    item.index = index;
  }

  public onCreated(result: any): void {
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
    item.index = result.index;
    item.notes = [];
    (this.ids[result.parentId] as Sfolder).sitems.push(item);
    this.ids[item.id] = item;
  }

  public onRenamed(name: string) {
    this.selectedItem.name = name;
  }

  public onDeleted(parentId: string) {
    let id = this.selectedItem.id;
    delete this.ids[id];
    let parent = this.ids[parentId] as Sfolder;
    let index = this.selectedItem.index;
    parent.sitems.filter(o => o.index > index).forEach(o => o.index--);
    parent.sitems.splice(parent.sitems.findIndex(o => o.id === id), 1);
    this.selectedFile = undefined;
    this.selectedItem = undefined;
    this.onFileSelected.emit(null);
  }

  public save(): void {
    this.onSaving.emit()
  }

}