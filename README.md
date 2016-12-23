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
  <ng2-datepicker [(ngModel)]="date"></ng2-datepicker>

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
    <ng2-datepicker formControlName="date"></ng2-datepicker>
  </form>
  ```

## API

Options can be passed to `<ng2-datepicker>` component via property bindings.

For input `[options]` please see [this](https://github.com/jkuri/ng2-datepicker/blob/master/src/components/ng2-datepicker.component.ts#L33-L40).

## Events

You can subscribe to `(outputEvents)` or pass event to the datepicker component via `[inputEvents]`.

## Example from demo:

```html
<ng2-datepicker [(ngModel)]="data.date"></ng2-datepicker>
<ng2-datepicker [(ngModel)]="data2.date"></ng2-datepicker>
<ng2-datepicker [(ngModel)]="data3.date"></ng2-datepicker>
<ng2-datepicker [(ngModel)]="data4.date"></ng2-datepicker>
```

## Licence

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.

