import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { AgGridAngular } from 'ag-grid-angular';

import { environment } from 'src/environments/environment';

import { AppComponent } from './app.component';
import { AuthComponent } from './core/auth/auth.component';
import { HeaderComponent } from './core/header/header.component';
import { WoloState } from './core/states/state';
import { CommandComponent } from './scoresheet/command/command.component';
import { EventsComponent } from './scoresheet/events/events.component';
import { GameSelectComponent } from './scoresheet/game-select/game-select.component';
import { HelpComponent } from './scoresheet/help/help.component';
import { InfoComponent } from './scoresheet/info/info.component';
import { ScoresheetComponent } from './scoresheet/scoresheet.component';
import { TeamSelectComponent } from './scoresheet/team-select/team-select.component';
import { TeamComponent } from './scoresheet/team/team.component';

@NgModule({
    declarations: [
        AppComponent,
        AuthComponent,
        CommandComponent,
        EventsComponent,
        GameSelectComponent,
        HeaderComponent,
        HelpComponent,
        InfoComponent,
        ScoresheetComponent,
        TeamComponent,
        TeamSelectComponent,
    ],
    imports: [
        NgxsModule.forRoot([WoloState], {
            developmentMode: !environment.production,
        }),
        AgGridAngular,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatCardModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatNativeDateModule,
        MatToolbarModule,
        MatTooltipModule,
        ReactiveFormsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
