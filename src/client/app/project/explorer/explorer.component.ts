import { Component, Input, Output, EventEmitter } from '@angular/core';

import { CommandService } from '../../services/command.service';
import { Command, STreeNode } from '../../shared/models';

@Component({
  moduleId: module.id,
  selector: 'sd-explorer',
  templateUrl: 'explorer.component.html',
  styleUrls: ['explorer.component.css']
})
export class ExplorerComponent {
  @Input() project: STreeNode[];
  @Output() fileSelected = new EventEmitter<STreeNode>();
  @Output() folderSelected = new EventEmitter<STreeNode>();
  @Output() saving = new EventEmitter();

  loading = false;

  constructor(
    public commandService: CommandService
  ) {}

  onSelected(node: STreeNode): void {
    if (node) {
      if (node.droppable) {
        this.folderSelected.emit(node);
      } else {
        this.fileSelected.emit(node);
      }
    }
  }

  getCommand(node: STreeNode, type: number): Command {
    const command = new Command();
    command.Key = node.Key;
    command.Index = node.Index;
    command.Path = node.Path;
    command.Type = type;
    command.Discriminator = node.droppable ? 0 : 1;
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

  save(): void {
    this.saving.emit();
  }
}
