import { Component, Input, SimpleChanges } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

import * as moment from 'moment';

import { BaseSelect } from '../selections/base.select';
import { CalendarDay } from '../models';
import { extendConfig } from '../config_helpers';

export abstract class DatePickerTemplate implements ControlValueAccessor {

  static extendConfig(config, ...a: any[]) {
    return extendConfig({
      //we could auto-generated it using gulp or something
      inputs: ['locale', 'viewFormat', 'displayDate']
    }, config);
  }

  private _locale: string | false;

  @Input() set locale(locale: (string | false)) {
    this._locale = (!locale || locale.length == 0) ? false : locale;

    //with global locale we can call weekdaysShort() with a boolean to get array in locale order
    //unfortunately we can't for local locale, must do it ourselves.
    let localeData = this.applyLocale( moment() ).localeData()
    let weekdays = localeData.weekdaysShort();
                                                           // typings not up to date
    this.weekDaysName = weekdays.concat(weekdays.splice(0, (<any>localeData).firstDayOfWeek()))
  }

  get locale(): (string | false) {
    return this._locale;
  }

  @Input() viewFormat = 'LL';

    //only month and year relevant
  @Input() displayDate = moment();

  // use displayDate just to avoid recreating a moment object
  protected weekDaysName = this.displayDate.localeData().weekdaysShort();

  constructor( protected select: BaseSelect<any> ) {
    if (!select)
      throw 'No SelectDirective specified. DatePicker must be coupled with a SelectDirective';

    // should we unsubscribe onDestroy since SelectDirective has
    // same lifecycle that this component ?
    this.select.onChange.subscribe( d => {
      this.onChangeCallback(d);
      this.buildCalendar();
    });
  }

  private localeDate(date: moment.Moment): moment.Moment {
    if(this.locale)
      return date.clone().locale(this.locale);

    return date;
  }

  /* Value accessor stuff */
  public onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => void = () => { };

  // TODO should we check that value match SelectDirective's expected value type ?
  // If so how ?
  // TODO use setValue() ?
  writeValue(value: any) {
    this.select.value = value;
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
  /* */

  //helper
  get value(): any {
    return this.select.value;
  }

  set value(v: any) {
    this.select.value = v;
  }

  protected applyLocale(date: moment.Moment): moment.Moment {
    if(this.locale)
      date.locale(this.locale);

    return date;
  }

  /**
   * Generate an Array of CalendarDay representing a month to display,
   * with extra days from previous and next month to get plain weeks.
   * @param  {number}        month
   * @param  {number}        year
   * @param  {boolean}       showSixWeek true if we should always returns 6 weeks,
   * this will avoid calendar to change size depending on month displayed.
   * @return {CalendarDay[]}             Array of CalendarDay representing a month to display
   */
  generateCalendarMonth(month: number, year: number, showSixWeek?: boolean): CalendarDay[] {
    let today = moment();

    if (month < 0 || month > 11)
      month = today.month();

    if (!year)
      year = today.year();

    //start date
    let date = this.applyLocale( moment([year, month]) );
    date.subtract( date.weekday(), 'd');

    //end date
    let endDate = this.applyLocale( moment([year, month]).endOf('month') );
    endDate.add( 6 - endDate.weekday(), 'd');

    if (showSixWeek) {
      let nbWeeks = endDate.diff(date, 'weeks');
      if ( nbWeeks < 5 )
        endDate.add( 5 - nbWeeks, 'weeks');
    }

    let days: CalendarDay[] = [];
    while ( date.isBefore(endDate) ) {
      days.push({
        date: date,
        state: this.select.getDateState(date),
        isToday: today.isSame(date, 'day'),
        isCurrDisplayMonth: date.month() == month
      });

      date = date.clone().add(1, 'd');
    }

    return days;
  }

  abstract buildCalendar();
}


function mod(n: number): number {
  return ((n % 7) + 7) % 7;
}
