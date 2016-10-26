import { Directive, Component, Input, Output, EventEmitter } from '@angular/core';

import * as moment from 'moment';

import { DateState } from '../models';
import { extendConfig, selectProvider } from '../config_helpers';

export abstract class BaseSelect<T> {

  /**
   * Extend the base configuration needed by @Directive
   * @param {Directive} config           subclass configuration
   * @param {Function}  directiveClasses subclass
   * @param {any[]}     ...a             useless just to please compiler if subclass wants to add parameter
   */
  //TODO the ...a trick works to keep compiler quiet but this will be transpiled into unseless code
  static extendConfig(config: Directive, directiveClasses: Function, ...a: any[]) {
    return extendConfig({
      //we could auto-generated it using gulp or something
      inputs: ['minDate', 'maxDate', 'onChange'],
      providers: [selectProvider(directiveClasses)]
    }, config);
  }

  protected EMPTY_VALUE: T

  private _value = this.EMPTY_VALUE;

  get value(): T {
    return this._value;
  }

  /**
   * Set the value without any check (except null) and emit an onChange event
   * @param {T} value
   */
  set value(value: T) {
    if (value != this._value)
      this.onChange.emit(this._value = value || this.EMPTY_VALUE);
  }

  @Input() minDate: moment.Moment;
  @Input() maxDate: moment.Moment;

  @Output() onChange = new EventEmitter<T>();

  /**
   * Set value with guards for min/max and limit(multi)
   * @param {T}
   * @return {moment.Moment}
   */
  abstract setValue(value: T): void

  /**
   * Return a date corresponding to the day of the input date.
   * We don't want to introduce time in our dates.
   * @param  {moment.Moment} date A date that may have time in it
   * @return {moment.Moment}      A date corresponding to a day with all time unit to 0.
   */
  protected getDay(date: moment.Moment): moment.Moment {
    return date ? moment([ date.year, date.month, date.date]) : null;
  }

  abstract selectDate(date: moment.Moment): boolean
  abstract unselectDate(date: moment.Moment): boolean
  abstract isDateSelected(date: moment.Moment): boolean

  /** Returns true when date is between minDate and maxDate */
  isDateValid(date: moment.Moment): boolean {
    return date &&
      (!this.minDate || date.isBefore(this.minDate)) &&
      (!this.maxDate || date.isAfter(this.maxDate));
  }

  abstract getDateState(date: moment.Moment): DateState
}


