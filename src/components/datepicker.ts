import { Component, Input, OnInit, forwardRef, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import * as moment_ from 'moment';

const moment: any = (<any>moment_).default || moment_;

export interface CalendarDate {
  day: number;
  month: number;
  year: number;
  enabled: boolean;
  today: boolean;
  selected: boolean;
}

export const CALENDAR_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatePickerComponent),
  multi: true
};

@Component({
  selector: 'date-picker',
  template: '<ng-content></ng-content>',
  providers: [CALENDAR_VALUE_ACCESSOR]
})
export class DatePickerComponent implements ControlValueAccessor, OnInit {
  @Input() format = 'YYYY-MM-DD';
  @Input() viewFormat = 'D MMMM YYYY';
  @Input() firstWeekdaySunday = false;

  @Output() onDateChanged = new EventEmitter<any>();

  /* is it used ? */
  private onChange: Function;
  private onTouched: Function;
  /* */

  //can't be private because ngModel on input needs access to it
  protected viewDate: string = null;

  /* Value accessor stuff */
  private onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => void = () => { };

  get value(): any {
    return this.viewDate;
  }

  set value(value: any) {
    let date = (value instanceof moment) ? value : moment(value, this.format);
    this.viewDate = date.format(this.viewFormat);
    //so value may be a moment or a string, shouldn't we be consistent on the value returned ?
    //Below implementation will solve ngOnInit problem
    //this.onChangeCallback( (value instanceof moment) ? value.format(this.format) : value );
    this._onValueChanged(value);
  }

  writeValue(value: any) {
    this.viewDate = value;
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
  /* */

  ngOnInit() {
    setTimeout(() => {
      if (!this.viewDate) {
        let value = moment();
        this.value = value;
        //set value() is already calling onchangecallback
        this._onValueChanged(value.format(this.format));
      }
    });
  }

  private _onValueChanged(value: any) {
    this.onChangeCallback(value);
    this.onDateChanged.emit(value);
  }

  generateCalendar(month: number, year: number): CalendarDate[] {
    let today = moment();

    if (month < 0 || month > 11)
      month = today.month();


    let date = moment([year, month]);

    let n = 1;
    let firstWeekDay: number = (this.firstWeekdaySunday) ? date.date(2).day() : date.date(1).day();

    if (firstWeekDay !== 1) {
      n -= (firstWeekDay + 6) % 7;
    }

    let days = [];
    let selectedDate = moment(this.value, this.viewFormat);
    for (let i = n, end = date.endOf('month').date(); i <= end; i += 1) {
      //why not : let currentDate = moment([year, month, i]);
      let currentDate = moment(`${i}.${month + 1}.${year}`, 'DD.MM.YYYY');
      //why not just => isToday = today.isSame(currentDate, 'day')
      let isToday = (today.isSame(currentDate, 'day') && today.isSame(currentDate, 'month')) ? true : false;
      let selected = (selectedDate.isSame(currentDate, 'day')) ? true : false;

      if (i > 0) {
        days.push({
          day: i,
          month: month + 1,
          year: year,
          enabled: true,
          today: isToday,
          selected: selected
        });
      } else {
        days.push({
          day: null,
          month: null,
          year: null,
          enabled: false,
          today: false,
          selected: false
        });
      }
    }

    return days;
  }

  selectDate(date: CalendarDate) {
    let selectedDate = moment(`${date.day}.${date.month}.${date.year}`, 'DD.MM.YYYY');
    this.value = selectedDate.format(this.format);
    //this.viewDate is already set by set value()
    //this.viewDate = selectedDate.format(this.viewFormat);
  }

}
