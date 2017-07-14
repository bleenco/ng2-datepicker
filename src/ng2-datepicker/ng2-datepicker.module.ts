import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SlimScrollModule } from 'ng2-slimscroll';

import { DatePickerComponent } from './ng2-datepicker.component';
export { DatePickerOptions, DateModel } from './ng2-datepicker.component';

import { ILocaleManager, LocaleManager} from "./locales/locale-manager";

@NgModule({
  declarations: [
    DatePickerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SlimScrollModule
  ],
  exports: [
    DatePickerComponent,
    SlimScrollModule,
    FormsModule
  ],
  providers: [ 
    { provide: ILocaleManager, useClass: LocaleManager }   
  ],
})
export class DatePickerModule { }
