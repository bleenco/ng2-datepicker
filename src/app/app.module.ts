import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { DatePickerModule } from '../../ng2-datepicker';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    DatePickerModule
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
