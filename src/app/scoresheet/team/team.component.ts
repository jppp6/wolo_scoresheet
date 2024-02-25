import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { Session } from '@supabase/gotrue-js';
import { ColGroupDef, GridOptions } from 'ag-grid-community';
import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs';
import { Team } from 'src/app/core/actions/team.actions';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { StoredTeamModel, TeamModel } from 'src/app/core/utils/models';
import { Utils } from 'src/app/core/utils/utils';
import { TeamSelectDialog } from '../team-select/team-select.component';

@Component({
    selector: 'app-team',
    templateUrl: './team.component.html',
    styleUrls: ['./team.component.css'],
})
export class TeamComponent implements OnInit {
    @Input() teamColor!: 'home' | 'away';
    @Input() teamModel$!: Observable<TeamModel>;

    teamModel!: TeamModel;
    storedTeamModels: StoredTeamModel[] = [];
    session: Session | null = null;

    constructor(
        private store: Store,
        private dialog: MatDialog,
        private readonly supabase: SupabaseService
    ) {}

    ngOnInit(): void {
        this.supabase.authChanges((_, s) => (this.session = s));

        this.teamModel$.subscribe(
            (m: TeamModel) => (this.teamModel = cloneDeep(m))
        );
    }

    async getTeams() {
        const teams = await this.supabase.getTeams();
        this.storedTeamModels = Utils.snackCaseToCamelCase(
            teams
        ) as StoredTeamModel[];
    }

    async upsertTeam(): Promise<void> {
        this.store.dispatch(new Team.Save(this.teamColor)).subscribe((_) => {
            this.getTeams();
        });
    }

    async openTeamSelect(): Promise<void> {
        await this.getTeams();

        this.dialog.open(TeamSelectDialog, {
            width: '600px',
            data: {
                team: this.teamColor,
                options: this.storedTeamModels,
            },
        });
    }

    newTeam(): void {
        this.store.dispatch(new Team.New(this.teamColor));
    }

    updateTeamName(): void {
        this.store.dispatch(
            new Team.UpdateTeamName(this.teamColor, this.teamModel.teamName)
        );
    }

    updateCoach(): void {
        this.store.dispatch(
            new Team.UpdateCoach(this.teamColor, this.teamModel.coach)
        );
    }

    updateAssistant1(): void {
        this.store.dispatch(
            new Team.UpdateAssistant1(this.teamColor, this.teamModel.assistant1)
        );
    }

    updateAssistant2(): void {
        this.store.dispatch(
            new Team.UpdateAssistant2(this.teamColor, this.teamModel.assistant2)
        );
    }

    updatePlayers(): void {
        this.store.dispatch(
            new Team.UpdatePlayers(this.teamColor, this.teamModel.players)
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
                    valueFormatter: (v) => (!v.value ? '' : v.value.toString()),
                    cellStyle: { 'text-align': 'right' },
                },
            ],
        },
    ];
}
