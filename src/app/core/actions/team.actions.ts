import { Player, StoredTeamModel } from '../utils/models';

export namespace Team {
    export class Save {
        static readonly type = '[Team] Save';
        constructor(public color: 'home' | 'away') {}
    }

    export class Patch {
        static readonly type = '[Team] Patch Stored';
        constructor(
            public color: 'home' | 'away',
            public value: StoredTeamModel
        ) {}
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
