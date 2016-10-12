import { Component, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import * as moment from 'moment';

export interface CalendarDate {
  day: number;
  month: number;
  year: number;
  enabled: boolean;
  today: boolean;
  selected: boolean;
}

export const CALENDAR_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatePickerComponent),
  multi: true
};

@Component({
  selector: 'date-picker',
  template: '<ng-content></ng-content>',
  providers: [CALENDAR_VALUE_ACCESSOR]
})
export class DatePickerComponent implements ControlValueAccessor {
  @Input() format = 'YYYY-MM-DD';
  @Input() firstWeekdaySunday = false;

  @Output() onDateChanged = new EventEmitter<moment.Moment>();

  /* is it used ? */
  private onChange: Function;
  private onTouched: Function;
  /* */

  private _date = moment();

  /* Value accessor stuff */
  private onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => void = () => { };

  public get date(): moment.Moment {
    return this._date;
  }

  public set date(value: moment.Moment) {
    this._date = value;
    this._onValueChanged(value);
  }

  writeValue(value: any) {
    this.date = (value instanceof moment) ? value : moment(value, this.format);
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
  /* */

  private _onValueChanged(value: moment.Moment) {
    this.onChangeCallback(value);
    this.onDateChanged.emit(value);
  }

  generateCalendar(month: number, year: number): CalendarDate[] {
    let today = moment();

    if (month < 0 || month > 11)
      month = today.month();


    let date = moment([year, month]);

    let n = 1;
    let firstWeekDay: number = (this.firstWeekdaySunday) ? date.date(2).day() : date.date(1).day();

    if (firstWeekDay !== 1) {
      n -= (firstWeekDay + 6) % 7;
    }

    let days = [];
    let selectedDate = this.date;
    for (let i = n, end = date.endOf('month').date(); i <= end; i += 1) {
      //why not : let currentDate = moment([year, month, i]);
      let currentDate = moment(`${i}.${month + 1}.${year}`, 'DD.MM.YYYY');
      //why not just => isToday = today.isSame(currentDate, 'day')
      let isToday = (today.isSame(currentDate, 'day') && today.isSame(currentDate, 'month')) ? true : false;
      let selected = (selectedDate.isSame(currentDate, 'day')) ? true : false;

      if (i > 0) {
        days.push({
          day: i,
          month: month + 1,
          year: year,
          enabled: true,
          today: isToday,
          selected: selected
        });
      } else {
        days.push({
          day: null,
          month: null,
          year: null,
          enabled: false,
          today: false,
          selected: false
        });
      }
    }

    return days;
  }

  selectDate(date: CalendarDate) {
    this.date = moment(`${date.day}.${date.month}.${date.year}`, 'DD.MM.YYYY');
  }

}
