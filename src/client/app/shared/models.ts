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
  id: string;
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
}

export class Project extends Sfolder {
  Discriminator = 0;
  Id: string;
  key: string;
  Name: string;
}

export class User {
  Id: string;
  Username: string;
  Mail: string;
  Password: string;
}
