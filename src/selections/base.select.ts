import { Input, Output, EventEmitter } from '@angular/core';

import * as moment from 'moment';

import { DateState } from '../models';

export abstract class BaseSelect<T> {

  @Input() minDate: moment.Moment;
  @Input() maxDate: moment.Moment;

  @Output() onChange = new EventEmitter<T>();

  /**
   * Return a date corresponding to the day of the input date.
   * We don't want to introduce time in our dates.
   * @param  {moment.Moment} date A date that may have time in it
   * @return {moment.Moment}      A date corresponding to a day with all time unit to 0.
   */
  protected getDay(date: moment.Moment): moment.Moment {
    return date ? moment([ date.year, date.month, date.date]) : null;
  }

  abstract set value(v: T)
  abstract get value(): T

  abstract selectDate(date: moment.Moment): void

  /** Returns true when date is between minDate and maxDate */
  isDateValid(date: moment.Moment): boolean {
    return date &&
      (!this.minDate || date.isBefore(this.minDate)) &&
      (!this.maxDate || date.isAfter(this.maxDate));
  }

  abstract getDateState(date: moment.Moment): DateState
}


