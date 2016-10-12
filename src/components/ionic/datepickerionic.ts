import { Component, Input, ElementRef, OnInit } from '@angular/core';

import * as moment_ from 'moment';

const moment: any = (<any>moment_).default || moment_;

import { CalendarDate, DatePickerComponent } from '../datepicker';

@Component({
  moduleId: 'module.id',
  selector: 'datepicker-ionic',
  template: require('./ionic.component.html'),
  styles: [ require('./ionic.css') ],
})
export class DatePickerIonicComponent implements OnInit {

  @Input() class: string;
  @Input() expanded: boolean;
  @Input() opened = false;

  private el: Element;

  //only month and year relevant
  private displayDate = moment();

  private days: CalendarDate[] = [];

  constructor(private dp: DatePickerComponent, elRef: ElementRef) {
    this.el = elRef.nativeElement;
    dp.onDateChanged.subscribe(
      () => { this.buildCalendar(); }
    );
  }

  ngOnInit() {
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

    this.dp.selectDate(date);
    this.close();
  }

  buildCalendar() {
     this.days = this.dp.generateCalendar(this.displayDate.month(), this.displayDate.year());
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
