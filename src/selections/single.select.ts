import { Directive, OnChanges, SimpleChanges, forwardRef } from '@angular/core';
import * as moment from 'moment';

import { BaseSelect } from './base.select';
import { DateState } from '../models';

@Directive({
  selector: '[singleSelect]',
  providers: [{
    provide: BaseSelect, useExisting: forwardRef(() => SingleSelectDirective)
  }]
})
export class SingleSelectDirective extends BaseSelect<moment.Moment> implements OnChanges {

  private _date: moment.Moment;

  get value(): moment.Moment {
    return this._date;
  }

  set value(value: moment.Moment) {
    if ( !value || this.isDateValid(value) ) {
      this._date = this.getDay(value);
      this.onChange.emit(this._date);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if ( changes['minDate'] || changes['maxDate'] ) {

      if ( !this.isDateValid(this.value) )
        this.value = null;

      // TODO template must be updated because day state changed
      // Careful here because this.value = null has already emit a onChange value
      // which has already produce a template refresh.
      // We should try to avoid to do it twice.
    }
  }

  selectDate(date: moment.Moment) {
    this.value = date;
  }

  getDateState(date: moment.Moment): DateState {
    return date.isSame(this.value, 'day') ? DateState.active :
      this.isDateValid(date) ? DateState.enabled : DateState.disabled;
  }
}

