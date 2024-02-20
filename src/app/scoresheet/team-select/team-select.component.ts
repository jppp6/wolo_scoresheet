import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { SupabaseService } from 'src/app/core/services/supabase.service';

@Component({
  selector: 'app-team-select',
  templateUrl: './team-select.component.html',
  styleUrls: ['./team-select.component.css'],
})
export class TeamSelectComponent {
  constructor(
    private store: Store,
    private supabase: SupabaseService,
    @Inject(MAT_DIALOG_DATA) public data: 'home' | 'away'
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getProfile();
  }

  async getProfile() {
    try {
      if (!this.supabase.session) {
        return;
      }
      const { user } = this.supabase.session;
      const { data, error, status } = await this.supabase.getTeams(user);
      console.log(data);
      if (error && status !== 406) {
        throw error;
      }
      this.options = data;
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
    }
  }
  options: any;
}
