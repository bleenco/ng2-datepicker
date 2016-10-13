import { Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

import * as moment from 'moment';

export interface CalendarDay {
  date: moment.Moment;
  state: {
    enabled:   boolean;
    today:     boolean;
    currMonth: boolean;
  };
}

export abstract class DatePickerCore implements ControlValueAccessor {

  @Input() format = 'YYYY-MM-DD';
  @Input() viewFormat = 'D MMMM YYYY';
  @Input() firstWeekdaySunday = false;

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
    this.onDateChanged(value);
  }

  abstract onDateChanged(date: moment.Moment);

  isDaySelected(day: CalendarDay) {
    return this.date.isSame(day.date);
  }

  generateMonthCalendar(month: number, year: number): CalendarDay[] {
    let today = moment();

    if (month < 0 || month > 11)
      month = today.month();


    let date = moment([year, month]);

    let n = 1;
    let firstWeekDay: number = (this.firstWeekdaySunday) ? date.date(2).day() : date.date(1).day();

    if (firstWeekDay !== 1) {
      n -= (firstWeekDay + 6) % 7;
    }

    let days: CalendarDay[] = [];
    for (let i = n, end = date.endOf('month').date(); i <= end; i += 1) {
      //why not : let currentDate = moment([year, month, i]);
      let currentDate = moment(`${i}.${month + 1}.${year}`, 'DD.MM.YYYY');
      //why not just => isToday = today.isSame(currentDate, 'day')
      let isToday = (today.isSame(currentDate, 'day') && today.isSame(currentDate, 'month')) ? true : false;
      //let selected = (selectedDate.isSame(currentDate, 'day')) ? true : false;

      if (i > 0) {
        days.push({
          date: currentDate,
          state: {
            enabled: true,
            today: isToday,
            currMonth: true
          }
        });
      } else {
        days.push({
          date: null,
          state: {
            enabled: false,
            today:   false,
            currMonth: false
          }
        });
      }
    }

    return days;
  }

  selectDay(day: CalendarDay) {
    this.date = day.date;
  }

}
