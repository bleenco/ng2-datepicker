import {
  Component, 
  ViewContainerRef, 
  Input, 
  Output, 
  EventEmitter, 
  AfterViewInit,
  provide,
  forwardRef
} from '@angular/core';
import {NgModel, ControlValueAccessor} from '@angular/common';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import * as moment from 'moment';

export interface CalendarDate {
  day: number;
  month: number;
  year: number;
  enabled: boolean;
}

@Component({
  selector: 'datepicker[ngModel]',
  template: `
  <input type="text"
         class="ng-datepicker-input"
         (focus)="openDatepicker()"
         [value]="viewValue"
         [hidden]="isStatic"
         readonly>

  <div class="ng-datepicker" *ngIf="isStatic || isOpened" [ngClass]="{ static: isStatic }">
    <div class="controls">
      <div class="left">
        <i class="ion-arrow-left-b prev-year-btn" (click)="prevYear()"></i>
        <i class="ion-arrow-left-a prev-month-btn" (click)="prevMonth()"></i>
      </div>
      <span class="date">
        {{ dateValue }}
      </span>
      <div class="right">
        <i class="ion-arrow-right-a next-month-btn" (click)="nextMonth()"></i>
        <i class="ion-arrow-right-b next-year-btn" (click)="nextYear()"></i>
      </div>
    </div>
    <div class="day-names">
      <span *ngFor="let dn of dayNames">
        <span>{{ dn }}</span>
      </span>
    </div>
    <div class="calendar">
      <span *ngFor="let d of days; let i = index">
        <span class="day" [ngClass]="{'disabled': !d.enabled, 'selected': isSelected(d)}" (click)="selectDate($event, d)">
          {{ d.day }}
        </span>
      </span>
    </div>
  </div>
  `,
  styles: [`
  .ng-datepicker-input {
    position: relative;
    width: 100%;
    cursor: pointer;
  }

  .ng-datepicker {
    position: absolute;
    z-index: 99;
    width: 250px;
    background: #fff;
    font-size: 12px;
    color: #565a5c;
    display: inline-block;
    border: 1px solid #c4c4c4;
    border-radius: 2px;
    margin: 0;
    padding: 0;
  }

  .ng-datepicker > .controls {
    width: 250px;
    display: inline-block;
    padding: 5px 0 0 0;
  }

  .ng-datepicker > .controls i {
    font-size: 25px;
    cursor: pointer;
  }

  .ng-datepicker > .controls > .left {
    width: 40px;
    display: inline-block;
    float: left;
    margin: 5px 0 0 3px;
  }

  .ng-datepicker > .controls > .left > i.prev-year-btn {
    float: left;
    display: block;
    font-size: 14px;
    opacity: 0.4;
    margin: -2px 0 0 2px;
  }

  .ng-datepicker > .controls > .left > i.prev-month-btn {
    float: left;
    margin: -10px 0 0 9px;
    display: block;
  }

  .ng-datepicker > .controls > span.date {
    width: 160px;
    text-align: center;
    font-size: 14px;
    color: #565a5c;
    font-weight: bold;
    float: left;
    padding: 3px 0 0 0;
  }

  .ng-datepicker > .controls > .right {
    width: 40px;
    display: inline-block;
    float: right;
    margin: 5px 0 0 0;
  }

  .ng-datepicker > .controls > .right > i.next-year-btn {
    float: left;
    display: block;
    font-size: 14px;
    opacity: 0.4;
    margin: -2px 2px 0 0;
  }

  .ng-datepicker > .controls > .right > i.next-month-btn {
    float: left;
    margin: -10px 9px 0 0;
  }

  .ng-datepicker > .day-names {
    width: 250px;
    border-bottom: 1px solid #c4c4c4;
    display: inline-block;
  }

  .ng-datepicker > .day-names > span {
    width: calc(250px / 7);
    text-align: center;
    color: #82888a;
    float: left;
    display: block;
  }

  .ng-datepicker > .calendar {
    width: 250px;
    display: inline-block;
    margin: -5px 0 -6px -1px;
    padding: 0;
  }

  .ng-datepicker > .calendar > span > span.day {
    width: calc(250px / 7);
    height: 35px;
    border-left: 1px solid #c4c4c4;
    border-bottom: 1px solid #c4c4c4;
    float: left;
    display: block;
    color: #565a5c;
    text-align: center;
    font-weight: bold;
    line-height: 35px;
    margin: 0;
    padding: 0;
    font-size: 14px;
    cursor: pointer;
  }

  .ng-datepicker > .calendar > span:last-child > span.day {
    border-right: 1px solid #c4c4c4;
  }

  .ng-datepicker > .calendar > span:nth-child(7n) > span.day {
    border-right: none;
  }

  .ng-datepicker > .calendar > span > span.day.disabled {
    border-left: 1px solid transparent;
    cursor: default;
    pointer-events: none;
  }

  .ng-datepicker > .calendar > span > span.day:hover {
    background: rgba(0, 0, 0, 0.4);
    color: #fff;
  }

  .ng-datepicker > .calendar > span > span.day.selected {
    background: rgba(0, 0, 0, 0.8);
    cursor: default;
    pointer-events: none;
    color: #fff;
  }

  .ng-datepicker.static {
    position: relative;
    width: 100%;
    box-sizing: border-box;
  }

  .ng-datepicker.static > .controls {
    width: 100%;
    text-align: center;
    background-color: #eee;
    padding: 5px 0;
  }

  .ng-datepicker.static > .controls > .left > i.prev-month-btn {
    margin-top: -6px;
  }

  .ng-datepicker.static > .controls > span.date {
    width: auto;
    float: none;
    display: inline-block;
    padding-top: 4px;
  }

  .ng-datepicker.static > .day-names {
    width: 100%;
    background-color: #f9f9f9;
  }

  .ng-datepicker.static > .day-names > span {
    width: calc(100%/7);
  }

  .ng-datepicker.static > .calendar {
    width: 100%;
  }

  .ng-datepicker.static > .calendar > span > span.day {
    width: calc(100%/7 - 1px);
    height: 50px;
    line-height: 50px;
  }
  `],
  directives: [NgModel],
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePicker),
      multi: true
    }
  ]
})
export class DatePicker implements ControlValueAccessor, AfterViewInit {
  public isOpened: boolean;
  public dateValue: string;
  public viewValue: string;
  public days: Array<CalendarDate>;
  public dayNames: Array<string>;
  private el: any;
  private date: any;
  private viewContainer: ViewContainerRef;
  private onChange: Function;
  private onTouched: Function;
  private cd: any;
  private cannonical: number;
  
  @Input('model-format') modelFormat: string;
  @Input('view-format') viewFormat: string;
  @Input('init-date') initDate: string;
  @Input('first-week-day-sunday') firstWeekDaySunday: boolean;
  @Input('static') isStatic: boolean;

  @Output() changed: EventEmitter<Date> = new EventEmitter<Date>();

  constructor(cd: NgModel, viewContainer: ViewContainerRef) {
    cd.valueAccessor = this;
    this.cd = cd;
    this.viewContainer = viewContainer;
    this.el = viewContainer.element.nativeElement;
    this.init();
  }

  ngAfterViewInit() {
    this.initValue();
  }

  public openDatepicker(): void {
    this.isOpened = true;
  }

  public closeDatepicker(): void {
    this.isOpened = false;
  }

  public prevYear(): void {
    this.date.subtract(1, 'Y');
    this.generateCalendar(this.date);
  }

  public prevMonth(): void {
    this.date.subtract(1, 'M');
    this.generateCalendar(this.date);
  }

  public nextYear(): void {
    this.date.add(1, 'Y');
    this.generateCalendar(this.date);
  }

  public nextMonth(): void {
    this.date.add(1, 'M');
    this.generateCalendar(this.date);
  }

  public selectDate(e: MouseEvent, date: CalendarDate): void {
    e.preventDefault();
    if (this.isSelected(date)) return;

    let selectedDate = moment(date.day + '.' + date.month + '.' + date.year, 'DD.MM.YYYY');
    this.setValue(selectedDate);
    this.closeDatepicker();
    this.changed.emit(selectedDate.toDate());
  }

  private generateCalendar(date: moment.Moment): void {
    let lastDayOfMonth = date.endOf('month').date();
    let month = date.month();
    let year = date.year();
    let n = 1;
    let firstWeekDay: number = null;

    this.dateValue = date.format('MMMM YYYY');
    this.days = [];

    if (this.firstWeekDaySunday === true) {
      firstWeekDay = date.date(2).day();
    } else {
      firstWeekDay = date.date(1).day();
    }

    if (firstWeekDay !== 1) {
      n -= (firstWeekDay + 6) % 7;
    }

    for (let i = n; i <= lastDayOfMonth; i += 1) {
      if (i > 0) {
        this.days.push({ day: i, month: month + 1, year: year, enabled: true });
      } else {
        this.days.push({ day: null, month: null, year: null, enabled: false });
      }
    }
  }

  isSelected(date: CalendarDate) {
    let selectedDate = moment(date.day + '.' + date.month + '.' + date.year, 'DD.MM.YYYY');
    return selectedDate.toDate().getTime() === this.cannonical;
  }

  private generateDayNames(): void {
    this.dayNames = [];
    let date = this.firstWeekDaySunday === true ? moment('2015-06-07') : moment('2015-06-01');
    for (let i = 0; i < 7; i += 1) {
      this.dayNames.push(date.format('ddd'));
      date.add('1', 'd');
    }
  }

  private initMouseEvents(): void {
    let body = document.getElementsByTagName('body')[0];

    body.addEventListener('click', (e) => {
      if (!this.isOpened || !e.target) return;
      if (this.el !== e.target && !this.el.contains(e.target)) {
        this.closeDatepicker();
      }
    }, false);
  }

  private setValue(value: any): void {
    let val = moment(value, this.modelFormat || 'YYYY-MM-DD');
    this.viewValue = val.format(this.viewFormat || 'Do MMMM YYYY');
    this.cd.viewToModelUpdate(val.format(this.modelFormat || 'YYYY-MM-DD'));
    this.cannonical = val.toDate().getTime();
  }

  private initValue(): void {
    setTimeout(() => {
      if (!this.initDate) {
        this.setValue(moment().format(this.modelFormat || 'YYYY-MM-DD'));
      } else {
        this.setValue(moment(this.initDate, this.modelFormat || 'YYYY-MM-DD'));
      }
    });
  }

  writeValue(value: string): void {
    if (!value) return;
    this.setValue(value);
  }

  registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: any) => {}): void {
    this.onTouched = fn;
  }

  private init(): void {
    this.isOpened = false;
    this.date = moment();
    this.firstWeekDaySunday = false;
    this.generateDayNames();
    this.generateCalendar(this.date);
    this.initMouseEvents();
  }
}
