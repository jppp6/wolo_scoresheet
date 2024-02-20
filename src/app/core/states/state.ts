import { Injectable } from '@angular/core';
import {
  Action,
  Selector,
  State,
  StateContext,
  createSelector,
} from '@ngxs/store';
import { Events } from '../actions/event.actions';
import { Game } from '../actions/game.actions';
import { Information } from '../actions/info.actions';
import { Team } from '../actions/team.actions';
import { SupabaseService } from '../services/supabase.service';
import { EventsModel, InfoModel, StateModel } from '../utils/models';
import { Utils } from '../utils/utils';

@State<StateModel>({
  name: 'wolo',
  defaults: {
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
  },
})
@Injectable()
export class WoloState {
  constructor(private supaService: SupabaseService) {}

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
  // @Action(Team.Update)
  // teamUpdate(ctx: StateContext<StateModel>): void {}
  @Action(Team.Delete)
  teamDelete(ctx: StateContext<StateModel>): void {}

  @Action(Events.Goal)
  eventGoal(ctx: StateContext<StateModel>, p: Events.Goal): void {}
  @Action(Events.Quarter)
  eventQuarter(ctx: StateContext<StateModel>, p: Events.Quarter): void {}
  @Action(Events.Timeout)
  eventTimeout(ctx: StateContext<StateModel>, p: Events.Timeout): void {}
  @Action(Events.Card)
  eventCard(ctx: StateContext<StateModel>, p: Events.Card): void {}
  @Action(Events.CapSwap)
  eventCapSwap(ctx: StateContext<StateModel>, p: Events.CapSwap): void {}
  @Action(Events.Exclusion)
  eventExclusion(ctx: StateContext<StateModel>, p: Events.Exclusion): void {}
  @Action(Events.Brutality)
  eventBrutality(ctx: StateContext<StateModel>, p: Events.Brutality): void {}

  @Action(Information.UpdateGameNumber)
  informationUpdateGameNumber(
    ctx: StateContext<StateModel>,
    { gameNumber }: Information.UpdateGameNumber
  ): void {
    const state = ctx.getState();
    ctx.setState({ ...state, info: { ...state.info, gameNumber: gameNumber } });
  }

  @Action(Information.UpdateLocation)
  updateLocation(
    ctx: StateContext<StateModel>,
    { location }: Information.UpdateLocation
  ): void {
    const state = ctx.getState();
    ctx.setState({ ...state, info: { ...state.info, location: location } });
  }

  @Action(Information.UpdateLeague)
  updateLeague(
    ctx: StateContext<StateModel>,
    { league }: Information.UpdateLeague
  ): void {
    const state = ctx.getState();
    ctx.setState({ ...state, info: { ...state.info, league: league } });
  }

  @Action(Information.UpdateCategory)
  updateCategory(
    ctx: StateContext<StateModel>,
    { category }: Information.UpdateCategory
  ): void {
    const state = ctx.getState();
    ctx.setState({ ...state, info: { ...state.info, category: category } });
  }

  @Action(Information.UpdateDate)
  updateDate(
    ctx: StateContext<StateModel>,
    { date }: Information.UpdateDate
  ): void {
    const state = ctx.getState();
    ctx.setState({ ...state, info: { ...state.info, date: date } });
  }

  @Action(Information.UpdateStartTime)
  updateStartTime(
    ctx: StateContext<StateModel>,
    { startTime }: Information.UpdateStartTime
  ): void {
    const state = ctx.getState();
    ctx.setState({ ...state, info: { ...state.info, startTime: startTime } });
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
