import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { DatePickerIonicComponent } from './components/ionic/datepickerionic';

import { SingleSelectDirective } from './selections/single.select';
import { MultiSelectDirective } from './selections/multi.select';
import { RangeSelectDirective } from './selections/range.select';

import { MomentFormatPipe } from './pipes/momentformat';
import { DayClassesPipe } from './pipes/dayClasses';

const decl_exports = [
  DatePickerIonicComponent,

  SingleSelectDirective,
  MultiSelectDirective,
  RangeSelectDirective,

  MomentFormatPipe,
  DayClassesPipe
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule
  ],
  declarations: decl_exports,
  exports: decl_exports
})
export class DatePickerModule { }
