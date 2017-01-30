import { Component } from '@angular/core';
import { DatePickerOptions, DateModel } from '../../';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  date: DateModel;
  options: DatePickerOptions;

  constructor() {
    this.options = new DatePickerOptions();
  }
}
