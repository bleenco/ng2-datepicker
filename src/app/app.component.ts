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
    this.options = new DatePickerOptions({
      minDate: new Date()
    });
  }
}
