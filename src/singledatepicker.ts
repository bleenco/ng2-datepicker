import { OnChanges, SimpleChanges } from '@angular/core';
import * as moment from 'moment';

import { DatePickerCore } from './datepickercore';
import { CalendarDay, DayState } from './calendarday';

export abstract class SingleDatePicker extends DatePickerCore implements OnChanges {

  private _date: moment.Moment;

  get date(): moment.Moment {
    return this._date;
  }

  set date(value: moment.Moment) {
    if ( !value || this.isDateValid(value) ) {
      this._date = value;
      this.onValueChanged(value);
    }
  }

  reset() {
    this.date = null;
  }

  writeValue(value: any) {
     this.date = this.getMoment(value);
  }

  ngOnChanges(changes: SimpleChanges) {
    if ( changes['minDate'] || changes['maxDate'] ) {

      if ( !this.isDateValid(this.date) )
        this.date = null;
      // buildCalendar() will be triggered by date setter
      // so only call it on else
      else
        //update enable state
        this.buildCalendar();
    }
  }

  setDate(day: CalendarDay) {
    this.date = day.date;
  }

  getDayState(date: moment.Moment): DayState {
    return date.isSame(this.date) ? DayState.active :
      this.isDateValid(date) ? DayState.enabled : DayState.disabled;
  }
}

