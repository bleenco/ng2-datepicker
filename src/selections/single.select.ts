import { Directive, OnChanges, SimpleChanges, forwardRef } from '@angular/core';
import * as moment from 'moment';

import { BaseSelect, isSameDay } from './base.select';
import { DateState } from '../models';

@Directive(BaseSelect.extendConfig({
  selector: '[singleSelect]'
}, SingleSelectDirective))
export class SingleSelectDirective extends BaseSelect<moment.Moment> implements OnChanges {

  protected get EMPTY_VALUE(){ return null; };

  setValue(value: moment.Moment) {
    if ( !value || this.isDateValid(value) )
      this.value = value;
  }

  ngOnChanges(changes: SimpleChanges) {
   if ( !this.isDateValid(this.value) )
      this.value = null;
  }

  selectDate(date: moment.Moment): boolean {
    if( !this.isDateSelectable(date) )
      return false;

    this.value = date;
    return true;
  }

  unselectDate(date: moment.Moment): boolean {
    if (this.isDateSelected(date) ) {
      this.value = null;
      return true;
    }

    return false;
  }

  isDateSelected(date: moment.Moment): boolean {
    return isSameDay(date, this.value);
  }

  isDateInSelectRange(date: moment.Moment): boolean {
    return this.isDateSelected(date);
  }
}

