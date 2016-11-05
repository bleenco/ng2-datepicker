import { Component, Input, SimpleChanges, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

import * as moment from 'moment';

import { BaseSelect } from '../selections/base.select';
import { CalendarDay } from '../models';
import { extendConfig, formProvider } from '../config_helpers';

export interface Month {
  date: moment.Moment;
  days: CalendarDay[];
}

export abstract class DatePickerTemplate<T extends BaseSelect<V>, V> implements ControlValueAccessor {

   /**
   * Extend the base configuration needed by @Component
   * @param {Component} config           subclass configuration
   * @param {any[]}     ...a             useless just to please compiler if subclass wants to add parameter
   */
  //TODO the ...a trick works to keep compiler quiet but this will be transpiled into unseless code
  static extendConfig(config: Component, componentClass: Function, ...a: any[]) {
    return extendConfig({
      //we could auto-generate it using gulp or something
      inputs: ['locale', 'showSixWeek'],
      providers: [ formProvider(componentClass) ],
      changeDetection: ChangeDetectionStrategy.OnPush
    }, config);
  }

  private _locale: string | false;

  /*@Input()*/ set locale(locale: (string | false)) {
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


  /*@Input()*/ showSixWeek = false;

  protected weekDaysName = moment().localeData().weekdaysShort();
  protected months: Month[] = [];

  //helper
  get month(): Month {
    return this.months[0];
  }

  constructor( protected cd: ChangeDetectorRef, protected select: T ) {
    if (!select)
      throw 'No SelectDirective specified. DatePicker must be coupled with a SelectDirective';

    this.select.registerOnStateChange( () => { this.updateCalendarDays(); } );

    // should we unsubscribe onDestroy since SelectDirective has
    // same lifecycle that this component ?
    this.select.onDateChange.subscribe( d => {
      this.onChangeCallback(d);
    });
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
  get value(): V {
    return this.select.value;
  }

  set value(v: V) {
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
  private generateCalendarDays(date: moment.Moment): CalendarDay[] {
    let today = moment();

    //start date
    let itDate = this.applyLocale( date.clone() );
    itDate.subtract( itDate.weekday(), 'd');

    //end date
    let endDate = this.applyLocale( date.clone().endOf('month') );
    endDate.add( 6 - endDate.weekday(), 'd');

    if (this.showSixWeek) {
      let nbWeeks = endDate.diff(itDate, 'weeks');
      if ( nbWeeks < 5 )
        endDate.add( 5 - nbWeeks, 'weeks');
    }

    let days: CalendarDay[] = [];
    while ( itDate.isBefore(endDate) ) {
      days.push({
        date: itDate.clone(),
        state: this.select.getDateState(itDate),
        isToday: today.isSame(itDate, 'day'),
        isCurrDisplayMonth: itDate.month() == date.month()
      });

      itDate = itDate.add(1, 'd');
    }

    return days;
  }

  private updateCalendarDays() {
    for (let m of this.months) {
      let days = m.days;
      for (let i = 0, l = days.length; i < l; i ++) {
        let day = days[i],
          state = this.select.getDateState(day.date);

        if (day.state != state) {
          days[i] = {
            date: day.date,
            isToday: day.isToday,
            isCurrDisplayMonth: day.isCurrDisplayMonth,
            state: state
          };
        }
      }
    }

    this.cd.markForCheck();
  }

  private newMonth(date: moment.Moment): Month {
    let monthDate = moment([date.year(), date.month()]);
    return {
      date: monthDate,
      days: this.generateCalendarDays(monthDate)
    };
  }

  initMonths(...dates: moment.Moment[]) {
    this.months = dates.map( d => this.newMonth(d) );
    this.cd.markForCheck();
  }

  setMonth(date: moment.Moment, idx = 0) {
    this.months[idx] = this.newMonth(date);
    this.cd.markForCheck();
  }
}
