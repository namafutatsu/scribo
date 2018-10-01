// import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// import { Project, Sitem, Sfile, Sfolder } from '../../shared/models';
// import { Node } from './explorer.models';

// @Component({
//   moduleId: module.id,
//   selector: 'sd-explorer',
//   templateUrl: 'explorer.component.html',
//   styleUrls: ['explorer.component.css']
// })
// export class ExplorerComponent implements OnInit {
//   @Input() project: Project;
//   @Output() fileSelected = new EventEmitter<Sfile>();
//   @Output() folderSelected = new EventEmitter<Sfolder>();
//   @Output() saving = new EventEmitter();
//   @Output() toggling = new EventEmitter();

//   loading = false;
//   selectedItem: Sitem;
//   selectedFile: Sfile;
//   items: { [id: string]: Sitem; } = {};
//   parents: { [id: string]: Sfolder; } = {};

//   ngOnInit(): void {
//     this.loadItems(this.project);
//   }

//   loadItems(item: Sitem): void {
//     this.items[item.id] = item;
//     if (item.discriminator === 0) {
//       const folder = item as Sfolder;
//       folder.sitems.sort(o => o.index).forEach(o => {
//         this.loadItems(o);
//         this.parents[o.id] = folder;
//       });
//     }
//   }

//   onSelected(id: string): void {
//     const item = this.items[id];
//     this.selectedItem = item;
//     if (item.discriminator === 1) {
//       const file = item as Sfile;
//       this.selectedFile = file;
//       this.fileSelected.emit(file);
//     } else {
//       const folder = item as Sfolder;
//       this.selectedFile = null;
//       this.folderSelected.emit(folder);
//     }
//   }

//   onCreated(result: any): void {
//     let item: Sitem;
//     if (result.isFolder) {
//       item = new Sfolder();
//       (item as Sfolder).sitems = [];
//     } else {
//       item = new Sfile();
//       (item as Sfile).text = '';
//     }
//     item.id = result.id;
//     item.name = result.name;
//     item.notes = [];
//     const parent = this.items[result.parentId] as Sfolder;
//     parent.sitems.filter(o => o.index >= result.index).forEach(o => o.index++);
//     parent.sitems.push(item);
//     item.index = result.index;
//     this.items[item.id] = item;
//     this.parents[item.id] = parent;
//   }

//   onRenamed(name: string) {
//     this.selectedItem.name = name;
//   }

//   setStructure(tree: Node): void {
//     const folder = this.items[tree.id] as Sfolder;
//     folder.sitems = [];
//     let i = 0;
//     tree.nodes.forEach(o => {
//       const item = this.items[o.id];
//       item.index = i++;
//       folder.sitems.push(item);
//       if (item.discriminator === 0) {
//         this.setStructure(o);
//       }
//     });
//   }

//   onMoved(tree: Node): void {
//     this.setStructure(tree);
//   }

//   onDeleted() {
//     const id = this.selectedItem.id;
//     const parent = this.parents[id] as Sfolder;
//     const index = this.selectedItem.index;
//     parent.sitems.splice(parent.sitems.findIndex(o => o.id === id), 1);
//     parent.sitems.filter(o => o.index > index).forEach(o => o.index--);
//     delete this.items[id];
//     delete this.parents[id];
//     this.selectedFile = null;
//     this.selectedItem = null;
//     this.fileSelected.emit(null);
//   }

//   save(): void {
//     this.saving.emit();
//   }


//   toggle(): void {
//     this.toggling.emit();
//   }
// }
