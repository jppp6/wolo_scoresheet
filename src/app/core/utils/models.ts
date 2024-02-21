export interface StateModel {
    gameId: string;
    lastUpdated: Date;
    saved: boolean;
    home: TeamModel;
    away: TeamModel;
    info: InfoModel;
}

export interface TeamModel {
    teamId: string;
    teamName: string;
    coach: string;
    assistant1: string;
    assistant2: string;
    players: Player[];
    timeouts: string[];
    capSwaps: string[];
    cards: string[];
    lastUpdated: Date;
    saved: boolean;
}

export interface StoredTeamModel {
    teamId: string;
    teamName: string;
    coach: string;
    assistant1: string;
    assistant2: string;
    players: { number: string; name: string }[];
    lastUpdated: Date;
}

export interface InfoModel {
    infoId: string;
    gameNumber: string;
    homeScore: number;
    awayScore: number;
    quarter: number;
    location: string;
    startTime: string;
    endTime: string;
    date: Date;
    league: string;
    category: string;
    referee1: string;
    referee2: string;
    delegate1: string;
    delegate2: string;
    events: EventsModel[];
}

export interface EventsModel {
    eventId: number;
    number: string;
    teamColor: string;
    incident: string;
    time: string;
    homeScore: number;
    awayScore: number;
}

export interface Player {
    number: string;
    name: string;
    f1: string;
    f2: string;
    f3: string;
    q1: number;
    q2: number;
    q3: number;
    q4: number;
    q5: number;
    total: number;
}
