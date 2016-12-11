# ng2-datepicker
Angular2 Datepicker Component

***ng2-datepicker*** is a datepicker component for Angular2.

## Demo

[http://ng2-datepicker.jankuri.com](http://ng2-datepicker.jankuri.com)

## Installation: 

Install ng2-datepicker via `npm`

````shell
npm install ng2-datepicker --save
````

Then include [Ionicons](http://ionicons.com/)'s CSS in `index.html`

```html
<link rel="stylesheet" href="http://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" media="all">
```

## Usage

_Usage examples are based on a project created with [Angular CLI](https://github.com/angular/angular-cli) + Angular 2.0.0+_

**Option A:** Using ng2-datepicker with `ngModel`

1. Import `DatePickerModule` in `app.module.ts`
  ```ts
  import { BrowserModule } from '@angular/platform-browser';
  import { NgModule } from '@angular/core';
  import { FormsModule } from '@angular/forms';
  import { HttpModule } from '@angular/http';
  
  import { DatePickerModule } from 'ng2-datepicker';

  import { AppComponent } from './app.component';
  
  @NgModule({
    declarations: [
      Appcomponent
    ],
    imports: [
      BrowserModule,
      FormsModule,
      HttpModule,
      DatePickerModule
    ],
    providers: [],
    bootstrap: [AppComponent]
  })
  export class AppModule {}
  ```

2. Use `<ng2-datepicker>` in `app.component.html`
  ```html
  <ng2-datepicker [(ngModel)]="date" [expanded]="true"></datepicker>
  
  Selected date is: {{ date }}
  ```

**Option B:** Using ng2-datepicker with `FormBuilder` (ReactiveFormsModule)

1. Import `DatePickerModule` and `ReactiveFormsModule` in `app.module.ts`
  ```ts
  import { BrowserModule } from '@angular/platform-browser';
  import { NgModule } from '@angular/core';
  import { FormsModule, ReactiveFormsModule } from '@angular/forms';
  import { HttpModule } from '@angular/http';
  import { DatePickerModule } from 'ng2-datepicker';

  import { AppComponent } from './app.component';
  
  @NgModule({
    declarations: [
      Appcomponent
    ],
    imports: [
      BrowserModule,
      FormsModule,
      HttpModule,
      ReactiveFormsModule,
      DatePickerModule
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
  
3. Use `<ng2-datepicker>` with `formControlName` in `app.component.html`
  
  ```html
  <form [formGroup]="dataForm">
    <ng2-datepicker formControlName="date" [expanded]="true"></ng2-datepicker>
  </form>
  ```

## API

Options can be passed to `<datepicker>` component via property bindings.

|Property|Type|Required|Default|Description|
|:--- |:--- |:--- |:--- |:--- |
|`class`|string|No|`''`|CSS class name(s) to apply to datepicker's container|
|`expanded`|boolean|No|`false`|If set to `true`, calendar always displays the selected date|
|`opened`|boolean|No|`false`|Set to `true` to open the calendar by default|
|`format`|string|No|`YYYY-MM-DD`|Date format of the calendar. This will be bound to the model as the date's value.|
|`viewFormat`|string|No|`D MMMM YYYY`|Date format to display in the view.|
|`firstWeekdaySunday`|boolean|No|`false`|Set to `true` to set first day of the week in calendar to Sunday instead of Monday.|


## Example from demo:

```html
<ng2-datepicker [(ngModel)]="data.date" [expanded]="true"></ng2-datepicker>
<ng2-datepicker [(ngModel)]="data2.date" [expanded]="true" class="danger"></ng2-datepicker>
<ng2-datepicker [(ngModel)]="data3.date" [expanded]="true" class="success"></ng2-datepicker>
<ng2-datepicker [(ngModel)]="data4.date" [expanded]="true" class="warning"></ng2-datepicker>
<ng2-datepicker [(ngModel)]="data5.date"></ng2-datepicker>
```

## Licence

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.

