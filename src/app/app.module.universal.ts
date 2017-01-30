import { UniversalModule } from 'angular2-universal';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { DatePickerModule } from '../../';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    UniversalModule,
    FormsModule,
    DatePickerModule
  ],
  entryComponents: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
