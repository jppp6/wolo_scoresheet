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
import { StoredTeamModel, TeamModel } from 'src/app/core/utils/models';
import { Utils } from 'src/app/core/utils/utils';
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

    storedTeamModels: StoredTeamModel[] = [];
    session: Session | null = null;

    constructor(
        private store: Store,
        private dialog: MatDialog,
        private readonly supabase: SupabaseService
    ) {}

    ngOnInit(): void {
        this.supabase.authChanges((_, s) => (this.session = s));

        this.homeModel$.subscribe(
            (m: TeamModel) => (this.homeModel = cloneDeep(m))
        );

        this.awayModel$.subscribe(
            (m: TeamModel) => (this.awayModel = cloneDeep(m))
        );
    }

    async getTeams() {
        if (!this.session) {
            return;
        }
        const d = await this.supabase.getTeams(this.session.user);
        this.storedTeamModels = Utils.snackCaseToCamelCase(
            d
        ) as StoredTeamModel[];
    }

    async upsertTeam(t: 'home' | 'away'): Promise<void> {
        this.store.dispatch(new Team.Save(t)).subscribe((_) => {
            this.getTeams();
        });
    }

    async openTeamSelect(t: 'home' | 'away'): Promise<void> {
        await this.getTeams();

        this.dialog.open(TeamSelectComponent, {
            width: '500px',
            height: '750px',
            data: {
                team: t,
                options: this.storedTeamModels,
            },
        });
    }

    updateTeamName(t: 'home' | 'away'): void {
        this.store.dispatch(
            new Team.UpdateTeamName(
                t,
                t === 'home' ? this.homeModel.teamName : this.awayModel.teamName
            )
        );
    }

    updateCoach(t: 'home' | 'away'): void {
        this.store.dispatch(
            new Team.UpdateCoach(
                t,
                t === 'home' ? this.homeModel.coach : this.awayModel.coach
            )
        );
    }

    updateAssistant1(t: 'home' | 'away'): void {
        this.store.dispatch(
            new Team.UpdateAssistant1(
                t,
                t === 'home'
                    ? this.homeModel.assistant1
                    : this.awayModel.assistant1
            )
        );
    }

    updateAssistant2(t: 'home' | 'away'): void {
        this.store.dispatch(
            new Team.UpdateAssistant2(
                t,
                t === 'home'
                    ? this.homeModel.assistant2
                    : this.awayModel.assistant2
            )
        );
    }

    updatePlayers(t: 'home' | 'away'): void {
        this.store.dispatch(
            new Team.UpdatePlayers(
                t,
                t === 'home' ? this.homeModel.players : this.awayModel.players
            )
        );
    }

    checkIfExists(model: TeamModel): boolean {
        return !!this.storedTeamModels.find((s) => s.teamId === model.teamId);
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
                    headerName: 'Player Name',
                    flex: 1,
                    editable: true,
                },
            ],
        },
        {
            headerName: 'Fouls',
            children: [
                { field: 'f1', headerName: '1', width: 60 },
                { field: 'f2', headerName: '2', width: 60 },
                { field: 'f3', headerName: '3', width: 60 },
            ],
        },
        {
            headerName: 'Goals',

            children: [
                {
                    field: 'q1',
                    headerName: 'Q1',
                    width: 32,
                    valueFormatter: (v) => (!v.value ? '' : v.value.toString()),
                },
                {
                    field: 'q2',
                    headerName: 'Q2',
                    width: 32,
                    valueFormatter: (v) => (!v.value ? '' : v.value.toString()),
                },
                {
                    field: 'q3',
                    headerName: 'Q3',
                    width: 32,
                    valueFormatter: (v) => (!v.value ? '' : v.value.toString()),
                },
                {
                    field: 'q4',
                    headerName: 'Q4',
                    width: 32,
                    valueFormatter: (v) => (!v.value ? '' : v.value.toString()),
                },
                {
                    field: 'q5',
                    headerName: 'OT',
                    width: 32,
                    valueFormatter: (v) => (!v.value ? '' : v.value.toString()),
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
