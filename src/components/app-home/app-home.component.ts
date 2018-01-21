import { Component } from '@angular/core';
import {DatepickerOptions} from '../../ng-datepicker/component/ng-datepicker.component';
import * as enLocale from 'date-fns/locale/en';
import * as frLocale from 'date-fns/locale/fr';

@Component({
  selector: 'app-home',
  templateUrl: 'app-home.component.html'
})
export class AppHomeComponent {
  date: Date;
  options: DatepickerOptions = {
    locale: enLocale
  };
  constructor() {
    this.date = new Date();
  }
}
