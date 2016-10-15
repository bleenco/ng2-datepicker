import { Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

import * as moment from 'moment';

import { CalendarDay, DayState } from './calendarday';

export abstract class DatePickerCore implements ControlValueAccessor {

  @Input() format = 'YYYY-MM-DD';
  @Input() viewFormat = 'D MMMM YYYY';
  @Input() firstWeekDay = 1;

  private _minDate: moment.Moment;
  private _maxDate: moment.Moment;
  private _dates: moment.Moment[] = [];

  @Input()
  setMinDate(date: (moment.Moment | string) ) {
    this._minDate = this.getMoment(date);

    //filter out active dates
    this.dates = this.dates;
  }

  get minDate() {
    return this._minDate;
  }

  @Input()
  setMaxDate(date: (moment.Moment | string)) {
    this._maxDate = this.getMoment(date);

    //filter out active dates
    this.dates = this.dates;
  }

  get maxDate(): moment.Moment {
    return this._maxDate;
  }

  public get dates(): moment.Moment[] {
    return this._dates;
  }

  // looks heavy for just a setter
  public set dates(dates: moment.Moment[]) {
    dates = dates || [];

    this._dates = dates
      .filter( d => this.isDateValid(d) )
      .sort( (a, b) => <any>a - <any>b );
    this._onValueChanged(this._dates);
  }

  //keep a simple api for when we only use 1 date
  public get date(): moment.Moment {
    return this._dates[0];
  }

  public set date(value: moment.Moment) {
    this.dates = [value];
  }

  private getMoment( date: (moment.Moment | string) ): moment.Moment {
    return moment.isMoment(date) ? date : moment(date, this.format);
  }

  reset() {
    this.dates = [];
  }


  /* Value accessor stuff */
  public onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => void = () => { };

  writeValue(value: any) {
    let values = (value instanceof Array) ? value : [value];

    this.dates = values.map(
      v => this.getMoment(v) );
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

    // we only need to update days state
    // TODO benchmark generateCalendarMonth() with an updateDaysState() function
    //   to see if it's worth it
    this.buildCalendar();
  }

  abstract onDatesChanged(date: moment.Moment[])

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

  /** Returns true when date is between minDate and maxDate */
  isDateValid(date: moment.Moment): boolean {
    return (!this.minDate || date.isBefore(this.minDate)) &&
         (!this.maxDate || date.isAfter(this.maxDate));
  }

  private getDayState(date: moment.Moment): DayState {

    if ( !!this.dates.find( d => d.isSame(date) ) )
      return DayState.active;

    if ( this.dates.length < 2 &&
          date.isBetween(this.dates[0], this.dates[this.dates.length - 1], 'day', '[]') )
      return DayState.selected;

    return this.isDateValid(date) ? DayState.enabled : DayState.disabled;
  }

  // Once we handle locale refractor using .weekDay() instead of .day()
  // and remove @Output() firstWeekDay
  generateCalendarMonth(month: number, year: number): CalendarDay[] {
    let today = moment();

    if (month < 0 || month > 11)
      month = today.month();

    if (!year)
      year = today.year();

    //start date
    let date = moment([year, month]);
    date.subtract( mod(date.day() - this.firstWeekDay), 'd');

    //end date
    let lastWeekDay = mod(this.firstWeekDay - 1);
    let endDate = moment([year, month]).endOf('month');
    endDate.add( mod(lastWeekDay - endDate.day()), 'd');

    let days = [];
    while ( date.isBefore(endDate) ) {
      days.push({
        date: date,
        state: this.getDayState(date),
        isToday: today.isSame(date, 'day'),
        isCurrDisplayMonth: date.month() == month
      });

      date = date.clone().add(1, 'd');
    }

    return days;
  }

  abstract buildCalendar()

}

function mod(n: number): number {
  return ((n % 7) + 7) % 7;
}
