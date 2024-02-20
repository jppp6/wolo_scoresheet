import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { AuthComponent } from './core/auth/auth.component';
import { HeaderComponent } from './core/header/header.component';
import { WoloState } from './core/states/state';
import { CommandComponent } from './scoresheet/command/command.component';
import { EventsComponent } from './scoresheet/events/events.component';
import { InfoComponent } from './scoresheet/info/info.component';
import { ScoresheetComponent } from './scoresheet/scoresheet.component';
import { TeamComponent } from './scoresheet/team/team.component';

import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { AgGridAngular } from 'ag-grid-angular';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HeaderComponent,
    CommandComponent,
    InfoComponent,
    EventsComponent,
    TeamComponent,
    ScoresheetComponent,
  ],
  imports: [
    NgxsModule.forRoot([WoloState], {
      developmentMode: !environment.production,
    }),
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    AgGridAngular,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
