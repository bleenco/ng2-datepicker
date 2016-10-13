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

  private _dates: moment.Moment[];
  //thoses are reference to date inside _dates
  //should treat thoses var as readonly (never call mutable methods on it)
  private minDate: moment.Moment;
  private maxDate: moment.Moment;

  public get dates(): moment.Moment[] {
    return this._dates;
  }

  public set dates(dates: moment.Moment[]) {
    //this may be weird to set a property to null and having it being an empty array
    //but this is too annoying to handle null dates
    dates = dates || [];

    this._dates = dates;

    if ( dates.length == 0 ) {
      this.minDate = this.maxDate = null;
    }
    else {
      dates.forEach( d => {
        if ( !this.minDate || d.isBefore(this.minDate) )
          this.minDate = d;

        if ( !this.maxDate || d.isAfter(this.maxDate) )
          this.maxDate = d;
      });
    }

    this._onValueChanged(this._dates);
  }

  //keep a simple api for when we only use 1 date
  public get date(): moment.Moment {
    return this._dates[0];
  }

  public set date(value: moment.Moment) {
    this.dates = [value];
  }

  constructor() {
    this.reset();
  }

  reset() {
    this.dates = [];
  }


  /* Value accessor stuff */
  private onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => void = () => { };

  writeValue(value: any) {
    let values = (value instanceof Array) ? value : [value];

    this.dates = values.map(
      v => moment.isMoment(v) ? v : moment(v, this.format) );
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
  /* */

  private _onValueChanged(value: moment.Moment[]) {
    this.onChangeCallback(value);
    this.onDatesChanged(value);
  }

  abstract onDatesChanged(date: moment.Moment[]);

  addDate(day: CalendarDay) {
    this.dates = [...this.dates, day.date];
  }

  removeDate(day: CalendarDay) {
    let dayDate = day.date;

    this.dates = this.dates.filter( d => !d.isSame(dayDate) );
  }

  //easy API when using only 1 date
  setDate(day: CalendarDay) {
    this.date = day.date;
  }

  isDateActive(date: moment.Moment) {
    return this.dates.find( d => d.isSame(date) );
  }

  isDateSelected(date: moment.Moment) {
    return date && date.isBetween(this.minDate, this.maxDate, 'day', '[]');
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
}
