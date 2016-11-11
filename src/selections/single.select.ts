import { Directive, OnChanges, SimpleChanges, forwardRef } from '@angular/core';
import moment from 'moment';

import { BaseSelect, isSameDay } from './base.select';
import { DateState } from '../models';
import { MomentPipe } from '../pipes/moment';

@Directive(BaseSelect.extendConfig({
  selector: '[singleSelect]'
}, SingleSelectDirective))
export class SingleSelectDirective extends BaseSelect<moment.Moment> implements OnChanges {

  protected get EMPTY_VALUE(){ return null; };

  constructor(private momentPipe: MomentPipe) {
    super();
  }

  setValue(value: moment.Moment) {
    if ( !value || this.isDateValid(value) )
      this._setValue(value);
  }

  ngOnChanges(changes: SimpleChanges) {
   if ( !this.isDateValid(this.value) )
      this._setValue(null);
  }

  selectDate(date: moment.Moment): boolean {
    if( !this.isDateSelectable(date) )
      return false;

    this._setValue(date);
    return true;
  }

  unselectDate(date: moment.Moment): boolean {
    if (this.isDateSelected(date) ) {
      this._setValue(null);
      return true;
    }

    return false;
  }

  isDateSelected(date: moment.Moment): boolean {
    return isSameDay(date, this.value);
  }

  isComplete(): boolean {
    return !!this.value;
  }

  toString(format = 'LL', locale: string) {
    return this.momentPipe.transform(this.value, format, locale);
  }
}

