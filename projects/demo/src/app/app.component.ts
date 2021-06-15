import { Component } from '@angular/core';
import { DatepickerOptions } from 'ng2-datepicker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  date: Date = new Date();
  options: DatepickerOptions = {
    inputClass: 'input',
    calendarClass: 'datepicker-default',
    scrollBarColor: '#010001'
  };
  date2: Date = new Date();
  options2: DatepickerOptions = {
    inputClass: 'input',
    calendarClass: 'datepicker-blue',
    scrollBarColor: '#ffffff'
  };
  date3: Date = new Date();
  options3: DatepickerOptions = {
    inputClass: 'input',
    calendarClass: 'datepicker-dark',
    scrollBarColor: '#ffffff'
  };
}
