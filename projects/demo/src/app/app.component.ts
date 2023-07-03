import { Component } from '@angular/core';
import { DatepickerComponent, DatepickerOptions } from 'ng2-datepicker';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BrowserModule, DatepickerComponent, FormsModule],
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
