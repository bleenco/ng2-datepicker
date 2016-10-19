import { Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

import * as moment from 'moment';

import { BaseSelect } from '../selections/base.select';
import { CalendarDay } from '../models';

export abstract class DatePickerTemplate implements ControlValueAccessor {

  @Input() firstWeekDay: number;
  @Input() viewFormat = 'D MM YYYY';

  constructor( protected select: BaseSelect<any> ) {
    // should we unsubscribe onDestroy since SelectDirective has
    // same lifecycle that this component ?
    this.select.onChange.subscribe( d => this.buildCalendar() );
  }

  /* Value accessor stuff */
  public onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => void = () => { };

  // TODO should we check that value match SelectDirective's expected value type ?
  // If so how ?
  writeValue(value: any) {
    this.select.value = value;
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
  /* */

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

    let days: CalendarDay[] = [];
    while ( date.isBefore(endDate) ) {
      days.push({
        date: date,
        state: this.select.getDateState(date),
        isToday: today.isSame(date, 'day'),
        isCurrDisplayMonth: date.month() == month
      });

      date = date.clone().add(1, 'd');
    }

    return days;
  }

  abstract buildCalendar();
}


function mod(n: number): number {
  return ((n % 7) + 7) % 7;
}
