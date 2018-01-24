import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef, HostListener, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import {
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  setYear,
  eachDay,
  getDate,
  getMonth,
  getYear,
  isToday,
  isSameDay,
  isSameMonth,
  isSameYear,
  format,
  getDay,
  subDays,
  setDay
} from 'date-fns';
import { ISlimScrollOptions } from 'ngx-slimscroll';

export interface DatepickerOptions {
  minYear?: number; // default: current year - 30
  maxYear?: number; // default: current year + 30
  displayFormat?: string; // default: 'MMM D[,] YYYY'
  barTitleFormat?: string; // default: 'MMMM YYYY'
  dayNamesFormat?: string; // default 'ddd'
  barTitleIfEmpty?: string;
  firstCalendarDay?: number; // 0 = Sunday (default), 1 = Monday, ..
  locale?: object;
  minDate?: Date;
  maxDate?: Date;
}

/**
 * Internal library helper that helps to check if value is empty
 * @param value
 */
const isNil = (value: Date | DatepickerOptions) => {
  return (typeof value === 'undefined') || (value === null);
};

@Component({
  selector: 'ng-datepicker',
  templateUrl: 'ng-datepicker.component.html',
  styleUrls: ['ng-datepicker.component.sass'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgDatepickerComponent), multi: true }
  ]
})
export class NgDatepickerComponent implements ControlValueAccessor, OnInit, OnChanges {
  @Input() options: DatepickerOptions;

  /**
   * Disable datepicker's input
   */
  @Input() headless = false;

  /**
   * Set datepicker's visibility state
   */
  @Input() isOpened = false;

  /**
   * Datepicker dropdown position
   */
  @Input() position = 'bottom-right';

  private positions = ['bottom-left', 'bottom-right', 'top-left', 'top-right'];

  innerValue: Date;
  displayValue: string;
  displayFormat: string;
  date: Date;
  barTitle: string;
  barTitleFormat: string;
  barTitleIfEmpty: string;
  minYear: number;
  maxYear: number;
  firstCalendarDay: number;
  view: string;
  years: { year: number; isThisYear: boolean }[];
  dayNames: string[];
  dayNamesFormat: string;
  scrollOptions: ISlimScrollOptions;
  days: {
    date: Date;
    day: number;
    month: number;
    year: number;
    inThisMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    isSelectable: boolean;
  }[];
  locale: object;

  private onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => void = () => { };

  get value(): Date {
    return this.innerValue;
  }

  set value(val: Date) {
    this.innerValue = val;
    this.onChangeCallback(this.innerValue);
  }

  constructor(private elementRef: ElementRef) {
    this.scrollOptions = {
      barBackground: '#DFE3E9',
      gridBackground: '#FFFFFF',
      barBorderRadius: '3',
      gridBorderRadius: '3',
      barWidth: '6',
      gridWidth: '6',
      barMargin: '0',
      gridMargin: '0'
    };
  }

  ngOnInit() {
    this.view = 'days';
    this.date = new Date();
    this.setOptions();
    this.initDayNames();
    this.initYears();

    // Check if 'position' property is correct
    if (this.positions.indexOf(this.position) === -1) {
      throw new TypeError(`ng-datepicker: invalid position property value '${this.position}' (expected: ${this.positions.join(', ')})`);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('options' in changes) {
      this.setOptions();
      this.initDayNames();
      this.init();
      this.initYears();
    }
  }

  setOptions(): void {
    const today = new Date(); // this const was added because during my tests, I noticed that at this level this.date is undefined
    this.minYear = this.options && this.options.minYear || getYear(today) - 30;
    this.maxYear = this.options && this.options.maxYear || getYear(today) + 30;
    this.displayFormat = this.options && this.options.displayFormat || 'MMM D[,] YYYY';
    this.barTitleFormat = this.options && this.options.barTitleFormat || 'MMMM YYYY';
    this.dayNamesFormat = this.options && this.options.dayNamesFormat || 'ddd';
    this.barTitleIfEmpty = this.options && this.options.barTitleIfEmpty || 'Click to select a date';
    this.firstCalendarDay = this.options && this.options.firstCalendarDay || 0;
    this.locale = this.options && { locale: this.options.locale } || {};
  }

  nextMonth(): void {
    this.date = addMonths(this.date, 1);
    this.init();
  }

  prevMonth(): void {
    this.date = subMonths(this.date, 1);
    this.init();
  }

  setDate(i: number): void {
    this.date = this.days[i].date;
    this.value = this.date;
    this.init();
    this.close();
  }

  setYear(i: number): void {
    this.date = setYear(this.date, this.years[i].year);
    this.init();
    this.initYears();
    this.view = 'days';
  }

  /**
   * Checks if specified date is in range of min and max dates
   * @param date
   */
  private isDateSelectable(date: Date): boolean {
    if (isNil(this.options)) {
      return true;
    }

    const minDateSet = !isNil(this.options.minDate);
    const maxDateSet = !isNil(this.options.maxDate);
    const timestamp = date.valueOf();

    if (minDateSet && (timestamp < this.options.minDate.valueOf())) {
      return false;
    }

    if (maxDateSet && (timestamp > this.options.maxDate.valueOf())) {
      return false;
    }

    return true;
  }

  init(): void {
    const start = startOfMonth(this.date);
    const end = endOfMonth(this.date);

    this.days = eachDay(start, end).map(date => {
      return {
        date: date,
        day: getDate(date),
        month: getMonth(date),
        year: getYear(date),
        inThisMonth: true,
        isToday: isToday(date),
        isSelected: isSameDay(date, this.innerValue) && isSameMonth(date, this.innerValue) && isSameYear(date, this.innerValue),
        isSelectable: this.isDateSelectable(date)
      };
    });

    const tmp = getDay(start) - this.firstCalendarDay;
    const prevDays = tmp < 0 ? 7 - this.firstCalendarDay : tmp;

    for (let i = 1; i <= prevDays; i++) {
      const date = subDays(start, i);
      this.days.unshift({
        date: date,
        day: getDate(date),
        month: getMonth(date),
        year: getYear(date),
        inThisMonth: false,
        isToday: isToday(date),
        isSelected: isSameDay(date, this.innerValue) && isSameMonth(date, this.innerValue) && isSameYear(date, this.innerValue),
        isSelectable: this.isDateSelectable(date)
      });
    }

    this.displayValue = this.innerValue ? format(this.innerValue, this.displayFormat, this.locale) : '';
    this.barTitle =  this.innerValue ? format(start, this.barTitleFormat, this.locale) : this.barTitleIfEmpty;
  }

  initYears(): void {
    const range = this.maxYear - this.minYear;
    this.years = Array.from(new Array(range), (x, i) => i + this.minYear).map(year => {
      return { year: year, isThisYear: year === getYear(this.date) };
    });
  }

  initDayNames(): void {
    this.dayNames = [];
    const start = this.firstCalendarDay;
    for (let i = start; i <= 6 + start; i++) {
      const date = setDay(new Date(), i);
      this.dayNames.push(format(date, this.dayNamesFormat, this.locale));
    }
  }

  toggleView(): void {
    this.view = this.view === 'days' ? 'years' : 'days';
  }

  toggle(): void {
    this.isOpened = !this.isOpened;
  }

  close(): void {
    this.isOpened = false;
  }

  writeValue(val: Date) {
    if (val) {
      this.date = val;
      this.innerValue = val;
      this.init();
      this.displayValue = format(this.innerValue, this.displayFormat, this.locale);
      this.barTitle = format(startOfMonth(val), this.barTitleFormat, this.locale);
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  @HostListener('document:click', ['$event']) onBlur(e: MouseEvent) {
    if (!this.isOpened) {
      return;
    }

    const input = this.elementRef.nativeElement.querySelector('.ngx-datepicker-input');

    if (input == null) {
      return;
    }

    if (e.target === input || input.contains(<any>e.target)) {
      return;
    }

    const container = this.elementRef.nativeElement.querySelector('.ngx-datepicker-calendar-container');
    if (container && container !== e.target && !container.contains(<any>e.target) && !(<any>e.target).classList.contains('year-unit')) {
      this.close();
    }
  }
}
