import { Component, Input, Output, EventEmitter, HostListener, OnInit } from '@angular/core';

import { CommandService } from '../../services/command.service';
import { Command, STreeNode } from '../../shared/models';

@Component({
  moduleId: module.id,
  selector: 'sd-explorer',
  templateUrl: 'explorer.component.html',
  styleUrls: ['explorer.component.css']
})
export class ExplorerComponent implements OnInit {
  @Input() project: STreeNode;
  @Output() fileSelected = new EventEmitter<STreeNode>();
  @Output() folderSelected = new EventEmitter<STreeNode>();
  @Output() saving = new EventEmitter();
  @Output() renaming = new EventEmitter<any>();
  tree: STreeNode[];
  loading = false;

  ngOnInit(): void {
    this.tree = [this.project];
  }

  constructor(
    public commandService: CommandService
  ) {}

  @HostListener('window:beforeunload', ['$event'])
  public beforeunloadHandler($event: any) {
    if (this.commandService.pending()) {
      $event.returnValue = 'Changes you made may not be saved';
    }
  }

  onSelected(node: STreeNode): void {
    if (node) {
      if (!node.IsLeaf) {
        this.folderSelected.emit(node);
      } else {
        this.fileSelected.emit(node);
      }
    } else {
      this.fileSelected.emit(null);
    }
  }

  getCommand(node: STreeNode, type: number): Command {
    const command = new Command();
    command.Key = node.Key;
    command.Index = node.Index;
    command.Path = node.Path;
    command.Type = type;
    command.Discriminator = node.IsLeaf ? 1 : 0;
    return command;
  }

  onCreated(node: STreeNode): void {
    const command = this.getCommand(node, 0);
    this.commandService.add(command);
  }

  onMoved(node: STreeNode): void {
    const command = this.getCommand(node, 1);
    command.MoveToPath = node.newPath;
    command.MoveToIndex = node.newIndex;
    this.commandService.add(command);
  }

  onDeleted(node: STreeNode) {
    const command = this.getCommand(node, 2);
    this.commandService.add(command);
  }

  onRenaming(args: any) {
    this.renaming.emit(args);
  }

  save(): void {
    this.saving.emit();
  }
}
