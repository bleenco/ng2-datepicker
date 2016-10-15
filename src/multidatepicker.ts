import { OnChanges, SimpleChanges } from '@angular/core';
import * as moment from 'moment';

import { DatePickerCore } from './datepickercore';
import { CalendarDay, DayState } from './calendarday';

export abstract class MultiDatePicker extends DatePickerCore implements OnChanges {

  private _dates: moment.Moment[] = [];

  public get dates(): moment.Moment[] {
    return this._dates;
  }

  // looks heavy for just a setter
  public set dates(dates: moment.Moment[]) {
    dates = dates || [];

    this._dates = dates
      .filter( d => this.isDateValid(d) )
      .sort( (a, b) => <any>a - <any>b );

    this.onValueChanged(this._dates);
  }

  reset() {
    this.dates = [];
  }

  writeValue(value: any) {
    let values = (value instanceof Array) ? value : [value];

    this.dates = values.map(
      v => this.getMoment(v) );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['minDate'] || changes['maxDate']) {
      if (this.dates.some( d => !this.isDateValid(d) ))
        //filter is done on setter
        this.dates = this.dates;
      // buildCalendar() will be triggered by date setter
      // so only call it on else
      else
        //update enable state
        this.buildCalendar();
    }
  }

  addDate(day: CalendarDay) {
    let dayDate = day.date;

    if ( !this.dates.find( d => d.isSame(dayDate) ) )
      this.dates = [...this.dates, day.date];
  }

  removeDate(day: CalendarDay) {
    let dayDate = day.date;

    this.dates = this.dates.filter( d => !d.isSame(dayDate) );
  }

  getDayState(date: moment.Moment): DayState {

    if ( !!this.dates.find( d => d.isSame(date) ) )
      return DayState.active;

    if ( this.dates.length < 2 &&
          date.isBetween(this.dates[0], this.dates[this.dates.length - 1], 'day', '[]') )
      return DayState.selected;

    return this.isDateValid(date) ? DayState.enabled : DayState.disabled;
  }
}
