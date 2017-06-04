export class Project {
  id: string;
  key: string;
  name: string;
  sitems: Sitem[];
}

export abstract class Sitem {
  discriminator: number;
  id: string;
  index: number;
  name: string;
}

export class Sfolder extends Sitem {
  discriminator: number = 0;
  sfiles: Sfile[];
  open: boolean = false;
}

export class Sfile extends Sitem {
  discriminator: number = 1;
  text: string;
}