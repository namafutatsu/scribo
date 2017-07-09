import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'sd-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {
  @Input() message = { body: '', type: '' };

  setMessage(body: string, type: string, time = 3000) {
    this.message.body = body;
    this.message.type = type;
    setTimeout(() => { this.message.body = ''; }, time);
  }
}
