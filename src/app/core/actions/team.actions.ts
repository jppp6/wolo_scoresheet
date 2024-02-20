import { Player } from '../utils/models';

export namespace Team {
  export class Create {
    static readonly type = '[Team] Create';
  }

  export class GetAll {
    static readonly type = '[Team] Get All';
  }

  export class GetOne {
    static readonly type = '[Team] Get One';
    constructor(public teamId: string) {}
  }

  export class Delete {
    static readonly type = '[Team] Delete';
  }
  export class UpdateTeamName {
    static readonly type = '[Team] Update Team Name';
    constructor(public color: 'home' | 'away', public value: string) {}
  }

  export class UpdateCoach {
    static readonly type = '[Team] Update Coach';
    constructor(public color: 'home' | 'away', public value: string) {}
  }
  export class UpdateAssistant1 {
    static readonly type = '[Team] Update Assistant 1';
    constructor(public color: 'home' | 'away', public value: string) {}
  }

  export class UpdateAssistant2 {
    static readonly type = '[Team] Update Assistant 2';
    constructor(public color: 'home' | 'away', public value: string) {}
  }

  export class UpdatePlayers {
    static readonly type = '[Team] Update Players';
    constructor(public color: 'home' | 'away', public value: Player[]) {}
  }
}
