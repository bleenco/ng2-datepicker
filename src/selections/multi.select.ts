import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as moment from 'moment';

import { BaseSelect } from './base.select';
import { DateState } from '../models';

//helper function
function eqDay(date: moment.Moment) {
  return d => d.isSame(date, 'day');
}

@Directive(BaseSelect.extendConfig({
  selector: '[multiSelect]'
}, MultiSelectDirective))
export class MultiSelectDirective extends BaseSelect<moment.Moment[]> implements OnChanges {

  protected get EMPTY_VALUE() {
    return [];
  }

  @Input('multiSelect') limit = Infinity;

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
    //@see SingleSelectDirective's ngOnchanges comment
  }

  selectDate(date: moment.Moment): boolean {
    if ( !this.isDateSelected(date) &&
          this.isDateValid(date) &&
          this.value.length < this.limit ) {

      this.value = [...this.value, date];
      return true;
    }

    return false;
  }

  unselectDate(date: moment.Moment): boolean {
    let newValue = this.value.filter( eqDay(date) );
    if (newValue.length < this.value.length) {
      this.value = newValue;
      return true;
    }

    return false;
  }

  isDateSelected(date: moment.Moment): boolean {
    return !!this.value.find( eqDay(date) );
  }

  getDateState(date: moment.Moment): DateState {
    if ( !!this.value.find( eqDay(date) ) )
      return DateState.active;

    if ( this.value.length > 1 &&
          date.isBetween(this.value[0], this.value[this.value.length - 1], 'day', '[]') )
      return DateState.selected;

    return this.isDateValid(date) ? DateState.enabled : DateState.disabled;
  }
}
