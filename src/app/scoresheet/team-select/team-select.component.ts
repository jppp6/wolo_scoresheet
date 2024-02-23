import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { Team } from 'src/app/core/actions/team.actions';
import { StoredTeamModel } from 'src/app/core/utils/models';

@Component({
    selector: 'app-team-select',
    templateUrl: './team-select.component.html',
    styleUrls: [],
})
export class TeamSelectDialog {
    constructor(
        private store: Store,
        public dialogRef: MatDialogRef<TeamSelectDialog>,
        @Inject(MAT_DIALOG_DATA)
        public data: { options: StoredTeamModel[]; team: 'home' | 'away' }
    ) {}

    selectTeam(team: StoredTeamModel): void {
        this.store
            .dispatch(new Team.Patch(this.data.team, team))
            .subscribe((_) => {
                this.dialogRef.close();
            });
    }
}
