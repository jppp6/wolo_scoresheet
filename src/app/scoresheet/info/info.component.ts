import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Info } from 'src/app/core/actions/info.actions';
import { WoloState } from 'src/app/core/states/state';
import { InfoModel } from 'src/app/core/utils/models';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css'],
})
export class InfoComponent implements OnInit {
  @Select(WoloState.selectInfo) $selectInfo!: Observable<InfoModel>;
  info!: InfoModel;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.$selectInfo.subscribe((selectInfo) => {
      this.info = { ...selectInfo } as InfoModel;
    });
  }

  updateInfoModel(field: string): void {
    if (field === 'gamenumber') {
      this.store.dispatch(new Info.UpdateGameNumber(this.info.gameNumber));
    } else if (field === 'location') {
      this.store.dispatch(new Info.UpdateLocation(this.info.location));
    } else if (field === 'league') {
      this.store.dispatch(new Info.UpdateLeague(this.info.league));
    } else if (field === 'category') {
      this.store.dispatch(new Info.UpdateCategory(this.info.category));
    } else if (field === 'date') {
      this.store.dispatch(new Info.UpdateDate(this.info.date));
    } else if (field === 'starttime') {
      this.store.dispatch(new Info.UpdateStartTime(this.info.startTime));
    }
  }
}
