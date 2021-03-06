import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { STreeNode } from '../../shared/models';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'sd-editor',
  templateUrl: 'editor.component.html',
  styleUrls: ['editor.component.css']
})
export class EditorComponent implements OnInit {
  @Input() texts: { [key: string]: string; };
  @Input() file: STreeNode;
  @Output() saving = new EventEmitter();
  @Output() changed = new EventEmitter();
  buttons = [
    'bold',
    'italic',
    'underline',
    'paragraphFormat',
    'specialCharacters',
    'align',
    'print',
    // 'fullscreen',
    'undo',
    'redo',
    'alert',
    'save'
  ];
  options: Object = {
    charCounterCount: true,
    theme: 'scribo',
    tooltips: false,
    // height:'750',
    inlineMode: false,
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
      // 'fullscreen',
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
      'save',
      // 'table',
      // 'url',
      // 'video',
      'wordPaste',
      'specialCharacters',
      'wordPaste',
      'print'
    ],
    // shortcutsEnabled: [
    //   'show',
    //   'bold',
    //   'italic',
    //   'underline',
    //   // 'strikeThrough',
    //   'indent',
    //   'outdent',
    //   'undo',
    //   'redo',
    //   // 'insertImage',
    //   'createLink','paragraphFormat'
    // ],
    toolbarButtons: this.buttons,
    toolbarButtonsSM: this.buttons,
    toolbarButtonsMD: this.buttons,
    toolbarButtonsXS: this.buttons,
    events : {
      'froalaEditor.save.before' : (e: any, editor: any) => {
        e.stopPropagation();
        this.save();
      },
      'froalaEditor.contentChanged' : (e: any, editor: any) => {
        if (this.file) {
          this.file.changed = true;
        }
      }
    },
    toolbarStickyOffset: 48
  };

  save() {
    this.saving.emit();
  }

  ngOnInit() {
    $.FroalaEditor.RegisterShortcut(83, 'save');
  }
}
