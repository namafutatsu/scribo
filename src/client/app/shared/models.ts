import { Subject } from 'rxjs';
import { TreeNode } from 'primeng/api';

export enum noteStatus {
  Cancelled = -1,
  Todo,
  Done
}

export class Note {
  id: string;
  Index: number;
  Text: string;
  status: noteStatus;
}

export class Project {
  key: string;
  Name: string;
  Type: number;
  Structure: string[];
  Description: string;
  Index: number;
}

export class User {
  Id: string;
  Username: string;
  Mail: string;
  Password: string;
}

export class STreeNode implements TreeNode {
  // Common
  Key: string;
  ParentKey: string;
  Index?: number;
  Path: string;
  Level: number;
  // Project
  Structure?: string[];
  Description?: string;
  Type?: number;
  Intern: boolean;
  // Commands
  newPath?: string;
  newIndex?: number;
  changed: boolean;
  // Heritage
  label?: string;
  data?: any;
  icon?: any;
  expandedIcon?: any;
  collapsedIcon?: any;
  children?: TreeNode[];
  IsLeaf?: boolean;
  expanded?: boolean;
  type?: string;
  parent?: TreeNode;
  partialSelected?: boolean;
  styleClass?: string;
  draggable?: boolean;
  droppable?: boolean;
  selectable?: boolean;
}

export class Command {
  Type: number;
  Key: string;
  CommandKey: string;
  Path: string;
  MoveToPath?: string;
  Index: number;
  MoveToIndex?: number;
  Discriminator: number;
  Text: string;
  order: number;
  subscription: Subject<any>;
}
