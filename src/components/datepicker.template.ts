import { Component, Input, SimpleChanges, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

import moment from 'moment';

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

  weekDaysName = moment.weekdaysShort(true);

  /**
   * /!\ Only use it on template or as a READONLY property. Should never be mutated, use helpers functions instead.
   * It's public because of aot.
   * @type {Month[]}
   */
  months: Month[] = [];

  /**
   * helper function when displaying only 1 month.
   * /!\ Like {@link #months} it's meant for use on template only. Never mutate this property.
   * @return {Month} [description]
   */
  get month(): Month {
    return this.months[0];
  }

  constructor( protected cd: ChangeDetectorRef, protected select: T ) {
    if (!select)
      throw 'No SelectDirective specified. DatePicker must be coupled with a SelectDirective';

    this.select.registerOnStateChange( () => {
      //Do it on next tick to avoid detached element to be processed
      setTimeout( () => {
        this.updateCalendarDays();
      })
    });

    // should we unsubscribe onDestroy since SelectDirective has
    // same lifecycle that this component ?
    this.select.onDateChange.subscribe( d => {
      this.onChangeCallback(d);
    });
  }

  /* Value accessor stuff */
  public onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: V) => void = () => { };

  // TODO should we check that value match SelectDirective's expected value type ?
  // If so how ?
  // TODO use setValue() ?
  writeValue(value: V) {
    this.select.value = value;
  }

  registerOnChange(fn: (_: V) => void) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void) {
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

  private newMonth(date = moment()): Month {
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

  getMonthDate(idx = 0): moment.Moment {
    let month = this.months[idx];
    if( month )
       return month.date.clone();

    return null;
  }

  addMonth(date = moment()): number {
    if(date) {
      this.months.push( this.newMonth(date) );
      this.cd.markForCheck();

      return this.months.length-1;
    }

    return -1;
  }

  removeMonth(idx: number) {
    this.months.splice(idx, 1);
    this.cd.markForCheck();
  }

  changeMonth(date: moment.Moment, idx = 0) {
    let current_month = this.months[idx];
    if(date && !date.isSame(current_month.date, 'M') ) {
      let monthDate = moment([date.year(), date.month()]);
      current_month.date = monthDate;
      current_month.days = this.generateCalendarDays(monthDate);

      this.cd.markForCheck();
    }
  }
}
