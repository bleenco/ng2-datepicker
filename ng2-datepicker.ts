import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePickerComponent } from './src/components/ng2-datepicker';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule
  ],
  declarations: [
    DatePickerComponent
  ],
  exports: [
    DatePickerComponent
  ]
})
export class DatePickerModule { }

// export { IDate } from './src/components/ng2-datepicker';
