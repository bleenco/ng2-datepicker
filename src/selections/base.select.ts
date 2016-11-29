import { Directive, Input, Output, EventEmitter, DoCheck, ChangeDetectionStrategy } from '@angular/core';

import moment from 'moment';

import { DateState } from '../models';
import { extendDirConfig, selectProvider } from '../config_helpers';

export abstract class BaseSelect<T> implements DoCheck {

  /**
   * Extend the base configuration needed by @Directive
   * @param {Directive} config           subclass configuration
   * @param {Function}  directiveClasses subclass
   * @param {any[]}     ...a             useless just to please compiler if subclass wants to add parameter
   */
  //TODO the ...a trick works to keep compiler quiet but this will be transpiled into unseless code
  static extendConfig(config: Directive, directiveClasses: Function, ...a: any[]) {
    return extendDirConfig({
      //we could auto-generate it using gulp or something
      inputs: ['minDate', 'maxDate'],
      outputs: ['onDateChange'],
      providers: [selectProvider(directiveClasses)],
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
     /* Use of a function so it can be override */
    this._setValue(value);
  }

  // TODO add an emitEvent parameter ? We would have to delete the setter
  protected _setValue(value: T) {
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

  /**
   * Should probably always start as :
   *
   * if( !this.isDateSelectable(date) )
   *   return false
   *
   * @param  {moment.Moment} date [description]
   * @return {boolean}            [description]
   */
  abstract selectDate(date: moment.Moment): boolean
  abstract unselectDate(date: moment.Moment): boolean
  abstract isDateSelected(date: moment.Moment): boolean

  isDateInSelectRange(date: moment.Moment): boolean {
    return this.isDateSelected(date);
  }

  /** Returns true when date is between minDate and maxDate */
  isDateValid(date: moment.Moment): boolean {
    return date &&
      (!this.minDate || date.isSameOrAfter(this.minDate, 'd')) &&
      (!this.maxDate || date.isSameOrBefore(this.maxDate, 'd'));
  }

  /**
   * return true if date is selectable meaning :
   *  - not null
   *  - valid
   *  - not already selected
   * Primarly meant to be used by selectDate() of subclass
   * @param  {moment.Moment} date [description]
   * @return {boolean}            [description]
   */
  protected isDateSelectable(date: moment.Moment): boolean {
    return date && this.isDateValid(date) && !this.isDateSelected(date);
  }

  getDateState(date: moment.Moment): DateState {
    if(this.isDateSelected(date))
      return DateState.selected;

    if(this.isDateInSelectRange(date))
      return DateState.inRange;

    if(this.isDateValid(date))
      return DateState.enabled;

    return DateState.disabled;
  }

  abstract isComplete(): boolean;

  /**
   * return a string representation of the selected values.
   * All arguments must have a default value or be optional to keep a good behavior
   * when toString() is called without arguments.
   * @param  {string} format
   * @param  {string} locale
   * @return {string}
   */
  abstract toString(format: string, locale?: string): string;
}

//helper
export function isSameDay(date1: moment.Moment, date2: moment.Moment) {
  if (date1 && date2)
    return date1.isSame(date2, 'd');

  return false;
}
