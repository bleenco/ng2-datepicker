import { Component, Input, ElementRef, OnInit, Renderer } from '@angular/core';

import * as moment from 'moment';

import { DatePickerTemplate } from '../datepicker.template';
import { BaseSelect } from '../../selections/base.select';

import { CalendarDay } from '../../models';

import { extendConfig, formProvider } from '../../config_helpers';

@Component( DatePickerIonicComponent.extendConfig({
  selector: 'datepicker-ionic'
}, DatePickerIonicComponent))
export class DatePickerIonicComponent extends DatePickerTemplate implements OnInit {

  static extendConfig(config: Component, componentClass: Function, ...a: any[]) {
    return extendConfig(
      super.extendConfig({
        templateUrl: './ionic.component.html',
        styleUrls: ['ionic.css'],
        inputs: ['class', 'expanded', 'opened', 'displayDate']
      }, componentClass),
      config
    );
  }

  static CONTAINER_CLASS = 'ui-kit-calendar-container';

  private _class = DatePickerIonicComponent.CONTAINER_CLASS;

  /*@Input()*/
  get class() {
    return this._class;
  }
  set class(classStr: string) {
    this._class = DatePickerIonicComponent.CONTAINER_CLASS + ' ' + classStr;
  }

  /*@Input()*/ expanded: boolean;
  /*@Input()*/ opened = false;

  private el: Element;

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
    this.initMonths(moment());
  }

  onDateclick(e: MouseEvent, day: CalendarDay) {
    e.preventDefault();

    if ( day.date.isSame(this.month.date, 'M') ) {
      this.select.selectDate(day.date);
      this.close();
    }
  }


  nextMonth() {
    this.setMonth( this.month.date.add(1, 'M') );
  }

  prevMonth() {
    this.setMonth( this.month.date.subtract(1, 'M') );
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

  inputClick() {
    this.onTouchedCallback();
    this.toggle();
  }
}
