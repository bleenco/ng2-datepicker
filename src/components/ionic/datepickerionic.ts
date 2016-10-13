import { Component, Input, ElementRef, OnInit } from '@angular/core';

import * as moment from 'moment';

import { CalendarDay, DatePickerCore } from '../../datepickercore';
import { dpProviders } from '../../helpers/providers';

@Component({
  moduleId: 'module.id',
  selector: 'datepicker-ionic',
  templateUrl: './ionic.component.html',
  styleUrls: [ './ionic.css' ],
  providers: dpProviders(DatePickerIonicComponent)
})
export class DatePickerIonicComponent extends DatePickerCore implements OnInit {

  @Input() class: string;
  @Input() expanded: boolean;
  @Input() opened = false;

  private el: Element;

  //only month and year relevant
  private displayDate = moment();

  private days: CalendarDay[] = [];

  constructor(elRef: ElementRef) {
    super();

    this.el = elRef.nativeElement;
  }

  ngOnInit() {
    this.buildCalendar();

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

  onDateclick(e: MouseEvent, day: CalendarDay) {
    e.preventDefault();

    this.selectDay(day);
    this.close();
  }

  onDateChanged(date: moment.Moment) {
    //this.buildCalendar();
  }

  buildCalendar() {
     this.days = this.generateMonthCalendar(this.displayDate.month(), this.displayDate.year());
  }

  nextMonth() {
    this.displayDate = this.displayDate.clone().add(1, 'month');
    this.buildCalendar();
  }

  prevMonth() {
    this.displayDate = this.displayDate.clone().subtract(1, 'month');
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
