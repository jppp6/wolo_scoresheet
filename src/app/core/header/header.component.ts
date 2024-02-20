import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { Game } from 'src/app/core/actions/game.actions';
import { AuthComponent } from 'src/app/core/auth/auth.component';
import { SupabaseService } from 'src/app/core/services/supabase.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [],
})
export class HeaderComponent implements OnInit {
  session = this.supabase.session;

  constructor(
    public dialog: MatDialog,
    private store: Store,
    private readonly supabase: SupabaseService
  ) {}

  ngOnInit() {
    this.supabase.authChanges((_, session) => (this.session = session));
  }

  // General users
  openHelpPage(): void {
    console.log('openHelpPage');
    this.store.dispatch(new Game.Delete());
  }

  signIn(): void {
    this.dialog.open(AuthComponent, {
      width: '600px',
    });
  }

  // Logged in users
  saveGame(): void {
    console.log('saveGame');
  }
  loadGame(): void {
    console.log('loadGame');
  }

  newGame(): void {
    this.store.dispatch(new Game.Save()).subscribe((_) => {
      this.store.dispatch(new Game.Create());
    });
  }

  async signOut() {
    await this.supabase.signOut();
  }
}
