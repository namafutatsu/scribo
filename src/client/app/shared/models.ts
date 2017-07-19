export enum noteStatus {
  Cancelled = -1,
  Todo,
  Done
}

export class Note {
  id: string;
  index: number;
  text: string;
  status: noteStatus;
}

export abstract class Sitem {
  discriminator: number;
  id: string;
  index: number;
  name: string;
  notes: Note[];
}

export class Sfolder extends Sitem {
  discriminator: number = 0;
  sitems: Sitem[];
  open: boolean = false;
}

export class Sfile extends Sitem {
  discriminator: number = 1;
  text: string;
}

export class Project extends Sfolder {
  discriminator: number = 0;
  _id: string;
  id: string;
  key: string;
  name: string;
}

export class User {
  _id: string;
  username: string;
  email: string;
  password: string;
}
