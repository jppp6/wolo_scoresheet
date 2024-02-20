import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { AuthComponent } from 'src/app/core/auth/auth.component';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { HelpComponent } from 'src/app/scoresheet/help/help.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [],
})
export class HeaderComponent implements OnInit {
  session = this.supabase.session;

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
      width: '750px',
    });
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
    // this.store.dispatch(new Game.Save()).subscribe((_) => {
    // this.store.dispatch(new Game.Create());
    // });
  }

  async signOut() {
    await this.supabase.signOut();
  }
}
