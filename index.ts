import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePickerComponent } from './src/components/ng2-datepicker.component';

export { DatePickerOptions, DateModel } from './src/components/ng2-datepicker.component';

@NgModule({
  declarations: [
    DatePickerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    DatePickerComponent,
  ]
})
export class DatePickerModule { }
