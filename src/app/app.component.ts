import { Component } from '@angular/core';

import { DateModel, DatePickerOptions } from '../ng2-datepicker/ng2-datepicker.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  date: DateModel;
  options: DatePickerOptions;

  constructor() {
    this.options = {
      autoApply: true,
      firstWeekdaySunday: true,
      initialDate: new Date(),
      locale: "en",
      maxDate: new Date(),
      minDate: null,
      style: "normal",
      format: "DD/MM/YYYY"
    };

   // this.options = new DatePickerOptions();
  }
}
