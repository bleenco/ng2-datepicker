import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import moment from 'moment';

import { BaseSelect, isSameDay } from './base.select';
import { DateState } from '../models';
import { MomentPipe } from '../pipes/moment';

@Directive(BaseSelect.extendConfig({
  selector: '[multiSelect]'
}, MultiSelectDirective))
export class MultiSelectDirective extends BaseSelect<moment.Moment[]> implements OnChanges {

  protected get EMPTY_VALUE() {
    return [];
  }

  private _limit = Infinity;

  @Input('multiSelect')
  get limit() {
    return this._limit;
  }

  set limit(limit: number) {
    this._limit = limit;
  }

  constructor(private momentPipe: MomentPipe) {
    super();
  }

  public setValue(dates: moment.Moment[]) {
    if (dates != this.value) {
      this.value = (dates || [])
        .filter( d => this.isDateValid(d) )
        //TODO TEST : be sure all js engine does not remove any element on
        //  splice(0, -Infinity);
        .splice(0, dates.length - this.limit)
        .map( d => this.getDay(d) )
        .sort( (a, b) => <any>a - <any>b );
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    let value = this.value;

    if (changes['minDate'] || changes['maxDate']) {
      let newValue = value.filter( d => this.isDateValid(d) );
      if (newValue.length < value.length)
        value = newValue;
    }

    if (changes['limit'] && value.length > this.limit)
      value = value.slice(0, this.limit);

    this.value = value;
  }

  selectDate(date: moment.Moment): boolean {
    if( !this.isDateSelectable(date) )
      return false;

    if( this.value.length < this.limit )
      this.value = [...this.value, date]
        .sort( (a,b) => <any>a - <any>b);
    else
      this.value = [date];
  }

  unselectDate(date: moment.Moment): boolean {
    let newValue = this.value.filter( d => !isSameDay(d, date) );
    if (newValue.length < this.value.length) {
      this.value = newValue;
      return true;
    }

    return false;
  }

  isDateSelected(date: moment.Moment): boolean {
    return !!this.value.find( d => isSameDay(d, date) );
  }

  /*
  isDateInSelectRange(date: moment.Moment): boolean {
    return this.value.length > 1 &&
          date.isBetween(this.value[0], this.value[this.value.length - 1], 'day', '[]');
  }
  */

  isComplete(): boolean {
    return this.value && this.value.length == this.limit;
  }

  toString(format = 'LL', locale: string) {
    return this.value.reduce<string>( (prev, date, idx) =>
         prev + (idx == 0 ? '' : ' - ') + this.momentPipe.transform(date, format, locale)
      , '');
  }
}
