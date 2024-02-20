import { Injectable } from '@angular/core';
import {
  Action,
  Selector,
  State,
  StateContext,
  createSelector,
} from '@ngxs/store';
import { Game } from '../actions/game.actions';
import { Events, Info } from '../actions/info.actions';
import { Team } from '../actions/team.actions';
import { SupabaseService } from '../services/supabase.service';
import { EventsModel, InfoModel, StateModel } from '../utils/models';
import { Utils } from '../utils/utils';

@State<StateModel>({
  name: 'wolo',
  defaults: {
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
    },
    info: {
      gameId: crypto.randomUUID(),
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
  },
})
@Injectable()
export class WoloState {
  constructor(private supaService: SupabaseService) {}

  @Selector()
  static selectUser(state: StateModel): string[] {
    return ['team1', 'team2'];
  }

  @Selector()
  static selectInfo(state: StateModel): InfoModel {
    return state.info;
  }

  static selectTeam(team: 'home' | 'away') {
    return createSelector([WoloState], (state: StateModel) => {
      return team === 'home' ? state.home : state.away;
    });
  }

  @Selector()
  static selectEvents(state: StateModel): EventsModel[] {
    return state.info.events;
  }

  @Action(Game.Create)
  gameCreate(ctx: StateContext<StateModel>): void {
    // if user is loged in, save the game first
    const g = Utils.emptyGame();
    // this.supaService.addTeam({
    //   team_id: crypto.randomUUID(),
    //   team_name: '',
    //   coach: '',
    //   assistant1: '',
    //   assistant2: '',
    //   players: Utils.emptyTeam(),
    // });
    ctx.patchState({ ...g });
  }
  @Action(Game.GetAll)
  gameGetAll(ctx: StateContext<StateModel>): void {}
  @Action(Game.GetOne)
  gameGetOne(ctx: StateContext<StateModel>, p: Game.GetOne): void {}
  @Action(Game.Update)
  gameUpdate(ctx: StateContext<StateModel>): void {}
  @Action(Game.Delete)
  gameDelete(ctx: StateContext<StateModel>): void {
    console.log(ctx.getState());
  }

  @Action(Team.Create)
  teamCreate(ctx: StateContext<StateModel>): void {}
  @Action(Team.GetAll)
  teamGetAll(ctx: StateContext<StateModel>): void {}
  @Action(Team.GetOne)
  teamGetOne(ctx: StateContext<StateModel>, p: Team.GetOne): void {}
  @Action(Team.Delete)
  teamDelete(ctx: StateContext<StateModel>): void {}

  @Action(Events.Goal)
  eventGoal(ctx: StateContext<StateModel>, p: Events.Goal): void {
    const state = ctx.getState();

    const homeScore =
      p.color === 'home' ? state.info.homeScore + 1 : state.info.homeScore;
    const awayScore =
      p.color === 'away' ? state.info.awayScore + 1 : state.info.awayScore;

    const goalEvent: EventsModel = {
      eventId: state.info.events.length,
      number: p.number,
      teamColor: p.color.toUpperCase(),
      incident: 'GOAL',
      time: p.time,
      homeScore: homeScore,
      awayScore: awayScore,
    };

    ctx.setState({
      ...state,
      info: {
        ...state.info,
        homeScore: homeScore,
        awayScore: awayScore,
        events: [...state.info.events, goalEvent],
      },
    });
  }
  @Action(Events.Quarter)
  eventQuarter(ctx: StateContext<StateModel>): void {
    // TODO: Cap the quarters at OT, and add check if OT is possible
    const state = ctx.getState();
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
      info: {
        ...state.info,
        quarter: state.info.quarter + 1,
        events: [...state.info.events, quarterEvent],
      },
    });
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

    const homeTimeOuts: string[] = [...state.home.timeouts];
    const awayTimeOuts: string[] = [...state.away.timeouts];
    if (p.color === 'home') {
      homeTimeOuts.push(`Q${state.info.quarter} ${p.time}`);
    } else {
      awayTimeOuts.push(`Q${state.info.quarter} ${p.time}`);
    }

    ctx.setState({
      home: { ...state.home, timeouts: homeTimeOuts },
      away: { ...state.away, timeouts: awayTimeOuts },
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

    const homeCards: string[] = [...state.home.cards];
    const awayCards: string[] = [...state.away.cards];
    if (p.color === 'home') {
      homeCards.push(`Q${state.info.quarter} ${p.time}: ${p.type}`);
    } else {
      awayCards.push(`Q${state.info.quarter} ${p.time}: ${p.type}`);
    }

    ctx.setState({
      home: { ...state.home, cards: homeCards },
      away: { ...state.away, cards: awayCards },
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

    const homeCapSwaps: string[] = [...state.home.capSwaps];
    const awayCapSwaps: string[] = [...state.away.capSwaps];
    if (p.color === 'home') {
      homeCapSwaps.push(
        `Q${state.info.quarter} ${p.time}: #${p.number1} & #${p.number2}`
      );
    } else {
      awayCapSwaps.push(
        `Q${state.info.quarter} ${p.time}: #${p.number1} & #${p.number2}`
      );
    }

    ctx.setState({
      home: { ...state.home, capSwaps: homeCapSwaps },
      away: { ...state.away, capSwaps: awayCapSwaps },
      info: {
        ...state.info,
        events: [...state.info.events, capSwapEvent],
      },
    });
  }

  @Action(Events.Exclusion)
  eventExclusion(ctx: StateContext<StateModel>, p: Events.Exclusion): void {
    const state = ctx.getState();

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
    ctx.setState({ ...state, info: { ...state.info, gameNumber: gameNumber } });
  }

  @Action(Info.UpdateLocation)
  updateLocation(
    ctx: StateContext<StateModel>,
    { location }: Info.UpdateLocation
  ): void {
    const state = ctx.getState();
    ctx.setState({ ...state, info: { ...state.info, location: location } });
  }

  @Action(Info.UpdateLeague)
  updateLeague(
    ctx: StateContext<StateModel>,
    { league }: Info.UpdateLeague
  ): void {
    const state = ctx.getState();
    ctx.setState({ ...state, info: { ...state.info, league: league } });
  }

  @Action(Info.UpdateCategory)
  updateCategory(
    ctx: StateContext<StateModel>,
    { category }: Info.UpdateCategory
  ): void {
    const state = ctx.getState();
    ctx.setState({ ...state, info: { ...state.info, category: category } });
  }

  @Action(Info.UpdateDate)
  updateDate(ctx: StateContext<StateModel>, { date }: Info.UpdateDate): void {
    const state = ctx.getState();
    ctx.setState({ ...state, info: { ...state.info, date: date } });
  }

  @Action(Info.UpdateStartTime)
  updateStartTime(
    ctx: StateContext<StateModel>,
    { startTime }: Info.UpdateStartTime
  ): void {
    const state = ctx.getState();
    ctx.setState({ ...state, info: { ...state.info, startTime: startTime } });
  }

  @Action(Team.UpdateTeamName)
  updateTeamName(
    ctx: StateContext<StateModel>,
    { color, value }: Team.UpdateTeamName
  ): void {
    const state = ctx.getState();
    if (color === 'home') {
      ctx.setState({ ...state, home: { ...state.home, teamName: value } });
    } else {
      ctx.setState({ ...state, away: { ...state.away, teamName: value } });
    }
  }

  @Action(Team.UpdateCoach)
  updateCoach(
    ctx: StateContext<StateModel>,
    { color, value }: Team.UpdateCoach
  ): void {
    const state = ctx.getState();
    if (color === 'home') {
      ctx.setState({ ...state, home: { ...state.home, coach: value } });
    } else {
      ctx.setState({ ...state, away: { ...state.away, coach: value } });
    }
  }

  @Action(Team.UpdateAssistant1)
  updateAssistant1(
    ctx: StateContext<StateModel>,
    { color, value }: Team.UpdateAssistant1
  ): void {
    const state = ctx.getState();
    if (color === 'home') {
      ctx.setState({ ...state, home: { ...state.home, assistant1: value } });
    } else {
      ctx.setState({ ...state, away: { ...state.away, assistant1: value } });
    }
  }

  @Action(Team.UpdateAssistant2)
  updateAssistant2(
    ctx: StateContext<StateModel>,
    { color, value }: Team.UpdateAssistant2
  ): void {
    const state = ctx.getState();
    if (color === 'home') {
      ctx.setState({ ...state, home: { ...state.home, assistant2: value } });
    } else {
      ctx.setState({ ...state, away: { ...state.away, assistant2: value } });
    }
  }

  @Action(Team.UpdatePlayers)
  updatePlayers(
    ctx: StateContext<StateModel>,
    { color, value }: Team.UpdatePlayers
  ): void {
    const state = ctx.getState();
    if (color === 'home') {
      ctx.setState({ ...state, home: { ...state.home, players: value } });
    } else {
      ctx.setState({ ...state, away: { ...state.away, players: value } });
    }
  }
}
