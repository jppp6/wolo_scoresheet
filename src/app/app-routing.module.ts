import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSegment } from '@angular/router';
import { Utils } from './core/utils/utils';
import { ScoresheetComponent } from './scoresheet/scoresheet.component';

const routes: Routes = [
    { path: '', component: ScoresheetComponent },
    {
        matcher: (url) =>
            url.length == 1 && Utils.isValidUUIDV4(url[0].path)
                ? {
                      consumed: url,
                      posParams: { gameId: new UrlSegment(url[0].path, {}) },
                  }
                : null,
        component: ScoresheetComponent,
    },
    { path: '**', redirectTo: '' },
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
