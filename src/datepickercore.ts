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

  @Input()
  setMinDate(date: (moment.Moment | string) ) {
    this._minDate = this.getMoment(date);
  }

  get minDate() {
    return this._minDate;
  }

  @Input()
  setMaxDate(date: (moment.Moment | string)) {
    this._maxDate = this.getMoment(date);
  }

  get maxDate(): moment.Moment {
    return this._maxDate;
  }

  protected getMoment( date: (moment.Moment | string) ): moment.Moment {
    return moment.isMoment(date) ? date : moment(date, this.format);
  }

  abstract reset(): void

  /* Value accessor stuff */
  public onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => void = () => { };

  abstract writeValue(value: any): void

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
  /* */

  onValueChanged(value: (moment.Moment | moment.Moment[]) ) {
    this.onChangeCallback(value);

    // we only need to update days state
    // TODO benchmark generateCalendarMonth() with an updateDaysState() function
    //   to see if it's worth it
    this.buildCalendar();
  }

  /** Returns true when date is between minDate and maxDate */
  isDateValid(date: moment.Moment): boolean {
    return date &&
      (!this.minDate || date.isBefore(this.minDate)) &&
      (!this.maxDate || date.isAfter(this.maxDate));
  }

  abstract getDayState(date: moment.Moment): DayState

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
