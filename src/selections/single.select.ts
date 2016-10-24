import { Directive, OnChanges, SimpleChanges, forwardRef } from '@angular/core';
import * as moment from 'moment';

import { BaseSelect } from './base.select';
import { selectProvider } from '../config_helpers';
import { DateState } from '../models';

@Directive({
  selector: '[singleSelect]',
  providers: [ selectProvider(SingleSelectDirective) ]
})
export class SingleSelectDirective extends BaseSelect<moment.Moment> implements OnChanges {

  protected EMPTY_VALUE = null;

  setValue(value: moment.Moment) {
    if ( !value || this.isDateValid(value) )
      this.value = value;
  }

  ngOnChanges(changes: SimpleChanges) {
   if ( !this.isDateValid(this.value) )
      this.value = null;

    // TODO template must be updated because day state changed
    // Careful here because this.value = null has already emit a onChange value
    // which has most likely already produce a template refresh.
    // We should try to avoid to do it twice.
  }

  selectDate(date: moment.Moment): boolean {
    this.value = date;

    return true;
  }

  unselectDate(date: moment.Moment): boolean {
    if (date && date.isSame(this.value, 'day') ) {
      this.value = null;
      return true;
    }

    return false;
  }

  isDateSelected(date: moment.Moment): boolean {
    return date.isSame(this.value, 'day');
  }

  getDateState(date: moment.Moment): DateState {
    return date.isSame(this.value, 'day') ? DateState.active :
      this.isDateValid(date) ? DateState.enabled : DateState.disabled;
  }
}

