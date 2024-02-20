export namespace Information {
  export class UpdateGameNumber {
    static readonly type = '[Info] Update Game Number';
    constructor(public gameNumber: string) {}
  }
  export class UpdateLocation {
    static readonly type = '[Info] Update Location';
    constructor(public location: string) {}
  }
  export class UpdateLeague {
    static readonly type = '[Info] Update League';
    constructor(public league: string) {}
  }
  export class UpdateCategory {
    static readonly type = '[Info] Update Category';
    constructor(public category: string) {}
  }
  export class UpdateDate {
    static readonly type = '[Info] Update Date';
    constructor(public date: Date) {}
  }
  export class UpdateStartTime {
    static readonly type = '[Info] Update Start Time';
    constructor(public startTime: string) {}
  }
}
