import { Injectable } from '@angular/core';
import {
    AuthChangeEvent,
    AuthSession,
    createClient,
    Session,
    SupabaseClient,
    User,
} from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { StateModel, TeamModel } from '../utils/models';

@Injectable({
    providedIn: 'root',
})
export class SupabaseService {
    private supabase: SupabaseClient;
    _session: AuthSession | null = null;

    constructor() {
        this.supabase = createClient(
            environment.supabaseUrl,
            environment.supabaseKey
        );
    }

    get session() {
        this.supabase.auth.getSession().then(({ data }) => {
            this._session = data.session;
        });
        return this._session;
    }

    async upsertGame(user: User, gameModel: StateModel) {
        const game = {
            game_id: gameModel.gameId,
            last_updated: new Date(),
            user_id: user.id,
            info: gameModel.info,
            home: gameModel.home,
            away: gameModel.away,
        };
        return await this.supabase
            .from('games')
            .upsert(game, { onConflict: 'game_id' });
    }

    async getGames(user: User) {
        const { data, error } = await this.supabase
            .from('games')
            .select('game_id, home, away, info, last_updated')
            .eq('user_id', user.id);

        if (error) {
            console.error('Error fetching games:', error.message);
            return [];
        }

        return data;
    }

    async upsertTeam(user: User, teamModel: TeamModel) {
        const team = {
            team_id: teamModel.teamId,
            last_updated: new Date(),
            user_id: user.id,
            team_name: teamModel.teamName,
            coach: teamModel.coach,
            assistant1: teamModel.assistant1,
            assistant2: teamModel.assistant2,
            players: teamModel.players.map((p) =>
                Object({ name: p.name, number: p.number })
            ),
        };
        return await this.supabase
            .from('teams')
            .upsert(team, { onConflict: 'team_id' });
    }

    async getTeams(user: User) {
        const { data, error } = await this.supabase
            .from('teams')
            .select(
                'team_id, team_name, coach, assistant1, assistant2, players, last_updated'
            )
            .eq('user_id', user.id);

        if (error) {
            console.error('Error fetching teams:', error.message);
            return [];
        }

        return data;
    }

    authChanges(
        callback: (event: AuthChangeEvent, session: Session | null) => void
    ) {
        return this.supabase.auth.onAuthStateChange(callback);
    }

    signIn(email: string) {
        return this.supabase.auth.signInWithOtp({ email });
    }

    signOut() {
        return this.supabase.auth.signOut();
    }
}
