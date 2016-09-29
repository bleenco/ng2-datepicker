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

_Usage examples are based on a project created with [Angular CLI](https://github.com/angular/angular-cli) + Angular 2.0.0+_

**Option A:** Using ng2-datepicker with `ngModel`

1. Import `DatePicker` component in `app.module.ts`
  ```ts
  import { BrowserModule } from '@angular/platform-browser';
  import { NgModule } from '@angular/core';
  import { FormsModule } from '@angular/forms';
  import { HttpModule } from '@angular/http';
  
  import { DatePicker } from 'ng2-datepicker/ng2-datepicker';

  import { AppComponent } from './app.component';
  
  @NgModule({
    declarations: [
      Appcomponent,
      DatePicker
    ],
    imports: [
      BrowserModule,
      FormsModule,
      HttpModule
    ],
    providers: [],
    bootstrap: [AppComponent]
  })
  export class AppModule {}
  ```

2. Use `<datepicker>` in `app.component.html`
  ```html
  <datepicker [(ngModel)]="date" [expanded]="true"></datepicker>
  
  Selected date is: {{ date }}
  ```

**Option B:** Using ng2-datepicker with `FormBuilder` (ReactiveFormsModule)

1. Import `DatePicker` component and `ReactiveFormsModule` in `app.module.ts`
  ```ts
  import { BrowserModule } from '@angular/platform-browser';
  import { NgModule } from '@angular/core';
  import { FormsModule, ReactiveFormsModule } from '@angular/forms';
  import { HttpModule } from '@angular/http';
  import { DatePicker } from 'ng2-datepicker/ng2-datepicker';

  import { AppComponent } from './app.component';
  
  @NgModule({
    declarations: [
      Appcomponent,
      DatePicker
    ],
    imports: [
      BrowserModule,
      FormsModule,
      HttpModule,
      ReactiveFormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
  })
  export class AppModule {}
  ```

2. Create FormControl for date field in `app.component.ts`
  
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
  
3. Use `<datepicker>` with `formControlName` in `app.component.html`
  
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

