import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Session } from '@supabase/gotrue-js';
import { Observable } from 'rxjs';
import { AuthComponent } from 'src/app/core/auth/auth.component';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { GameSelectComponent } from 'src/app/scoresheet/game-select/game-select.component';
import { HelpComponent } from 'src/app/scoresheet/help/help.component';
import { Game } from '../actions/game.actions';
import { WoloState } from '../states/state';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: [],
})
export class HeaderComponent implements OnInit {
    @Select(WoloState.gameSaved) $gameSaved!: Observable<boolean>;
    session: Session | null = null;

    constructor(
        private dialog: MatDialog,
        private store: Store,
        private readonly supabase: SupabaseService
    ) {}

    ngOnInit() {
        this.supabase.authChanges((_, session) => (this.session = session));
    }

    // General users
    openHelpPage(): void {
        this.dialog.open(HelpComponent, {
            width: '600px',
        });
    }

    signIn(): void {
        this.dialog.open(AuthComponent, {
            width: '600px',
        });
    }

    // Logged in users

    async saveGame(): Promise<void> {
        if (!this.session) {
            return;
        }
        this.store.dispatch(new Game.Upsert());
    }

    async loadGame(): Promise<void> {
        if (!this.session) {
            return;
        }
        const games = await this.supabase.getGames(this.session.user);
        this.dialog.open(GameSelectComponent, {
            width: '600px',
            data: games,
        });
    }

    async newGame(): Promise<void> {
        if (!this.session) {
            return;
        }
        this.store.dispatch(new Game.Upsert()).subscribe((_) => {
            this.store.dispatch(new Game.New());
        });
    }

    async signOut(): Promise<void> {
        await this.supabase.signOut();
    }
}
