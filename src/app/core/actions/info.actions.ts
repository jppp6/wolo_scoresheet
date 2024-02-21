export namespace Info {
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

export namespace Events {
    export class Goal {
        static readonly type = '[Event] Goal';
        constructor(
            public number: string,
            public color: 'home' | 'away',
            public time: string
        ) {}
    }

    export class Quarter {
        static readonly type = '[Event] Next Quart';
    }

    export class Timeout {
        static readonly type = '[Event] Timeout';
        constructor(public color: 'home' | 'away', public time: string) {}
    }

    export class Card {
        static readonly type = '[Event] Card';
        constructor(
            public person: string,
            public color: 'home' | 'away',
            public type: 'red' | 'yellow',
            public time: string
        ) {}
    }

    export class CapSwap {
        static readonly type = '[Event] Cap Swap';
        constructor(
            public number1: string,
            public number2: string,
            public color: 'home' | 'away',
            public time: string
        ) {}
    }

    export class Exclusion {
        static readonly type = '[Event] Exclusion';
        constructor(
            public number: string,
            public color: 'home' | 'away',
            public time: string
        ) {}
    }

    export class Brutality {
        static readonly type = '[Event] Brutality';
        constructor(
            public number: string,
            public color: 'home' | 'away',
            public time: string
        ) {}
    }
}
