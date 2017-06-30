import { Component, Input } from '@angular/core';

import { Sfile } from '../../shared/models';

@Component({
  moduleId: module.id,
  selector: 'editor',
  templateUrl: 'editor.component.html',
})
export class EditorComponent {
  @Input() file: Sfile;
  buttons = [
    'bold',
    'italic',
    'underline',
    'specialCharacters',
    'paragraphFormat',
    'align',
    'print',
    'fullscreen',
    'undo',
    'redo',
    'alert'
  ];
  options: Object = {
    charCounterCount: true,
    theme:'scribo',
    tooltips: false,
    // height:'750',
    inlineMode:false,
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
      'fullscreen',
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
      // 'save',
      // 'table',
      // 'url',
      // 'video',
      'wordPaste',
      'specialCharacters',
      'wordPaste',
      'print'
    ],

    toolbarButtons: this.buttons,
    toolbarButtonsSM: this.buttons,
    toolbarButtonsMD: this.buttons,
    toolbarButtonsXS: this.buttons,
  };
}