import { Directive, OnChanges, SimpleChanges, forwardRef } from '@angular/core';
import moment from 'moment';

import { BaseSelect, isSameDay } from './base.select';
import { DateState } from '../models';
import { MomentPipe } from '../pipes/moment';

export interface RangeDate {
  start: moment.Moment;
  end: moment.Moment;
}

@Directive(BaseSelect.extendConfig({
  selector: '[rangeSelect]'
}, RangeSelectDirective))
export class RangeSelectDirective extends BaseSelect<RangeDate> implements OnChanges {

  protected get EMPTY_VALUE(): RangeDate {
    return {
        start: null,
        end: null
      };
  };

  constructor(private momentPipe: MomentPipe) {
    super();
  }

  setValue(value: RangeDate) {
    if(!value)
      this.value = null;
    else if ( value !== this.value) {
      if ( !this.isDateValid(value.start) )
        value.start = null;

      if ( !this.isDateValid(value.end) )
        value.end = null;

      this.value = value;
    }
  }

  setStartDate(date: moment.Moment) {
    this.value = {
      start: date,
      end: this.value.end
    };
  }

  setEndDate(date: moment.Moment) {
    this.value = {
      start: this.value.start,
      end: date
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    let start = this.value.start,
       end = this.value.end;

    if ( !this.isDateValid(this.value.start) )
      start = null;

    if ( !this.isDateValid(this.value.end) )
      end = null;

    if ( start !== this.value.start || end !== this.value.end )
      this.value = {
        start: start,
        end: end
      };
  }

  selectDate(date: moment.Moment): boolean {
    if( !date || !this.isDateValid(date) )
      return false;

    if(this.isDateSelected(date))
      return !this.unselectDate(date);

    let start = this.value.start,
        end = this.value.end;

    if(!start)
      start = date;
    else if(!end)
      end = date;
    else {
      if(Math.abs(date.diff(start)) <= Math.abs(date.diff(end)))
        this.setStartDate(date);
      else
        this.setEndDate(date);

      return true;
    }

    if( start && end && start.isAfter(end)) {
      this.value = {
        start: end,
        end: start
      };
    }
    else
      this.value = {
        start: start,
        end: end
      }

    return true;
  }

  unselectDate(date: moment.Moment): boolean {
    if (date) {

      if (isSameDay(date, this.value.start)){
        this.setStartDate(null);
        return true;
      }

      if(isSameDay(date, this.value.end)){
        this.setEndDate(null);
        return true;
      }
    }

    return false;
  }

  isDateSelected(date: moment.Moment): boolean {
    return date && (isSameDay(date, this.value.start) || isSameDay(date, this.value.end));
  }

  isDateInSelectRange(date: moment.Moment): boolean {
    let start = this.value.start,
        end = this.value.end;
    return start && end &&
         date.isSameOrAfter(start, 'd') &&
         date.isSameOrBefore(end, 'd');
  }

  isComplete(): boolean {
    return !!this.value.start && !!this.value.end;
  }

  toString(format = 'LL', locale: string) {
    if (!this.value || (!this.value.start && !this.value.end) )
      return '';

    return this.momentPipe.transform(this.value.start, format, locale) +
           ' - ' +
           this.momentPipe.transform(this.value.end, format, locale);
  }
}

