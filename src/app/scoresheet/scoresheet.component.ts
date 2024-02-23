import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Game } from '../core/actions/game.actions';
import { Utils } from '../core/utils/utils';

@Component({
    selector: 'app-scoresheet',
    templateUrl: './scoresheet.component.html',
    styleUrls: ['./scoresheet.component.css'],
})
export class ScoresheetComponent {
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
