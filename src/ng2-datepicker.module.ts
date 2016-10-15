import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { DatePickerIonicComponent } from './components/ionic/datepickerionic';

import { MomentFormatPipe } from './pipes/momentformat';
import { DayClassesPipe } from './pipes/dayClasses';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule
  ],
  declarations: [
    DatePickerIonicComponent,
    MomentFormatPipe,
    DayClassesPipe
  ],
  exports: [
    DatePickerIonicComponent,
    MomentFormatPipe,
    DayClassesPipe
  ]
})
export class DatePickerModule { }
