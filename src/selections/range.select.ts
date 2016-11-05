import { Directive, OnChanges, SimpleChanges, forwardRef } from '@angular/core';
import * as moment from 'moment';

import { BaseSelect, isSameDay } from './base.select';
import { DateState } from '../models';

export interface RangeDate {
  start: moment.Moment;
  end: moment.Moment;
}

class RangeDateImpl implements RangeDate {
  private onChange = (v: RangeDate) => {};

  private _start: moment.Moment;
  get start() {
    return this._start;
  }
  set start(date: moment.Moment) {
    this._start = date;

    this.onChange(this);
  }

  private _end: moment.Moment;
  get end() {
    return this._end;
  }
  set end(date: moment.Moment) {
    this._end = date;

    this.onChange(this);
  }

  constructor(rangeDate: RangeDate, onchange: (v: RangeDate) => void) {
    this.start = rangeDate.start;
    this.end = rangeDate.end;

    this.onChange = onchange;
  }
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

  setValue(value: RangeDate) {
    if ( value !== this.value) {
      if ( !this.isDateValid(value.start) )
        value.start = null;

      if ( !this.isDateValid(value.end) )
        value.end = null;

      this.value = new RangeDateImpl(value, v => {
        this.onDateChange.emit(v);
        this.hasStateChanged = true;
      });
    }
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
    if( !this.isDateSelectable(date) )
      return false;

    if(!this.value.start)
      this.value.start = date;
    else if(!this.value.end)
      this.value.end = date;
    else {
      let diffStart = Math.abs(date.diff(this.value.start))
      let diffEnd = Math.abs(date.diff(this.value.end))

      if(diffStart < diffEnd)
        this.value.start = date;
      else
        this.value.end = date;
    }

    return true;
  }

  unselectDate(date: moment.Moment): boolean {
    if (date) {

      if (isSameDay(date, this.value.start)){
        this.value.start = null;
        return true;
      }

      if(isSameDay(date, this.value.end)){
        this.value.end = null;
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
}

