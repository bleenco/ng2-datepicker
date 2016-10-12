import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { DatePickerComponent } from './src/components/datepicker';
import { DatePickerIonicComponent } from './src/components/ionic/datepickerionic';

import { MomentFormatPipe } from './src/pipes/momentformat';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule
  ],
  declarations: [
    DatePickerComponent,
    DatePickerIonicComponent,
    MomentFormatPipe
  ],
  exports: [
    DatePickerComponent,
    DatePickerIonicComponent,
    MomentFormatPipe
  ]
})
export class DatePickerModule { }

export { DatePickerComponent } from './src/components/datepicker';
