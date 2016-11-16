import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DatePickerIonicComponent } from './components/ionic/datepickerionic';

import { SingleSelectDirective } from './selections/single.select';
import { MultiSelectDirective } from './selections/multi.select';
import { RangeSelectDirective } from './selections/range.select';

import { MomentPipe } from './pipes/moment';
import { EqualMomentPipe } from './pipes/eqmoment';
import { DayClassesPipe } from './pipes/dayClasses';


const decl_exports = [
  DatePickerIonicComponent,

  SingleSelectDirective,
  MultiSelectDirective,
  RangeSelectDirective,

  MomentPipe,
  EqualMomentPipe,
  DayClassesPipe
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: decl_exports,
  exports: decl_exports,
  providers: [{
    provide: MomentPipe,
    useClass: MomentPipe
  }]
})
export class DatePickerModule { }
