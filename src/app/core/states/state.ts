import { Injectable } from '@angular/core';
import {
    Action,
    Selector,
    State,
    StateContext,
    createSelector,
} from '@ngxs/store';
import { Session } from '@supabase/gotrue-js';
import { Game } from '../actions/game.actions';
import { Events, Info } from '../actions/info.actions';
import { Team } from '../actions/team.actions';
import { SupabaseService } from '../services/supabase.service';
import {
    EventsModel,
    InfoModel,
    Player,
    StateModel,
    TeamModel,
} from '../utils/models';
import { Utils } from '../utils/utils';

@State<StateModel>({
    name: 'wolo',
    defaults: Utils.emptyGame(),
})
@Injectable()
export class WoloState {
    session: Session | null = null;

    constructor(private readonly supabase: SupabaseService) {
        this.supabase.authChanges((_, session) => {
            this.session = session;
        });
    }

    @Selector()
    static gameSaved(state: StateModel): boolean {
        return state.saved;
    }

    @Selector()
    static selectInfo(state: StateModel): InfoModel {
        return state.info;
    }

    static selectTeam(team: 'home' | 'away') {
        return createSelector([WoloState], (state: StateModel): TeamModel => {
            return team === 'home' ? state.home : state.away;
        });
    }

    @Selector()
    static selectEvents(state: StateModel): EventsModel[] {
        return state.info.events;
    }

    @Selector()
    static gameScore(state: StateModel): string {
        if (state.info.quarter === 5) {
            return `OT: ${state.info.homeScore}-${state.info.awayScore}`;
        } else {
            return `Q${state.info.quarter}: ${state.info.homeScore}-${state.info.awayScore}`;
        }
    }

    // GAME ACTIONS
    @Action(Game.New)
    gameCreate(ctx: StateContext<StateModel>): void {
        ctx.patchState({ ...Utils.emptyGame() });
    }

    @Action(Game.GetOne)
    async gameGet(
        ctx: StateContext<StateModel>,
        { gameId }: Game.GetOne
    ): Promise<void> {
        const data = await this.supabase.getGame(gameId);
        if (data.length !== 1) {
            return;
        }
        const game = Utils.snackCaseToCamelCase(data) as StateModel[];
        ctx.patchState({ ...game[0] });
    }

    @Action(Game.Upsert)
    async gameUpsert(ctx: StateContext<StateModel>): Promise<void> {
        if (!this.session) {
            return;
        }
        const state = ctx.getState();
        const { error } = await this.supabase.upsertGame(
            this.session.user,
            state
        );
        if (error) {
            return;
        }
        ctx.setState({ ...state, saved: true });
    }

    @Action(Game.Patch)
    async gamePatch(
        ctx: StateContext<StateModel>,
        { gameModel }: Game.Patch
    ): Promise<void> {
        ctx.patchState({ ...gameModel });
    }

    // EVENTS ACTIONS
    @Action(Events.Goal)
    eventGoal(ctx: StateContext<StateModel>, p: Events.Goal): void {
        const state = ctx.getState();
        let h, a, players;

        if (p.color === 'home') {
            h = state.info.homeScore + 1;
            a = state.info.awayScore;
            players = state.home.players;
        } else {
            h = state.info.homeScore;
            a = state.info.awayScore + 1;
            players = state.away.players;
        }

        const updatedPlayers = players.map((player) => {
            if (player.number !== p.number) {
                return player;
            } else {
                const p = { ...player };
                if (state.info.quarter === 1) {
                    p.q1++;
                } else if (state.info.quarter === 2) {
                    p.q2++;
                } else if (state.info.quarter === 3) {
                    p.q3++;
                } else if (state.info.quarter === 4) {
                    p.q4++;
                } else if (state.info.quarter === 5) {
                    p.q5++;
                }
                return p;
            }
        });

        const goalEvent: EventsModel = {
            eventId: state.info.events.length,
            number: p.number,
            teamColor: p.color.toUpperCase(),
            incident: 'GOAL',
            time: p.time,
            homeScore: h,
            awayScore: a,
        };

        ctx.setState({
            ...state,
            saved: false,
            home: {
                ...state.home,
                players:
                    p.color === 'home' ? updatedPlayers : state.home.players,
            },
            away: {
                ...state.away,
                players:
                    p.color === 'away' ? updatedPlayers : state.away.players,
            },
            info: {
                ...state.info,
                homeScore: h,
                awayScore: a,
                events: [...state.info.events, goalEvent],
            },
        });
    }

    @Action(Events.Quarter)
    eventQuarter(ctx: StateContext<StateModel>): void {
        const state = ctx.getState();
        const q = state.info.quarter + 1;

        if (q === 5 && state.info.homeScore !== state.info.awayScore) {
            alert('OT is not possible, the score is not tied.');
            return;
        } else if (q === 6) {
            alert('You cannot go past OT');
            return;
        } else {
            const quarterEvent: EventsModel = {
                eventId: state.info.events.length,
                number: 'X',
                teamColor: 'X',
                incident: 'X',
                time: 'X',
                homeScore: state.info.homeScore,
                awayScore: state.info.awayScore,
            };

            ctx.setState({
                ...state,
                saved: false,
                info: {
                    ...state.info,
                    quarter: state.info.quarter + 1,
                    events: [...state.info.events, quarterEvent],
                },
            });
        }
    }

    @Action(Events.Timeout)
    eventTimeout(ctx: StateContext<StateModel>, p: Events.Timeout): void {
        const state = ctx.getState();

        const quarterEvent: EventsModel = {
            eventId: state.info.events.length,
            number: 'X',
            teamColor: p.color.toUpperCase(),
            incident: 'TIMEOUT',
            time: p.time,
            homeScore: state.info.homeScore,
            awayScore: state.info.awayScore,
        };

        const h: string[] = [...state.home.timeouts];
        const a: string[] = [...state.away.timeouts];
        if (p.color === 'home') {
            h.push(`Q${state.info.quarter} ${p.time}`);
        } else {
            a.push(`Q${state.info.quarter} ${p.time}`);
        }

        ctx.setState({
            ...state,
            saved: false,
            home: { ...state.home, timeouts: h },
            away: { ...state.away, timeouts: a },
            info: {
                ...state.info,
                events: [...state.info.events, quarterEvent],
            },
        });
    }

    @Action(Events.Card)
    eventCard(ctx: StateContext<StateModel>, p: Events.Card): void {
        const state = ctx.getState();

        const cardEvent: EventsModel = {
            eventId: state.info.events.length,
            number: p.person,
            teamColor: p.color.toUpperCase(),
            incident: p.type.toUpperCase() + ' CARD',
            time: p.time,
            homeScore: state.info.homeScore,
            awayScore: state.info.awayScore,
        };

        const h: string[] = [...state.home.cards];
        const a: string[] = [...state.away.cards];
        if (p.color === 'home') {
            h.push(`Q${state.info.quarter} ${p.time}: ${p.type}`);
        } else {
            a.push(`Q${state.info.quarter} ${p.time}: ${p.type}`);
        }

        ctx.setState({
            ...state,
            saved: false,
            home: { ...state.home, cards: h },
            away: { ...state.away, cards: a },
            info: {
                ...state.info,
                events: [...state.info.events, cardEvent],
            },
        });
    }

    @Action(Events.CapSwap)
    eventCapSwap(ctx: StateContext<StateModel>, p: Events.CapSwap): void {
        const state = ctx.getState();

        const capSwapEvent: EventsModel = {
            eventId: state.info.events.length,
            number: `#${p.number1} & #${p.number2}`,
            teamColor: p.color.toUpperCase(),
            incident: 'CAP SWAP',
            time: p.time,
            homeScore: state.info.homeScore,
            awayScore: state.info.awayScore,
        };

        const h: string[] = [...state.home.capSwaps];
        const a: string[] = [...state.away.capSwaps];
        if (p.color === 'home') {
            h.push(
                `Q${state.info.quarter} ${p.time}: #${p.number1} & #${p.number2}`
            );
        } else {
            a.push(
                `Q${state.info.quarter} ${p.time}: #${p.number1} & #${p.number2}`
            );
        }

        ctx.setState({
            ...state,
            saved: false,
            home: { ...state.home, capSwaps: h },
            away: { ...state.away, capSwaps: a },
            info: {
                ...state.info,
                events: [...state.info.events, capSwapEvent],
            },
        });
    }

    @Action(Events.Exclusion)
    eventExclusion(ctx: StateContext<StateModel>, p: Events.Exclusion): void {
        const state = ctx.getState();
        let players: Player[];

        if (p.color === 'home') {
            players = state.home.players;
        } else {
            players = state.away.players;
        }

        const updatedPlayers = players.map((player) => {
            if (player.number !== p.number) {
                return player;
            } else {
                const newPlayer = { ...player };
                if (newPlayer.f1 === '') {
                    newPlayer.f1 = `Q${state.info.quarter} ${p.time}`;
                } else if (newPlayer.f2 === '') {
                    newPlayer.f2 = `Q${state.info.quarter} ${p.time}`;
                } else if (newPlayer.f3 === '') {
                    newPlayer.f3 = `Q${state.info.quarter} ${p.time}`;
                }
                return newPlayer;
            }
        });
        const exclusionEvent: EventsModel = {
            eventId: state.info.events.length,
            number: p.number,
            teamColor: p.color.toUpperCase(),
            incident: 'EXCLUSION',
            time: p.time,
            homeScore: state.info.homeScore,
            awayScore: state.info.awayScore,
        };

        ctx.setState({
            ...state,
            saved: false,
            home: {
                ...state.home,
                players:
                    p.color === 'home' ? updatedPlayers : state.home.players,
            },
            away: {
                ...state.away,
                players:
                    p.color === 'away' ? updatedPlayers : state.away.players,
            },
            info: {
                ...state.info,
                events: [...state.info.events, exclusionEvent],
            },
        });
    }

    @Action(Events.Brutality)
    eventBrutality(ctx: StateContext<StateModel>, p: Events.Brutality): void {
        // TODO: Add a red card?
        const state = ctx.getState();
        let players: Player[];

        if (p.color === 'home') {
            players = state.home.players;
        } else {
            players = state.away.players;
        }

        const updatedPlayers = players.map((player) => {
            if (player.number !== p.number) {
                return player;
            } else {
                const newPlayer = { ...player };
                const brutString = `Q${state.info.quarter} ${p.time}`;
                if (newPlayer.f1 === '') {
                    newPlayer.f1 = brutString;
                }
                if (newPlayer.f2 === '') {
                    newPlayer.f2 = brutString;
                }
                if (newPlayer.f3 === '') {
                    newPlayer.f3 = brutString;
                }
                return newPlayer;
            }
        });

        const brutalityEvent: EventsModel = {
            eventId: state.info.events.length,
            number: p.number,
            teamColor: p.color.toUpperCase(),
            incident: 'BRUTALITY',
            time: p.time,
            homeScore: state.info.homeScore,
            awayScore: state.info.awayScore,
        };

        ctx.setState({
            ...state,
            saved: false,
            home: {
                ...state.home,
                players:
                    p.color === 'home' ? updatedPlayers : state.home.players,
            },
            away: {
                ...state.away,
                players:
                    p.color === 'away' ? updatedPlayers : state.away.players,
            },
            info: {
                ...state.info,
                events: [...state.info.events, brutalityEvent],
            },
        });
    }

    @Action(Info.UpdateGameNumber)
    updateGameNumber(
        ctx: StateContext<StateModel>,
        { gameNumber }: Info.UpdateGameNumber
    ): void {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            saved: false,
            info: { ...state.info, gameNumber: gameNumber },
        });
    }

    @Action(Info.UpdateLocation)
    updateLocation(
        ctx: StateContext<StateModel>,
        { location }: Info.UpdateLocation
    ): void {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            saved: false,
            info: { ...state.info, location: location },
        });
    }

    @Action(Info.UpdateLeague)
    updateLeague(
        ctx: StateContext<StateModel>,
        { league }: Info.UpdateLeague
    ): void {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            saved: false,
            info: { ...state.info, league: league },
        });
    }

    @Action(Info.UpdateCategory)
    updateCategory(
        ctx: StateContext<StateModel>,
        { category }: Info.UpdateCategory
    ): void {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            saved: false,
            info: { ...state.info, category: category },
        });
    }

    @Action(Info.UpdateDate)
    updateDate(ctx: StateContext<StateModel>, { date }: Info.UpdateDate): void {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            saved: false,
            info: { ...state.info, date: date },
        });
    }

    @Action(Info.UpdateStartTime)
    updateStartTime(
        ctx: StateContext<StateModel>,
        { startTime }: Info.UpdateStartTime
    ): void {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            saved: false,
            info: { ...state.info, startTime: startTime },
        });
    }

    // TEAM ACTIONS
    @Action(Team.UpdateTeamName)
    async updateTeamName(
        ctx: StateContext<StateModel>,
        { color, value }: Team.UpdateTeamName
    ): Promise<void> {
        const state = ctx.getState();
        if (color === 'home') {
            ctx.setState({
                ...state,
                saved: false,
                home: { ...state.home, teamName: value, saved: false },
            });
        } else {
            ctx.setState({
                ...state,
                saved: false,
                away: { ...state.away, teamName: value, saved: false },
            });
        }
    }

    @Action(Team.UpdateCoach)
    async updateCoach(
        ctx: StateContext<StateModel>,
        { color, value }: Team.UpdateCoach
    ): Promise<void> {
        const state = ctx.getState();
        if (color === 'home') {
            ctx.setState({
                ...state,
                saved: false,
                home: { ...state.home, coach: value, saved: false },
            });
        } else {
            ctx.setState({
                ...state,
                saved: false,
                away: { ...state.away, coach: value, saved: false },
            });
        }
    }

    @Action(Team.UpdateAssistant1)
    async updateAssistant1(
        ctx: StateContext<StateModel>,
        { color, value }: Team.UpdateAssistant1
    ): Promise<void> {
        const state = ctx.getState();
        if (color === 'home') {
            ctx.setState({
                ...state,
                saved: false,
                home: { ...state.home, assistant1: value, saved: false },
            });
        } else {
            ctx.setState({
                ...state,
                saved: false,
                away: { ...state.away, assistant1: value, saved: false },
            });
        }
    }

    @Action(Team.UpdateAssistant2)
    async updateAssistant2(
        ctx: StateContext<StateModel>,
        { color, value }: Team.UpdateAssistant2
    ): Promise<void> {
        const state = ctx.getState();
        if (color === 'home') {
            ctx.setState({
                ...state,
                saved: false,
                home: { ...state.home, assistant2: value, saved: false },
            });
        } else {
            ctx.setState({
                ...state,
                saved: false,
                away: { ...state.away, assistant2: value, saved: false },
            });
        }
    }

    @Action(Team.UpdatePlayers)
    async updatePlayers(
        ctx: StateContext<StateModel>,
        { color, value }: Team.UpdatePlayers
    ): Promise<void> {
        const state = ctx.getState();
        if (color === 'home') {
            ctx.setState({
                ...state,
                saved: false,
                home: { ...state.home, players: value, saved: false },
            });
        } else {
            ctx.setState({
                ...state,
                saved: false,
                away: { ...state.away, players: value, saved: false },
            });
        }
    }

    @Action(Team.Save)
    async teamSave(
        ctx: StateContext<StateModel>,
        { color }: Team.Save
    ): Promise<void> {
        if (!this.session) {
            return;
        }

        const state = ctx.getState();
        if (color === 'home') {
            const { error } = await this.supabase.upsertTeam(
                this.session.user,
                state.home
            );
            if (error) {
                return;
            }
            ctx.setState({ ...state, home: { ...state.home, saved: true } });
        } else {
            const { error } = await this.supabase.upsertTeam(
                this.session.user,
                state.away
            );
            if (error) {
                return;
            }
            ctx.setState({ ...state, away: { ...state.away, saved: true } });
        }
    }

    @Action(Team.Patch)
    async teamPatch(
        ctx: StateContext<StateModel>,
        { color, value }: Team.Patch
    ): Promise<void> {
        const teamModel: TeamModel = {
            ...value,
            players: [
                ...value.players.map((p) => Utils.newPlayer(p.name, p.number)),
            ],
            timeouts: [],
            capSwaps: [],
            cards: [],
            saved: true,
        };
        const state = ctx.getState();
        if (color === 'home') {
            ctx.setState({ ...state, home: teamModel });
        } else {
            ctx.setState({ ...state, away: teamModel });
        }
    }
}
