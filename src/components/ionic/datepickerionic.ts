import {Component, ElementRef, OnInit, Renderer, ChangeDetectorRef, Optional, ChangeDetectionStrategy} from '@angular/core';

import * as moment from 'moment';

import { DatePickerTemplate } from '../datepicker.template';
import { BaseSelect } from '../../selections/base.select';

import { CalendarDay } from '../../models';

import {NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'datepicker-ionic',
  templateUrl: 'ionic.component.html',
  styleUrls: ['ionic.scss'],
  inputs: ['class', 'expanded', 'opened', 'viewFormat'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DatePickerIonicComponent,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerIonicComponent extends DatePickerTemplate<BaseSelect<any>, any> implements OnInit {
  static CONTAINER_CLASS = 'ui-kit-calendar-container';

  private _class = DatePickerIonicComponent.CONTAINER_CLASS;

  /*@Input()*/
  get class() {
    return this._class;
  }
  set class(classStr: string) {
    this._class = DatePickerIonicComponent.CONTAINER_CLASS + ' ' + classStr;
  }

  private _opened = false;
   get opened() {
    return this._opened;
  }

  /*@Input()*/
  set opened(b: boolean){
    if( this._opened !== b ) {
      this._opened = b;
      this.cd.markForCheck();
    }
  }

  /*@Input()*/ expanded: boolean;
  /*@Input()*/ viewFormat = 'LL';

  private el: Element;

  constructor(private renderer: Renderer, elRef: ElementRef, cd: ChangeDetectorRef, @Optional() select: BaseSelect<any>) {
    super(cd, select);

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

    this.select.selectDate(day.date);

    if (this.select.isComplete())
      this.close();
  }

  nextMonth() {
    this.changeMonth( this.getMonthDate().add(1, 'M') );
  }

  prevMonth() {
    this.changeMonth( this.getMonthDate().subtract(1, 'M') );
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
