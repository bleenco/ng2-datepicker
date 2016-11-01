import { Component, ViewContainerRef, forwardRef, OnInit, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import * as moment_ from 'moment';

const moment: any = (<any>moment_).default || moment_;

interface CalendarDate {
  day: number;
  month: number;
  year: number;
  enabled: boolean;
  today: boolean;
  selected: boolean;
}

export const CALENDAR_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatePickerComponent),
  multi: true
};

@Component({
  selector: 'datepicker',
  templateUrl: './ng2-datepicker.component.html',
  styleUrls: ['./ng2-datepicker.css'],
  providers: [CALENDAR_VALUE_ACCESSOR]
})
export class DatePickerComponent implements ControlValueAccessor, OnInit {
  @Input() class: string;
  @Input() expanded: boolean;
  @Input() opened: boolean;
  @Input() format: string;
  @Input() viewFormat: string;
  @Input() firstWeekdaySunday: boolean;

  private date: any = moment();
  private onChange: Function;
  private onTouched: Function;
  private el: Element;
  private viewDate: string = null;
  private days: CalendarDate[] = [];

  private onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => void = () => { };

  constructor(viewContainerRef: ViewContainerRef) {
    this.el = viewContainerRef.element.nativeElement;
  }

  get value(): any {
    return this.viewDate;
  }

  set value(value: any) {
    let date = (value instanceof moment) ? value : moment(value, this.format);
    this.viewDate = date.format(this.viewFormat);
    this.onChangeCallback(value);
  }

  ngOnInit() {
    this.class = `ui-kit-calendar-container ${this.class}`;
    this.opened = this.opened || false;
    this.format = this.format || 'YYYY-MM-DD';
    this.viewFormat = this.viewFormat || 'D MMMM YYYY';
    this.firstWeekdaySunday = this.firstWeekdaySunday || false;
    setTimeout(() => {
      if (!this.viewDate) {
        let value = moment();
        this.value = value;
        this.onChangeCallback(value.format(this.format));
      }
      this.generateCalendar();
    });

    let body = document.querySelector('body');
    body.addEventListener('click', e => {
      if (!this.opened || !e.target) { return; };
      if (this.el !== e.target && !this.el.contains((<any>e.target))) {
        this.close();
      }
    }, false);
  }

  generateCalendar() {
    let date = moment(this.date);
    let month = date.month();
    let year = date.year();
    let n: number = 1;
    let firstWeekDay: number = (this.firstWeekdaySunday) ? date.date(2).day() : date.date(1).day();

    if (firstWeekDay !== 1) {
      n -= (firstWeekDay + 6) % 7;
    }

    this.days = [];
    let selectedDate = moment(this.value, this.viewFormat);
    for (let i = n; i <= date.endOf('month').date(); i += 1) {
      let currentDate = moment(`${i}.${month + 1}.${year}`, 'DD.MM.YYYY');
      let today = (moment().isSame(currentDate, 'day') && moment().isSame(currentDate, 'month')) ? true : false;
      let selected = (selectedDate.isSame(currentDate, 'day')) ? true : false;

      if (i > 0) {
        this.days.push({
          day: i,
          month: month + 1,
          year: year,
          enabled: true,
          today: today,
          selected: selected
        });
      } else {
        this.days.push({
          day: null,
          month: null,
          year: null,
          enabled: false,
          today: false,
          selected: false
        });
      }
    }
  }

  selectDate(e: MouseEvent, i: number) {
    e.preventDefault();
    if (!!this.days[i].day) {
      let date: CalendarDate = this.days[i];
      let selectedDate = moment(`${date.day}.${date.month}.${date.year}`, 'DD.MM.YYYY');
      this.value = selectedDate.format(this.format);
      this.viewDate = selectedDate.format(this.viewFormat);
      this.close();
      this.generateCalendar();
    }
  }

  prevMonth() {
    this.date = this.date.subtract(1, 'month');
    this.generateCalendar();
  }

  nextMonth() {
    this.date = this.date.add(1, 'month');
    this.generateCalendar();
  }

  writeValue(value: any) {
    this.viewDate = value;
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
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
