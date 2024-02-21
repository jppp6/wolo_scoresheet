import { StateModel } from '../utils/models';

export namespace Game {
    export class New {
        static readonly type = '[Game] New';
    }

    export class Upsert {
        static readonly type = '[Game] Upsert';
    }

    export class Patch {
        static readonly type = '[Game] Patch';
        constructor(public gameModel: StateModel) {}
    }
}
