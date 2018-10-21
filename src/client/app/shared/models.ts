import { TreeNode } from 'primeng/api';
import { Tree } from 'ng2-tree';
import { MenuItem } from 'primeng/api';

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

export abstract class Sitem {
  Discriminator: number;
  Key: string;
  Index: number;
  Name: string;
  notes: Note[];
}

export class Sfolder extends Sitem {
  Discriminator = 0;
  Items: Sitem[];
  open = false;
}

export class Sfile extends Sitem {
  Discriminator = 1;
  Text: string;
  init = false;
  changed = false;
}

export class Project extends Sfolder {
  Discriminator = 0;
  key: string;
  Name: string;
  Type: number;
  Structure: string[];
  Description: string;
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
  // FolderLabel: string;
  // FileLabel: string;
  Level: number;
  // Project
  Structure?: string[];
  Description?: string;
  Type?: number;
  // Heritage
  label?: string;
  data?: any;
  icon?: any;
  expandedIcon?: any;
  collapsedIcon?: any;
  children?: TreeNode[];
  leaf?: boolean;
  expanded?: boolean;
  type?: string;
  parent?: TreeNode;
  partialSelected?: boolean;
  styleClass?: string;
  draggable?: boolean;
  droppable?: boolean;
  selectable?: boolean;
}
