export class Project {
  id: number;
  key: string;
  name: string;
  sitems: Sitem[];
}

export abstract class Sitem {
  id: number;
  index: number;
  name: string;
}

export class Sfolder extends Sitem {
  sfiles: Sfile[];
}

export class Sfile extends Sitem {
  text: string;
}