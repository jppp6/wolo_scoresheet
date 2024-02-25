import { v4 as uuidv4 } from 'uuid';
import { InfoModel, Player, StateModel, TeamModel } from './models';

export class Utils {
    static isValidUUIDV4(uuid: string): boolean {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            uuid
        );
    }

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

    static emptyPlayer(name: string, number: string): Player {
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

    static emptyPlayers(): Player[] {
        const team: Player[] = [];
        for (let i = 1; i <= 20; i++) {
            team.push(this.emptyPlayer('', i.toString()));
        }
        return team;
    }

    static emptyTeam(): TeamModel {
        return {
            teamId: uuidv4(),
            teamName: '',
            coach: '',
            assistant1: '',
            assistant2: '',
            players: Utils.emptyPlayers(),
            timeouts: [],
            capSwaps: [],
            cards: [],
            lastUpdated: new Date(),
            saved: false,
        };
    }

    static emptyInfo(): InfoModel {
        return {
            infoId: uuidv4(),
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
        };
    }

    static emptyGame(): StateModel {
        return {
            gameId: uuidv4(),
            lastUpdated: new Date(),
            saved: false,
            home: Utils.emptyTeam(),
            away: Utils.emptyTeam(),
            info: Utils.emptyInfo(),
        };
    }
}
