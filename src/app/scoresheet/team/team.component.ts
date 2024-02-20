import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Session } from '@supabase/gotrue-js';
import { ColGroupDef, GridOptions } from 'ag-grid-community';
import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs';
import { Team } from 'src/app/core/actions/team.actions';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { WoloState } from 'src/app/core/states/state';
import { TeamModel } from 'src/app/core/utils/models';
import { TeamSelectComponent } from '../team-select/team-select.component';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
})
export class TeamComponent implements OnInit {
  @Select(WoloState.selectTeam('home')) homeModel$!: Observable<TeamModel>;
  homeModel!: TeamModel;
  @Select(WoloState.selectTeam('away')) awayModel$!: Observable<TeamModel>;
  awayModel!: TeamModel;

  session: Session | null = null;

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private readonly supabase: SupabaseService
  ) {}

  ngOnInit(): void {
    this.supabase.authChanges((_, session) => (this.session = session));

    this.homeModel$.subscribe((model: TeamModel) => {
      this.homeModel = cloneDeep(model);
    });

    this.awayModel$.subscribe((model: TeamModel) => {
      this.awayModel = cloneDeep(model);
    });
  }

  openTeamSelect(t: 'home' | 'away'): void {
    if (!this.session) {
      return;
    }
    this.dialog.open(TeamSelectComponent, { width: '500px', data: t });
  }

  updateTeamName(t: 'home' | 'away'): void {
    if (t === 'home') {
      this.store.dispatch(new Team.UpdateTeamName(t, this.homeModel.teamName));
    } else {
      this.store.dispatch(new Team.UpdateTeamName(t, this.awayModel.teamName));
    }
  }

  updateCoach(t: 'home' | 'away'): void {
    if (t === 'home') {
      this.store.dispatch(new Team.UpdateCoach(t, this.homeModel.coach));
    } else {
      this.store.dispatch(new Team.UpdateCoach(t, this.awayModel.coach));
    }
  }

  updateAssistant1(t: 'home' | 'away'): void {
    if (t === 'home') {
      this.store.dispatch(
        new Team.UpdateAssistant1(t, this.homeModel.assistant1)
      );
    } else {
      this.store.dispatch(
        new Team.UpdateAssistant1(t, this.awayModel.assistant1)
      );
    }
  }

  updateAssistant2(t: 'home' | 'away'): void {
    if (t === 'home') {
      this.store.dispatch(
        new Team.UpdateAssistant2(t, this.homeModel.assistant2)
      );
    } else {
      this.store.dispatch(
        new Team.UpdateAssistant2(t, this.awayModel.assistant2)
      );
    }
  }

  updatePlayers(t: 'home' | 'away'): void {
    if (t === 'home') {
      this.store.dispatch(new Team.UpdatePlayers(t, this.homeModel.players));
    } else {
      this.store.dispatch(new Team.UpdatePlayers(t, this.awayModel.players));
    }
  }

  gridOptions: GridOptions = {
    headerHeight: 24,
    rowHeight: 24,
    defaultColDef: {
      resizable: false,
      sortable: false,
      suppressMovable: true,
      cellStyle: { padding: 0 },
    },
  };

  colDefs: ColGroupDef[] = [
    {
      children: [
        { field: 'number', headerName: '#', width: 1 },
        {
          field: 'name',
          headerName: 'Name',
          flex: 1,
          editable: true,
        },
      ],
    },
    {
      headerName: 'Fouls',
      children: [
        { field: 'f1', headerName: '1', width: 45 },
        { field: 'f2', headerName: '2', width: 45 },
        { field: 'f3', headerName: '3', width: 45 },
      ],
    },
    {
      headerName: 'Goals',
      children: [
        { field: 'q1', headerName: 'Q1', width: 32 },
        { field: 'q2', headerName: 'Q2', width: 32 },
        { field: 'q3', headerName: 'Q3', width: 32 },
        { field: 'q4', headerName: 'Q4', width: 32 },
        {
          field: 'q5',
          headerName: 'OT',
          width: 32,
        },
        {
          field: 'total',
          headerName: 'Total',
          width: 40,
          cellStyle: { 'text-align': 'right' },
        },
      ],
    },
  ];
}
