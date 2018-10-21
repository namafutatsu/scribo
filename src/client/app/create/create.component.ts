import { Component, OnInit, Injectable, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlatTreeControl } from '@angular/cdk/tree';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

import { AuthService } from '../services/auth.service';
import { Project } from '../shared/models';
import { ProjectService } from '../services/project.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';

export interface Type {
  value: number;
  label: string;
}

export class FileNode {
  children: FileNode[];
  filename: string;
  type: any;
}

export class FileFlatNode {
  constructor(
    public expandable: boolean, public filename: string, public level: number, public type: any) {}
}

//#region Trees

const longTree = JSON.stringify({
  Novel: {
    Chapter_1: {
      Section_1: {
        Scene_1: 'Scene 1',
        Scene_2: 'Scene 2'
      },
      Section_2: {
        Scene_1: 'Scene 1',
        Scene_2: 'Scene 2',
        Scene_3: 'Scene 3'
      }
    },
    Chapter_2: {
      Section_1: '...'
    }
  },
});

const longWithPartsTree = JSON.stringify({
  Novel: {
    Part_1: {
      Chapter_1: {
        Section_1: {
          Scene_1: 'Scene 1',
          Scene_2: 'Scene 2'
        },
        Section_2: {
          Scene_1: 'Scene 1',
          Scene_2: 'Scene 2',
          Scene_3: 'Scene 3'
        }
      },
      Chapter_2: {
        Section_1: '...'
      }
    },
    Part_2: {
      Chapter_1: '...'
    }
  }
});

const mediumTree = JSON.stringify({
  Novel: {
    Chapter_1: {
      Scene_1: 'Scene 1',
      Scene_2: 'Scene 2',
      Scene_3: 'Scene 3'
    },
    Chapter_2: {
      Scene_1: '...'
    }
  }
});

const mediumWithPartsTree = JSON.stringify({
  Novel: {
    Part_1: {
      Chapter_1: {
        Scene_1: 'Scene 1',
        Scene_2: 'Scene 2',
        Scene_3: 'Scene 3'
      },
      Chapter_2: {
        Scene_1: '...'
      }
    },
    Part_2: {
      Chapter_1: '...'
    }
  }
});

const shortTree = JSON.stringify({
  Novel: {
    Chapter_1: 'Chapter 1',
    Chapter_2: 'Chapter 2',
    Chapter_3: 'Chapter 3',
    Chapter_4: '...',
  }
});

const shortWithPartsTree = JSON.stringify({
  Novel: {
    Part_1: {
      Chapter_1: 'Chapter 1',
      Chapter_2: 'Chapter 2',
      Chapter_3: 'Chapter 3'
    },
    Part_2: {
      Chapter_1: 'Chapter 1',
      Chapter_2: '...'
    }
  }
});

const novelFreeTree = JSON.stringify({
  Novel: {
    Directory_1: {
      Subdirectory_1: {
        File_1: 'File 1',
        File_2: 'File 2'
      },
      Subdirectory_2: {
        File_1: 'File 1',
        File_2: 'File 2',
        File_3: 'File 3'
      }
    },
    Directory_2: {
      Subdirectory_1: '...'
    }
  },
});

const oneShotTree = JSON.stringify({
  Story: {
    Scene_1: 'Scene 1',
    Scene_2: 'Scene 2',
    Scene_3: 'Scene 3',
    Scene_4: '...'
  }
});

const multiSectionTree = JSON.stringify({
  Story: {
    Section_1: {
      Scene_1: 'Scene 1',
      Scene_2: 'Scene 2'
    },
    Section_2: {
      Scene_1: 'Scene 1',
      Scene_2: 'Scene 2',
      Scene_3: 'Scene 3'
    },
    Section_3: '...'
  }
});

const storyFreeTree = JSON.stringify({
  Story: {
    Directory_1: {
      Subdirectory_1: {
        File_1: 'File 1',
        File_2: 'File 2'
      },
      Subdirectory_2: {
        File_1: 'File 1',
        File_2: 'File 2',
        File_3: 'File 3'
      }
    },
    Directory_2: {
      Subdirectory_1: '...'
    }
  },
});

//#endregion

@Injectable()
export class FileDatabase {
  dataChange = new BehaviorSubject<FileNode[]>([]);
  get data(): FileNode[] { return this.dataChange.value; }

  constructor() {
    this.initialize(shortTree);
  }

  initialize(treeData: string) {
    const dataObject = JSON.parse(treeData);
    const data = this.buildFileTree(dataObject, 0);
    this.dataChange.next(data);
  }

  buildFileTree(obj: any, level: number): FileNode[] {
    return Object.keys(obj).reduce<FileNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new FileNode();
      node.filename = key;
      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.type = value;
        }
      }
      return accumulator.concat(node);
    }, []);
  }
}

@Component({
  moduleId: module.id,
  selector: 'sd-create',
  templateUrl: 'create.component.html',
  styleUrls: ['create.component.css'],
  providers: [FileDatabase]
})
export class CreateComponent implements OnInit, AfterViewInit {
  isLoading = false;
  creation = false;
  Name: string;
  Types: Type[] = [
    { value: 0, label: 'Novel' },
    { value: 1, label: 'Short story' }
  ];
  styleIndex = 0;
  treeControl: FlatTreeControl<FileFlatNode>;
  treeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;
  dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;
  nodeNames: { [id: string]: string; } = {
    'Novel': 'Novel',
    'Story': 'Story',
    'Part_1': 'Part 1',
    'Part_2': 'Part 2',
    'Chapter_1': 'Chapter 1',
    'Chapter_2': 'Chapter 2',
    'Chapter_3': 'Chapter 3',
    'Section_1': 'Section 1',
    'Section_2': 'Section 2',
    'Directory_1': 'Directory 1',
    'Directory_2': 'Directory 2',
    'Subdirectory_1': 'Subdirectory 1',
    'Subdirectory_2': 'Subdirectory 2',
  };
  withParts = false;
  withSections = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    public auth: AuthService,
    public toast: ToastComponent,
    public database: FileDatabase,
    private _formBuilder: FormBuilder
  ) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
      this._isExpandable, this._getChildren);
    this.treeControl = new FlatTreeControl<FileFlatNode>(this._getLevel, this._isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    database.dataChange.subscribe(data => this.dataSource.data = data);
  }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl1: ['', Validators.required],
      firstCtrl2: ['', Validators.required],
      firstCtrl3: ['']
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['']
    });
  }

  ngAfterViewInit(): void {
    this.treeControl.expandAll();
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    this.styleIndex = tabChangeEvent.index;
    this.reloadTree();
  }

  onCheckboxChanged(event: any, index: number) {
    this.reloadTree();
  }

  getStructure(): string[] {
    if (this.firstFormGroup.value.firstCtrl2 === 0) {
      if (this.styleIndex === 0) {
        if (this.secondFormGroup.value.secondCtrl) {
          return ['Part', 'Chapter'];
        } else {
          return ['Chapter'];
        }
      } else if (this.styleIndex === 1) {
        if (this.secondFormGroup.value.secondCtrl) {
          return ['Part', 'Chapter', 'Scene'];
        } else {
          return ['Chapter', 'Scene'];
        }
      } else if (this.styleIndex === 2) {
        if (this.secondFormGroup.value.secondCtrl) {
          return ['Part', 'Chapter', 'Section', 'Scene'];
        } else {
          return ['Chapter', 'Section', 'Scene'];
        }
      }
    } else {
      if (this.styleIndex === 0) {
        return ['Scene'];
      } else if (this.styleIndex === 1) {
        return ['Section', 'Scene'];
      }
    }
    return [];
  }

  reloadTree = () => {
    if (this.firstFormGroup.value.firstCtrl2 === 0) {
      if (this.styleIndex === 0) {
        if (this.secondFormGroup.value.secondCtrl) {
          this.database.initialize(shortWithPartsTree);
        } else {
          this.database.initialize(shortTree);
        }
      } else if (this.styleIndex === 1) {
        if (this.secondFormGroup.value.secondCtrl) {
          this.database.initialize(mediumWithPartsTree);
        } else {
          this.database.initialize(mediumTree);
        }
      } else if (this.styleIndex === 2) {
        if (this.secondFormGroup.value.secondCtrl) {
          this.database.initialize(longWithPartsTree);
        } else {
          this.database.initialize(longTree);
        }
      } else if (this.styleIndex === 3) {
        this.database.initialize(novelFreeTree);
      }
    } else {
      if (this.styleIndex === 0) {
        this.database.initialize(oneShotTree);
      } else if (this.styleIndex === 1) {
        this.database.initialize(multiSectionTree);
      } else if (this.styleIndex === 2) {
        this.database.initialize(storyFreeTree);
      }
    }
    this.treeControl.expandAll();
  }

  create() {
    const project = new Project();
    project.Name = this.firstFormGroup.value.firstCtrl1;
    project.Structure = this.getStructure();
    project.Type = this.firstFormGroup.value.firstCtrl2;
    project.Description = this.firstFormGroup.value.firstCtrl3;
    this.isLoading = true;
    this.projectService.insert(project).then(res => {
      this.toast.setMessage('New project created', 'success');
      this.router.navigate(['/project', project.Name]);
    });
  }

  transformer = (node: FileNode, level: number) => {
    return new FileFlatNode(!!node.children, node.filename, level, node.type);
  }

  hasChild = (_: number, _nodeData: FileFlatNode) => _nodeData.expandable;

  private _getLevel = (node: FileFlatNode) => node.level;

  private _isExpandable = (node: FileFlatNode) => node.expandable;

  private _getChildren = (node: FileNode): Observable<FileNode[]> => observableOf(node.children);

}
