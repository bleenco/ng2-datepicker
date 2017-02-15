import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SlimScrollModule } from 'ng2-slimscroll';
import { DatePickerComponent } from './src/ng2-datepicker/ng2-datepicker.component';

export { DatePickerOptions, DateModel } from './src/ng2-datepicker/ng2-datepicker.component';

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
  ]
})
export class DatePickerModule { }
