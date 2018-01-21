import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSlimScrollModule } from 'ngx-slimscroll';
import { NgDatepickerComponent } from '../component/ng-datepicker.component';

@NgModule({
  declarations: [ NgDatepickerComponent ],
  imports: [ CommonModule, FormsModule, NgSlimScrollModule ],
  exports: [ NgDatepickerComponent, CommonModule, FormsModule, NgSlimScrollModule ]
})
export class NgDatepickerModule { }
