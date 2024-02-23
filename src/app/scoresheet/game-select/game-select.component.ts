import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { Game } from 'src/app/core/actions/game.actions';
import { StateModel } from 'src/app/core/utils/models';

@Component({
    selector: 'app-game-select',
    templateUrl: './game-select.component.html',
    styleUrls: [],
})
export class GameSelectDialog {
    constructor(
        private store: Store,
        public dialogRef: MatDialogRef<GameSelectDialog>,
        @Inject(MAT_DIALOG_DATA) public data: StateModel[]
    ) {}

    async selectGame(game: StateModel): Promise<void> {
        await this.store.dispatch(new Game.Patch(game));

        this.dialogRef.close();
    }
}
