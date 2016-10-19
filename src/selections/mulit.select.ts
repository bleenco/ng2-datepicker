import { Directive, forwardRef, OnChanges, SimpleChanges } from '@angular/core';
import * as moment from 'moment';

import { BaseSelect } from './base.select';
import { DateState } from '../models';

@Directive({
  selector: '[multiSelect]',
  providers: [{
    provide: BaseSelect, useExisting: forwardRef(() => MultiSelectDirective)
  }]
})
export class MultiSelectDirective extends BaseSelect<moment.Moment[]> implements OnChanges {

  protected _dates: moment.Moment[] = [];

  public get value(): moment.Moment[] {
    return this._dates;
  }

  // looks heavy for a function used on setter
  protected formatValue(dates: moment.Moment[]) {
    return (dates || [])
        .filter( d => this.isDateValid(d) )
        .map( d => this.getDay(d) )
        .sort( (a, b) => <any>a - <any>b );
  }

  public set value(dates: moment.Moment[]) {
    if (dates != this._dates) {
      this._dates = this.formatValue(dates);
      this.onChange.emit(this._dates);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['minDate'] || changes['maxDate']) {
      // filter is done by setter
      //
      // TODO
      // - setter will emit an onChange event even if values didn't changed
      // - also we're gonna do a map() and a sort() on the setter : both useless here
      // are those problematic ?
      this.value = this.value;

      //@see SingleSelectDirective's ngOnchanges comment
    }
  }

  selectDate(date: moment.Moment) {
    let newValue = this.value.filter( d => d.isSame(date, 'day') );

    //we didn't filter any value
    if (newValue.length == this.value.length)
      this.value = [...this.value, date];
    else
      this.value = newValue;
  };

  getDateState(date: moment.Moment): DateState {

    if ( !!this.value.find( d => d.isSame(date, 'day') ) )
      return DateState.active;

    if ( this.value.length > 1 &&
          date.isBetween(this.value[0], this.value[this.value.length - 1], 'day', '[]') )
      return DateState.selected;

    return this.isDateValid(date) ? DateState.enabled : DateState.disabled;
  }
}
