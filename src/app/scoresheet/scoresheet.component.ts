import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Game } from '../core/actions/game.actions';
import { WoloState } from '../core/states/state';
import { TeamModel } from '../core/utils/models';
import { Utils } from '../core/utils/utils';

@Component({
    selector: 'app-scoresheet',
    templateUrl: './scoresheet.component.html',
    styleUrls: ['./scoresheet.component.css'],
})
export class ScoresheetComponent {
    @Select(WoloState.selectTeam('home')) homeModel$!: Observable<TeamModel>;
    @Select(WoloState.selectTeam('away')) awayModel$!: Observable<TeamModel>;

    constructor(
        private store: Store,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        // Parse the token parameter from the URL
        this.route.params.subscribe((params) => {
            const gameId: string = params['gameId'];
            if (gameId && Utils.isValidUUIDV4(gameId)) {
                this.store.dispatch(new Game.GetOne(gameId)).subscribe((_) => {
                    this.router.navigateByUrl('/');
                });
            }
        });
    }
}
