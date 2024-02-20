import { Player, StateModel } from './models';

export class Utils {
  static newPlayer(name: string, number: number): Player {
    return {
      playerId: crypto.randomUUID(),
      number: number,
      name: name,
      // f1: '',
      // f2: '',
      // f3: '',
      // q1: 0,
      // q2: 0,
      // q3: 0,
      // q4: 0,
      // q5: 0,
      // total: 0,
    } as Player;
  }

  static emptyTeam(): Player[] {
    const team: Player[] = [];
    for (let i = 1; i <= 20; i++) {
      team.push(this.newPlayer('', i));
    }
    return team;
  }

  static emptyGame(): StateModel {
    return {
      home: {
        teamId: crypto.randomUUID(),
        name: '',
        coach: '',
        assistant1: '',
        assistant2: '',
        players: Utils.emptyTeam(),
        timeouts: [],
        capChanges: [],
        cards: [],
      },
      away: {
        teamId: crypto.randomUUID(),
        name: '',
        coach: '',
        assistant1: '',
        assistant2: '',
        players: Utils.emptyTeam(),
        timeouts: [],
        capChanges: [],
        cards: [],
      },
      info: {
        gameId: crypto.randomUUID(),
        gameNumber: '',
        lightScore: 0,
        darkScore: 0,
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
    } as StateModel;
  }
}
