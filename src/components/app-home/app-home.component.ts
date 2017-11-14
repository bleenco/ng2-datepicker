import { Component } from '@angular/core';
import {DatepickerOptions} from '../../ng-datepicker/ng-datepicker.component';
import * as frLocale from 'date-fns/locale/fr';

@Component({
  selector: 'app-home',
  templateUrl: 'app-home.component.html'
})
export class AppHomeComponent {
  date: Date;
  options: DatepickerOptions= {
      locale: frLocale
  };
  constructor() {
    this.date = new Date();
  }
}
