import { getYear, Locale } from 'date-fns';
import { InjectionToken } from '@angular/core';
import locale from 'date-fns/locale/en-US';

export interface DatepickerOptions {
  minDate?: Date | null;
  maxDate?: Date | null;
  minYear?: number;
  maxYear?: number;
  placeholder?: string;
  format?: string;
  formatTitle?: string;
  formatDays?: string;
  firstCalendarDay?: number;
  locale?: Locale;
  position?: 'left' | 'right' | 'bottom' | 'top';
  inputClass?: string;
  calendarClass?: string;
  scrollBarColor?: string;
  enableKeyboard?: boolean;
  disabled?: boolean;
}

export const DATEPICKER_OPTIONS = new InjectionToken<DatepickerOptions>('Datepicker config');

export function mergeDatepickerOptions(opts: DatepickerOptions): DatepickerOptions {
  return { ...defaultOptions, ...opts };
}

export const defaultOptions: DatepickerOptions = {
  minDate: null,
  maxDate: null,
  minYear: getYear(new Date()) - 30,
  maxYear: getYear(new Date()) + 30,
  placeholder: '',
  format: 'LLLL do yyyy',
  formatTitle: 'LLLL yyyy',
  formatDays: 'EEEEE',
  firstCalendarDay: 0,
  locale,
  position: 'bottom',
  inputClass: '',
  calendarClass: 'datepicker-default',
  scrollBarColor: '#dfe3e9',
  enableKeyboard: true,
  disabled: false,
};
