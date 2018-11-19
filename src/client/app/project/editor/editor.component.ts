import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'sd-editor',
  templateUrl: 'editor.component.html',
  styleUrls: ['editor.component.css']
})
export class EditorComponent implements OnInit {
  @Input() texts: { [key: string]: string; };
  @Input() key: string;
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
      'froalaEditor.save.before' : (e: any, editor: any) =>
        this.saving.emit()
      // 'froalaEditor.contentChanged' : (e: any, editor: any) => {
      //   if (!this.file.init) {
      //     this.file.init = true;
      //   }
      //   if (this.file.init && !this.file.changed) {
      //     this.changed.emit();
      //   }
      // }
    },
    toolbarStickyOffset: 48
  };

  ngOnInit(): void {
    $.FroalaEditor.RegisterShortcut(83, 'save');
  }
}
