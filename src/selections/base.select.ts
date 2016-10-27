import { Directive, Component, Input, Output, EventEmitter, DoCheck, ChangeDetectionStrategy } from '@angular/core';

import * as moment from 'moment';

import { DateState } from '../models';
import { extendConfig, selectProvider } from '../config_helpers';

export abstract class BaseSelect<T> implements DoCheck {

  /**
   * Extend the base configuration needed by @Directive
   * @param {Directive} config           subclass configuration
   * @param {Function}  directiveClasses subclass
   * @param {any[]}     ...a             useless just to please compiler if subclass wants to add parameter
   */
  //TODO the ...a trick works to keep compiler quiet but this will be transpiled into unseless code
  static extendConfig(config: Directive, directiveClasses: Function, ...a: any[]) {
    return extendConfig({
      //we could auto-generate it using gulp or something
      inputs: ['minDate', 'maxDate'],
      outputs: ['onDateChange'],
      providers: [selectProvider(directiveClasses)],
      changeDetection: ChangeDetectionStrategy.OnPush
    }, config);
  }

  protected abstract get EMPTY_VALUE(): T

  private _value = this.EMPTY_VALUE;

  get value(): T {
    return this._value;
  }

  /**
   * Set the value without any check (except null) and emit an onDateChange event
   * @param {T} value
   */
  set value(value: T) {
    if (value !== this._value) {
      this.onDateChange.emit( this._value = value || this.EMPTY_VALUE );
      this.hasStateChanged = true;
    }
  }

  private _minDate: moment.Moment;

  /*@Input()*/
  get minDate(): moment.Moment {
    return this._minDate;
  }
  set minDate(date: moment.Moment) {
    this._minDate = date;
    this.hasStateChanged = true;
  }

  private _maxDate: moment.Moment;

  /*@Input()*/
  get maxDate(): moment.Moment {
    return this._maxDate;
  }
  set maxDate(date: moment.Moment) {
    this._maxDate = date;
    this.hasStateChanged = true;
  }

  /*@Output()*/
  onDateChange = new EventEmitter<T>();

  private onStateChange: () => void = () => {};

  registerOnStateChange(fn: () => void) {
    this.onStateChange = fn;
  }

  /* we're kinda doing our own change detection because some inputs
   * may be changed directly by template and not through property binding.
   * Such change are not covered by Angular change detection.
   *
   * We just want to know if something has changed not what has changed so
   * a boolean flag is enough
   */
  public hasStateChanged = false;

  ngDoCheck() {
    if (this.hasStateChanged)
      this.onStateChange();

    this.hasStateChanged = false;
  }

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
      (!this.minDate || date.isSameOrAfter(this.minDate)) &&
      (!this.maxDate || date.isSameOrBefore(this.maxDate));
  }

  abstract getDateState(date: moment.Moment): DateState
}


