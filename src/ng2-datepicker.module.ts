import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { DatePickerIonicComponent } from './components/ionic/datepickerionic';

import { MomentFormatPipe } from './pipes/momentformat';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule
  ],
  declarations: [
    DatePickerIonicComponent,
    MomentFormatPipe
  ],
  exports: [
    DatePickerIonicComponent,
    MomentFormatPipe
  ]
})
export class DatePickerModule { }
