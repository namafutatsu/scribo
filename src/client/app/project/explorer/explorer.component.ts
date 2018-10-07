import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Project, Sitem, Sfile, Sfolder } from '../../shared/models';
import { Node } from './explorer.models';

@Component({
  moduleId: module.id,
  selector: 'sd-explorer',
  templateUrl: 'explorer.component.html',
  styleUrls: ['explorer.component.css']
})
export class ExplorerComponent implements OnInit {
  @Input() project: Project;
  @Output() fileSelected = new EventEmitter<Sfile>();
  @Output() folderSelected = new EventEmitter<Sfolder>();
  @Output() saving = new EventEmitter();
  @Output() toggling = new EventEmitter();

  loading = false;
  selectedItem: Sitem;
  selectedFile: Sfile;
  items: { [id: string]: Sitem; } = {};
  parents: { [id: string]: Sfolder; } = {};

  ngOnInit(): void {
    this.loadItems(this.project);
  }

  loadItems(item: Sitem): void {
    this.items[item.Key] = item;
    if (item.Discriminator === 0) {
      const folder = item as Sfolder;
      folder.Items.sort(o => o.Index).forEach(o => {
        this.loadItems(o);
        this.parents[o.Key] = folder;
      });
    }
  }

  onSelected(id: string): void {
    const item = this.items[id];
    this.selectedItem = item;
    if (item.Discriminator === 1) {
      const file = item as Sfile;
      this.selectedFile = file;
      this.fileSelected.emit(file);
    } else {
      const folder = item as Sfolder;
      this.selectedFile = null;
      this.folderSelected.emit(folder);
    }
  }

  onCreated(result: any): void {
    let item: Sitem;
    if (result.isFolder) {
      item = new Sfolder();
      (item as Sfolder).Items = [];
    } else {
      item = new Sfile();
      (item as Sfile).Text = '';
    }
    item.Key = result.id;
    item.Name = result.Name;
    item.notes = [];
    const parent = this.items[result.parentId] as Sfolder;
    parent.Items.filter(o => o.Index >= result.Index).forEach(o => o.Index++);
    parent.Items.push(item);
    item.Index = result.Index;
    this.items[item.Key] = item;
    this.parents[item.Key] = parent;
  }

  onRenamed(Name: string) {
    this.selectedItem.Name = Name;
  }

  setStructure(tree: Node): void {
    const folder = this.items[tree.id] as Sfolder;
    folder.Items = [];
    let i = 0;
    tree.nodes.forEach(o => {
      const item = this.items[o.id];
      item.Index = i++;
      folder.Items.push(item);
      if (item.Discriminator === 0) {
        this.setStructure(o);
      }
    });
  }

  onMoved(tree: Node): void {
    this.setStructure(tree);
  }

  onDeleted() {
    const id = this.selectedItem.Key;
    const parent = this.parents[id] as Sfolder;
    const Index = this.selectedItem.Index;
    parent.Items.splice(parent.Items.findIndex(o => o.Key === id), 1);
    parent.Items.filter(o => o.Index > Index).forEach(o => o.Index--);
    delete this.items[id];
    delete this.parents[id];
    this.selectedFile = null;
    this.selectedItem = null;
    this.fileSelected.emit(null);
  }

  save(): void {
    this.saving.emit();
  }


  toggle(): void {
    this.toggling.emit();
  }
}
