import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { UUID } from 'angular2-uuid';

import { AuthedService, AuthService } from './auth.service';
import { Command } from '../shared/models';

@Injectable()
export class CommandService extends AuthedService {
  protected controller = 'Command';
  private requests$ = new Subject<any>();
  private queue: Command[] = [];
  private order = 0;

  constructor(protected auth: AuthService) {
    super(auth);
    this.requests$.subscribe(request => this.execute(request));
  }

  pending(): boolean {
    return this.queue.length > 0;
  }

  add(command: Command): Subject<any> {
    if (this.pending() && command.Type === 3) {
      const lastCommand = this.queue[this.queue.length - 1];
      if (lastCommand.Type === 3 && lastCommand.Key === command.Key) {
        return null;
      }
    }
    command.CommandKey = UUID.UUID();
    command.order = this.order++;
    command.Done = false;
    command.subscription = new Subject<any>();
    this.queue.push(command);
    if (this.queue.length === 1) {
      this.startNextCommand();
    }
    return command.subscription;
  }

  private execute(command: Command) {
    this._post<Command>('Post', command)
      .subscribe((res: Command) => {
        const sub = command.subscription;
        sub.next(res);
        this.queue.shift();
        this.startNextCommand();
      });
  }

  private startNextCommand() {
    if (this.queue.length > 0) {
      this.execute(this.queue[0]);
    }
  }
}
