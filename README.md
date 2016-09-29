# ng2-datepicker
Angular2 Datepicker Component

***ng2-datepicker*** is a datepicker component for Angular2.

## Demo

[http://ng2-datepicker.jankuri.com](http://ng2-datepicker.jankuri.com)

## Installation: 


````shell
npm install ng2-datepicker --save
````

## Usage

**Option A:** Using ng2-datepicker with Angular CLI, Angular 2.0.0+ and `ReactiveFormsModule`

1. Import `DatePicker` component in `app.module.ts`
  ```ts
  import { NgModule } from '@angular/core';
  import { FormsModule, ReactiveFormsModule } from '@angular/forms';
  import { DatePicker } from 'ng2-datepicker/ng2-datepicker';

  import { AppComponent } from './app.component';
  
  @NgModule({
    declarations: [
      Appcomponent,
      DatePicker
    ],
    imports: [
      FormsModule,
      ReactiveFormsModule
    ],
    bootstrap: [AppComponent]
  })
  export class AppModule {}
  ```

2. Use `<datepicker>` component in `AppComponent`
  
  ```ts
  import { Component, OnInit } from '@angular/core';
  import { FormGroup, FormBuilder } from '@angular/forms';
  
  @Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
  })
  export class AppComponent implements OnInit {
  
    dataForm: FormGroup;
  
    constructor(private formBuilder: FormBuilder) {
    }
  
    ngOnInit() {
      this.dataForm = this.formBuilder.group({
        date: ''
      });  
    }
  }
  ```
  
  Template:
  
  ```html
  <form [formGroup]="dataForm">
    <datepicker formControlName="date" [expanded]="true"></datepicker>
  </form>
  ```

## Example from demo:

```html
<datepicker [(ngModel)]="data.date" [expanded]="true"></datepicker>
<datepicker [(ngModel)]="data2.date" [expanded]="true" class="danger"></datepicker>
<datepicker [(ngModel)]="data3.date" [expanded]="true" class="success"></datepicker>
<datepicker [(ngModel)]="data4.date" [expanded]="true" class="warning"></datepicker>
<datepicker [(ngModel)]="data5.date"></datepicker>
```

## Licence

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.

