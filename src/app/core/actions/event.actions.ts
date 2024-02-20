export namespace Events {
  export class Goal {
    static readonly type = '[Event] Goal';
    constructor(
      public number: number,
      public color: string,
      public time: string
    ) {}
  }

  export class Quarter {
    static readonly type = '[Event] Next Quart';
  }

  export class Timeout {
    static readonly type = '[Event] Timeout';
    constructor(public color: string, public time: string) {}
  }

  export class Card {
    static readonly type = '[Event] Card';
    constructor(
      public person: string,
      public color: string,
      public type: 'red' | 'yellow',
      public time: string
    ) {}
  }

  export class CapSwap {
    static readonly type = '[Event] Cap Swap';
    constructor(
      public number1: number,
      public number2: number,
      public color: string,
      public time: string
    ) {}
  }

  export class Exclusion {
    static readonly type = '[Event] Exclusion';
    constructor(
      public number: number,
      public color: string,
      public time: string
    ) {}
  }

  export class Brutality {
    static readonly type = '[Event] Brutality';
    constructor(
      public number: number,
      public color: string,
      public time: string
    ) {}
  }
}
