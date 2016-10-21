import { Component, Input, ElementRef, OnInit, Renderer } from '@angular/core';

import * as moment from 'moment';

import { DatePickerTemplate } from '../datepicker.template';
import { BaseSelect } from '../../selections/base.select';

import { CalendarDay } from '../../models';

import { extendConfig } from '../../decorators/aot-utils';

export const DEFAULT_CONFIG = {
  templateUrl: './ionic.component.html',
  styleUrls: ['ionic.css']
};

@Component( extendConfig(DEFAULT_CONFIG, DatePickerIonicComponent, {
  selector: 'datepicker-ionic'
}) )
export class DatePickerIonicComponent extends DatePickerTemplate implements OnInit {

  static CONTAINER_CLASS = 'ui-kit-calendar-container';

  private _class = DatePickerIonicComponent.CONTAINER_CLASS;

  get class() {
    return this._class;
  }

  @Input() set class(classStr: string) {
    this._class = DatePickerIonicComponent.CONTAINER_CLASS + ' ' + classStr;
  }

  @Input() expanded: boolean;
  @Input() opened = false;

  private el: Element;

  //only month and year relevant
  displayDate = moment();

  days: CalendarDay[] = [];

  constructor(renderer: Renderer, elRef: ElementRef, select: BaseSelect<moment.Moment | moment.Moment[]>) {
    super(select);

    this.el = elRef.nativeElement;

    renderer.listenGlobal('window', 'click', e => {
      if (this.opened &&
          e.target &&
          this.el !== e.target &&
          !this.el.contains((<any>e.target)))
        this.close();
    });
  }

  ngOnInit() {
    this.buildCalendar();
  }

  onDateclick(e: MouseEvent, day: CalendarDay) {
    e.preventDefault();

    if ( day.date.month() === this.displayDate.month() ) {
      this.select.selectDate(day.date);
      this.close();
    }
  }

  buildCalendar() {
     this.days = this.generateCalendarMonth(this.displayDate.month(), this.displayDate.year());
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
