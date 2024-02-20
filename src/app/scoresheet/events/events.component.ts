import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { ColDef, GridOptions } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { WoloState } from 'src/app/core/states/state';
import { EventsModel } from 'src/app/core/utils/models';
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent {
  @Select(WoloState.selectEvents) events$!: Observable<EventsModel[]>;
  // Row Data: The data to be displayed.
  gridOptions: GridOptions = {
    headerHeight: 32,
    rowHeight: 24,
    defaultColDef: {
      flex: 1,
      resizable: false,
      sortable: false,
      suppressMovable: true,
      cellStyle: { padding: 0 },
    },
  };
  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef[] = [
    { field: 'number', headerName: '#' },
    { field: 'color', headerName: 'Color' },
    { field: 'incident', headerName: 'Incident' },
    { field: 'time', headerName: 'Time' },
    { field: 'homeScore', headerName: 'Home' },
    { field: 'awayScore', headerName: 'Away' },
  ];
}