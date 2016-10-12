import { Component, Input, ElementRef, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import * as moment_ from 'moment';

const moment: any = (<any>moment_).default || moment_;

import { CalendarDate, DatePickerCore } from '../datepickercore';

export const CALENDAR_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatePickerIonic),
  multi: true
};

@Component({
  moduleId: 'module.id',
  selector: 'datepicker-sample',
  template: require('./ionic.component.html'),
  styles: [ require('./ionic.css') ],
  providers: [CALENDAR_VALUE_ACCESSOR]
})
export class DatePickerIonic extends DatePickerCore {

  @Input() class: string;
  @Input() expanded: boolean;
  @Input() opened = false;

  private el: Element;

  //only month and year relevant
  private displayDate = moment();

  private days: CalendarDate[] = [];

  constructor(elRef: ElementRef) {
    super();

    this.el = elRef.nativeElement;
  }

  onInit() {
    this.class = `ui-kit-calendar-container ${this.class}`;

    /* TODO use renderer.listenGlobal() */
    let body = document.querySelector('body');
    body.addEventListener('click', e => {
      if (!this.opened || !e.target) { return; };
      if (this.el !== e.target && !this.el.contains((<any>e.target))) {
        this.close();
      }
    }, false);
  }

  onDateclick(e: MouseEvent, date: CalendarDate) {
    e.preventDefault();

    this.selectDate(date);
    this.close();
  }

  onDateChanged(value: any) {
    this.buildCalendar();
  }

  buildCalendar() {
     this.days = this.generateCalendar(this.displayDate.month(), this.displayDate.year());
  }

  nextMonth() {
    this.displayDate.add(1, 'month');
    this.buildCalendar();
  }

  prevMonth() {
    this.displayDate.subtract(1, 'month');
    this.buildCalendar();
  }

  toggle() {
    this.opened = !this.opened;
  }

  open() {
    this.opened = true;
  }

  close() {
    this.opened = false;
  }
}
