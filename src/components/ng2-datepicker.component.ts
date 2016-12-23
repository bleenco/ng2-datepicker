import { Component, ElementRef, Inject, OnInit, forwardRef, Input, Output, EventEmitter, Provider } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { SlimScrollOptions } from 'ng2-slimscroll/ng2-slimscroll';
import * as moment from 'moment';

const Moment: any = (<any>moment).default || moment;

export interface IDateModel {
  day: string;
  month: string;
  year: string;
  formatted: string;
  momentObj: moment.Moment;
}

export class DateModel {
  day: string;
  month: string;
  year: string;
  formatted: string;
  momentObj: moment.Moment;

  constructor(obj?: IDateModel) {
    this.day = obj && obj.day ? obj.day : null;
    this.month = obj && obj.month ? obj.month : null;
    this.year = obj && obj.year ? obj.year : null;
    this.formatted = obj && obj.formatted ? obj.formatted : null;
    this.momentObj = obj && obj.momentObj ? obj.momentObj : null;
  }
}

export interface IDatePickerOptions {
  autoApply?: boolean;
  style?: 'normal' | 'big' | 'bold';
  locale?: string;
  minDate?: Date;
  maxDate?: Date;
  initialDate?: Date;
  firstWeekdaySunday?: boolean;
  format?: string;
}

export class DatePickerOptions {
  autoApply?: boolean;
  style?: 'normal' | 'big' | 'bold';
  locale?: string;
  minDate?: Date;
  maxDate?: Date;
  initialDate?: Date;
  firstWeekdaySunday?: boolean;
  format?: string;

  constructor(obj?: IDatePickerOptions) {
    this.autoApply = (obj && obj.autoApply === true) ? true : false;
    this.style = obj && obj.style ? obj.style : 'normal';
    this.locale = obj && obj.locale ? obj.locale : 'en';
    this.minDate = obj && obj.minDate ? obj.minDate : null;
    this.maxDate = obj && obj.maxDate ? obj.maxDate : null;
    this.initialDate = obj && obj.initialDate ? obj.initialDate : null;
    this.firstWeekdaySunday = obj && obj.firstWeekdaySunday ? obj.firstWeekdaySunday : false;
    this.format = obj && obj.format ? obj.format : 'YYYY-MM-DD';
  }
}

export interface CalendarDate {
  day: number;
  month: number;
  year: number;
  enabled: boolean;
  today: boolean;
  selected: boolean;
  momentObj: moment.Moment;
}

export const CALENDAR_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatePickerComponent),
  multi: true
};


@Component({
  selector: 'ng2-datepicker',
  template: `
  <div class="datepicker-container u-is-unselectable">
    <div class="datepicker-input-container">
      <input type="text" class="datepicker-input" [(ngModel)]="date.formatted">
      <div class="datepicker-input-icon" (click)="toggle()">
        <i class="ion-ios-calendar-outline"></i>
      </div>
    </div>
    <div class="datepicker-calendar" *ngIf="opened">
      <div class="datepicker-calendar-top">
        <span class="year-title">{{ currentDate.format('YYYY') }}</span>
        <button type="button" (click)="openYearPicker()" *ngIf="!yearPicker">
          <i class="ion-arrow-right-c"></i>
          Select Year
        </button>
        <i class="close ion-android-close" (click)="close()"></i>
      </div>
      <div class="datepicker-calendar-container">
        <div *ngIf="!yearPicker">
          <div class="datepicker-calendar-month-section">
            <i class="ion-ios-arrow-back" (click)="prevMonth()"></i>
            <span class="month-title">{{ currentDate.format('MMMM') }}</span>
            <i class="ion-ios-arrow-forward" (click)="nextMonth()"></i>
          </div>
          <div class="datepicker-calendar-day-names">
            <span>S</span>
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
          </div>
          <div class="datepicker-calendar-days-container">
            <span class="day" *ngFor="let d of days; let i = index"
                              (click)="selectDate($event, d.momentObj)"
                              [ngClass]="{ 'disabled': !d.enabled, 'today': d.today, 'selected': d.selected }">
              {{ d.day }}
            </span>
          </div>
          <div class="datepicker-buttons" *ngIf="!options.autoApply">
            <button type="button" class="a-button u-is-secondary u-is-small" (click)="today()">Today</button>
            <button type="button" class="a-button u-is-primary u-is-small" (click)="close()">Apply</button>
          </div>
        </div>
        <div *ngIf="yearPicker">
          <div class="datepicker-calendar-years-container" slimScroll [options]="scrollOptions">
            <span class="year" *ngFor="let y of years; let i = index" (click)="selectYear($event, y)">
              {{ y }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
  .datepicker-container {
  display: inline-block;
  position: relative; }
  .datepicker-container .datepicker-input-container {
    display: inline-block; }
    .datepicker-container .datepicker-input-container .datepicker-input {
      display: inline-block;
      width: 160px;
      margin-right: 15px;
      border: none;
      outline: none;
      border-bottom: 1px solid #ced4da;
      font-size: 14px;
      color: #000000;
      text-align: center; }
      .datepicker-container .datepicker-input-container .datepicker-input::-webkit-input-placeholder {
        color: #343a40; }
      .datepicker-container .datepicker-input-container .datepicker-input::-moz-placeholder {
        color: #343a40; }
      .datepicker-container .datepicker-input-container .datepicker-input:-ms-input-placeholder {
        color: #343a40; }
      .datepicker-container .datepicker-input-container .datepicker-input:-moz-placeholder {
        color: #343a40; }
    .datepicker-container .datepicker-input-container .datepicker-input-icon {
      display: inline-block; }
      .datepicker-container .datepicker-input-container .datepicker-input-icon i {
        font-size: 20px;
        cursor: pointer; }
  .datepicker-container .datepicker-calendar {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    width: 250px;
    top: 40px;
    position: absolute;
    z-index: 99;
    background: #FFFFFF;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5); }
    .datepicker-container .datepicker-calendar .datepicker-calendar-top {
      width: 100%;
      height: 80px;
      background: #099268;
      display: inline-block;
      position: relative; }
      .datepicker-container .datepicker-calendar .datepicker-calendar-top .year-title {
        display: block;
        margin-top: 12px;
        color: #FFFFFF;
        font-size: 28px;
        text-align: center; }
      .datepicker-container .datepicker-calendar .datepicker-calendar-top button {
        width: 150px;
        display: block;
        margin: 0 auto;
        color: #FFFFFF;
        text-transform: uppercase;
        background: transparent;
        border: none;
        outline: none;
        font-size: 12px;
        cursor: pointer; }
      .datepicker-container .datepicker-calendar .datepicker-calendar-top .close {
        position: absolute;
        top: 5px;
        right: 10px;
        font-size: 20px;
        color: #FFFFFF;
        cursor: pointer; }
    .datepicker-container .datepicker-calendar .datepicker-calendar-container {
      display: inline-block;
      width: 100%;
      padding: 10px; }
      .datepicker-container .datepicker-calendar .datepicker-calendar-container .datepicker-calendar-month-section {
        width: 100%;
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        color: #000000;
        text-transform: uppercase; }
        .datepicker-container .datepicker-calendar .datepicker-calendar-container .datepicker-calendar-month-section i {
          cursor: pointer; }
          .datepicker-container .datepicker-calendar .datepicker-calendar-container .datepicker-calendar-month-section i:first-child {
            margin-left: 12px; }
          .datepicker-container .datepicker-calendar .datepicker-calendar-container .datepicker-calendar-month-section i:last-child {
            margin-right: 12px; }
      .datepicker-container .datepicker-calendar .datepicker-calendar-container .datepicker-calendar-day-names {
        width: 230px;
        margin-top: 10px;
        display: inline-block;
        border: 1px solid transparent; }
        .datepicker-container .datepicker-calendar .datepicker-calendar-container .datepicker-calendar-day-names span {
          font-size: 12px;
          display: block;
          float: left;
          width: calc(100% / 7);
          text-align: center; }
      .datepicker-container .datepicker-calendar .datepicker-calendar-container .datepicker-calendar-days-container {
        width: 230px;
        margin-top: 5px;
        display: inline-block;
        border: 1px solid transparent; }
        .datepicker-container .datepicker-calendar .datepicker-calendar-container .datepicker-calendar-days-container .day {
          display: flex;
          justify-content: center;
          align-items: center;
          float: left;
          font-size: 14px;
          color: #000000;
          width: calc(100% / 7);
          height: 33px;
          text-align: center;
          border-radius: 50%;
          cursor: pointer; }
          .datepicker-container .datepicker-calendar .datepicker-calendar-container .datepicker-calendar-days-container .day:hover:not(.disabled), .datepicker-container .datepicker-calendar .datepicker-calendar-container .datepicker-calendar-days-container .day.selected {
            background: #099268;
            color: #FFFFFF !important; }
          .datepicker-container .datepicker-calendar .datepicker-calendar-container .datepicker-calendar-days-container .day.disabled {
            pointer-events: none; }
          .datepicker-container .datepicker-calendar .datepicker-calendar-container .datepicker-calendar-days-container .day.today {
            color: #fa5252; }
      .datepicker-container .datepicker-calendar .datepicker-calendar-container .datepicker-calendar-years-container {
        width: 100%;
        height: 240px; }
        .datepicker-container .datepicker-calendar .datepicker-calendar-container .datepicker-calendar-years-container .year {
          display: flex;
          justify-content: center;
          align-items: center;
          float: left;
          font-size: 14px;
          color: #000000;
          width: calc(100% / 4);
          height: 50px;
          text-align: center;
          border-radius: 50%;
          cursor: pointer; }
          .datepicker-container .datepicker-calendar .datepicker-calendar-container
          .datepicker-calendar-years-container .year:hover, .datepicker-container .datepicker-calendar .datepicker-calendar-container
          .datepicker-calendar-years-container .year.selected {
            background: #099268;
            color: #FFFFFF !important; }
      .datepicker-container .datepicker-calendar .datepicker-calendar-container .datepicker-buttons {
        width: 235px;
        display: flex;
        justify-content: center; }
        .datepicker-container .datepicker-calendar .datepicker-calendar-container .datepicker-buttons button {
          width: 100%;
          outline: none;
          display: inline-block;
          border: 1px solid #099268;
          background: #099268;
          color: #FFFFFF;
          margin-right: 5px;
          border-radius: 5px;
          cursor: pointer;
          text-align: center;
          padding: 5px 10px; }
          .datepicker-container .datepicker-calendar .datepicker-calendar-container .datepicker-buttons button.u-is-secondary {
            background: #FFFFFF;
            color: #099268; }
            .datepicker-container .datepicker-calendar .datepicker-calendar-container .datepicker-buttons button.u-is-secondary:hover {
              color: #099268; }

  `],
  providers: [CALENDAR_VALUE_ACCESSOR]
})
export class DatePickerComponent implements ControlValueAccessor, OnInit {
  @Input() options: DatePickerOptions;
  @Input() inputEvents: EventEmitter<{ type: string, data: string | DateModel }>;
  @Output() outputEvents: EventEmitter<{ type: string, data: string | DateModel }>;

  date: DateModel;

  opened: boolean;
  currentDate: moment.Moment;
  days: CalendarDate[];
  years: number[];
  yearPicker: boolean;
  scrollOptions: SlimScrollOptions;

  minDate: moment.Moment | any;
  maxDate: moment.Moment | any;

  private onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => void = () => { };

  constructor( @Inject(ElementRef) public el: ElementRef) {
    this.opened = false;
    this.currentDate = Moment();
    this.options = this.options || {};
    this.days = [];
    this.years = [];
    this.date = new DateModel({
      day: null,
      month: null,
      year: null,
      formatted: null,
      momentObj: null
    });

    this.generateYears();

    this.outputEvents = new EventEmitter<{ type: string, data: string | DateModel }>();

    if (!this.inputEvents) {
      return;
    }

    this.inputEvents.subscribe((event: { type: string, data: string | DateModel }) => {
      if (event.type === 'setDate') {
        this.value = event.data as DateModel;
      } else if (event.type === 'default') {
        if (event.data === 'open') {
          this.open();
        } else if (event.data === 'close') {
          this.close();
        }
      }
    });
  }

  get value(): DateModel {
    return this.date;
  }

  set value(date: DateModel) {
    if (!date) { return; }
    this.date = date;
    this.onChangeCallback(date);
  }

  ngOnInit() {
    this.options = new DatePickerOptions(this.options);
    this.scrollOptions = {
      barBackground: '#C9C9C9',
      barWidth: '7',
      gridBackground: '#C9C9C9',
      gridWidth: '2'
    };

    if (this.options.initialDate instanceof Date) {
      this.currentDate = Moment(this.options.initialDate);
      this.selectDate(null, this.currentDate);
    }

    if (this.options.minDate instanceof Date) {
      this.minDate = Moment(this.options.minDate);
    } else {
      this.minDate = null;
    }

    if (this.options.maxDate instanceof Date) {
      this.maxDate = Moment(this.options.maxDate);
    } else {
      this.maxDate = null;
    }

    this.generateCalendar();
    this.outputEvents.emit({ type: 'default', data: 'init' });

    if (typeof window !== 'undefined') {
      let body = document.querySelector('body');
      body.addEventListener('click', e => {
        if (!this.opened || !e.target) { return; };
        if (this.el.nativeElement !== e.target && !this.el.nativeElement.contains((<any>e.target))) {
          this.close();
        }
      }, false);
    }

    if (this.inputEvents) {
      this.inputEvents.subscribe((e: any) => {
        if (e.type === 'action') {
          if (e.data === 'toggle') {
            this.toggle();
          }
          if (e.data === 'close') {
            this.close();
          }
          if (e.data === 'open') {
            this.open();
          }
        }

        if (e.type === 'setDate') {
          if (!(e.data instanceof Date)) {
            throw new Error(`Input data must be an instance of Date!`);
          }
          let date: moment.Moment = Moment(e.data);
          if (!date) {
            throw new Error(`Invalid date: ${e.data}`);
          }
          this.value = {
            day: date.format('DD'),
            month: date.format('MM'),
            year: date.format('YYYY'),
            formatted: date.format(this.options.format),
            momentObj: date
          };
        }
      });
    }
  }

  generateCalendar() {
    let date: moment.Moment = Moment(this.currentDate);
    let month = date.month();
    let year = date.year();
    let n = 1;
    let firstWeekDay = (this.options.firstWeekdaySunday) ? date.date(2).day() : date.date(1).day();

    if (firstWeekDay !== 1) {
      n -= (firstWeekDay + 6) % 7;
    }

    this.days = [];
    let selectedDate: moment.Moment = this.date.momentObj;
    for (let i = n; i <= date.endOf('month').date(); i += 1) {
      let currentDate: moment.Moment = Moment(`${i}.${month + 1}.${year}`, 'DD.MM.YYYY');
      let today: boolean = (Moment().isSame(currentDate, 'day') && Moment().isSame(currentDate, 'month')) ? true : false;
      let selected: boolean = (selectedDate && selectedDate.isSame(currentDate, 'day')) ? true : false;
      let betweenMinMax = true;

      if (this.minDate !== null) {
        if (this.maxDate !== null) {
          betweenMinMax = currentDate.isBetween(this.minDate, this.maxDate, 'day', '[]') ? true : false;
        } else {
          betweenMinMax = currentDate.isBefore(this.minDate, 'day') ? false : true;
        }
      } else {
        if (this.maxDate !== null) {
          betweenMinMax = currentDate.isAfter(this.maxDate, 'day') ? false : true;
        }
      }

      let day: CalendarDate = {
        day: i > 0 ? i : null,
        month: i > 0 ? month : null,
        year: i > 0 ? year : null,
        enabled: i > 0 ? betweenMinMax : false,
        today: i > 0 && today ? true : false,
        selected: i > 0 && selected ? true : false,
        momentObj: currentDate
      };

      this.days.push(day);
    }
  }

  selectDate(e: MouseEvent, date: moment.Moment) {
    if (e) { e.preventDefault(); }

    setTimeout(() => {
      this.value = {
        day: date.format('DD'),
        month: date.format('MM'),
        year: date.format('YYYY'),
        formatted: date.format(this.options.format),
        momentObj: date
      };
      this.generateCalendar();

      this.outputEvents.emit({ type: 'dateChanged', data: this.value });
    });

    if (this.options.autoApply === true && this.opened === true) {
      this.opened = false;
    }
  }

  selectYear(e: MouseEvent, year: number) {
    e.preventDefault();

    setTimeout(() => {
      let date: moment.Moment = this.currentDate.year(year);
      this.value = {
        day: date.format('DD'),
        month: date.format('MM'),
        year: date.format('YYYY'),
        formatted: date.format(this.options.format),
        momentObj: date
      };
      this.yearPicker = false;
      this.generateCalendar();
    });
  }

  generateYears() {
    let date: moment.Moment = this.options.minDate || Moment().year(Moment().year() - 40);
    let toDate: moment.Moment = this.options.maxDate || Moment().year(Moment().year() + 40);
    let years = toDate.year() - date.year();

    for (let i = 0; i < years; i++) {
      this.years.push(date.year());
      date.add(1, 'year');
    }
  }

  writeValue(date: DateModel) {
    if (!date) { return; }
    this.date = date;
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  prevMonth() {
    this.currentDate = this.currentDate.subtract(1, 'month');
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate = this.currentDate.add(1, 'month');
    this.generateCalendar();
  }

  today() {
    this.currentDate = Moment();
    this.selectDate(null, this.currentDate);
  }

  toggle() {
    this.opened = !this.opened;
    if (this.opened) {
      this.onOpen();
    }

    this.outputEvents.emit({ type: 'default', data: 'opened' });
  }

  open() {
    this.opened = true;
    this.onOpen();
  }

  close() {
    this.opened = false;
    this.outputEvents.emit({ type: 'default', data: 'closed' });
  }

  onOpen() {
    this.yearPicker = false;
  }

  openYearPicker() {
    setTimeout(() => this.yearPicker = true);
  }

}
