import { Player, StateModel } from './models';

export class Utils {
    static snackCaseToCamelCase(input: any): any {
        if (typeof input !== 'object' || input === null) {
            return input; // return as is if not an object
        }

        if (Array.isArray(input)) {
            return input.map((item) => this.snackCaseToCamelCase(item)); // handle arrays
        } else {
            const camelCasedObject: any = {};
            for (const key in input) {
                if (input.hasOwnProperty(key)) {
                    const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) =>
                        letter.toUpperCase()
                    );
                    camelCasedObject[camelCaseKey] = this.snackCaseToCamelCase(
                        input[key]
                    );
                }
            }
            return camelCasedObject;
        }
    }

    static newPlayer(name: string, number: string): Player {
        return {
            number: number,
            name: name,
            f1: '',
            f2: '',
            f3: '',
            q1: 0,
            q2: 0,
            q3: 0,
            q4: 0,
            q5: 0,
            total: 0,
        } as Player;
    }

    static emptyTeam(): Player[] {
        const team: Player[] = [];
        for (let i = 1; i <= 20; i++) {
            team.push(this.newPlayer('', i.toString()));
        }
        return team;
    }

    static emptyGame(): StateModel {
        return {
            gameId: crypto.randomUUID(),
            lastUpdated: new Date(),
            saved: false,
            home: {
                teamId: crypto.randomUUID(),
                teamName: '',
                coach: '',
                assistant1: '',
                assistant2: '',
                players: Utils.emptyTeam(),
                timeouts: [],
                capSwaps: [],
                cards: [],
                lastUpdated: new Date(),
                saved: false,
            },
            away: {
                teamId: crypto.randomUUID(),
                teamName: '',
                coach: '',
                assistant1: '',
                assistant2: '',
                players: Utils.emptyTeam(),
                timeouts: [],
                capSwaps: [],
                cards: [],
                lastUpdated: new Date(),
                saved: false,
            },
            info: {
                infoId: crypto.randomUUID(),
                gameNumber: '',
                homeScore: 0,
                awayScore: 0,
                quarter: 1,
                location: '',
                startTime: '',
                endTime: '',
                date: new Date(),
                league: '',
                category: '',
                referee1: '',
                referee2: '',
                delegate1: '',
                delegate2: '',
                events: [],
            },
        };
    }
}
