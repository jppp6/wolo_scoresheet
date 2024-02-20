export namespace Game {
  export class Create {
    static readonly type = '[Game] Create';
  }

  export class GetAll {
    static readonly type = '[Game] Get All';
  }

  export class GetOne {
    static readonly type = '[Game] Get One';
    constructor(public gameId: string) {}
  }

  export class Update {
    static readonly type = '[Game] Update';
  }

  export class Delete {
    static readonly type = '[Game] Delete';
  }

  export class Save {
    static readonly type = '[Game] Save';
  }
}
