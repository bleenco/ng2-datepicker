# ng2-datepicker

Angular 2+ Simple and minimal datepicker component

[![AbstruseCI](https://ci.bleenco.io/badge/6)](https://ci.bleenco.io/repo/6)

<p align="center">
  <img src="https://user-images.githubusercontent.com/1796022/30781709-624eddc2-a124-11e7-88b7-537af535c23b.png" width="300">
</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/1796022/30781711-666e5e5a-a124-11e7-9077-59e8eb7d6b03.png" width="300">
</p>

## Installation

1. Install package from `npm`.

```sh
npm install ng2-datepicker --save
```

2. Include NgDatepickerModule into your application.

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgDatepickerModule } from 'ng2-datepicker';

@NgModule({
  imports: [
    BrowserModule,
    NgDatepickerModule
  ],
  declarations: [ AppComponent ],
  exports: [ AppComponent ]
})
export class AppModule {}
```

## Example
```html
  <ng-datepicker [(ngModel)]="date" />
```

## Additional attributes
|Name|Type|Default|Description|
| --- | --- | --- | --- |
|`headless`|boolean|`false`|Disable datepicker's input|
|`isOpened`|boolean|`false`|Show or hide datepicker|
|`position`|string|`bottom-right`|Dropdown position (`bottom-left`, `bottom-right`, `top-left`, `top-right`)|

## Options
```ts
import { DatepickerOptions } from 'ng2-datepicker';
import * as frLocale from 'date-fns/locale/fr';

options: DatepickerOptions = {
  minYear: 1970,
  maxYear: 2030,
  displayFormat: 'MMM D[,] YYYY',
  barTitleFormat: 'MMMM YYYY',
  dayNamesFormat: 'dd',
  firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
  locale: frLocale,
  minDate: new Date(Date.now()), // Minimal selectable date
  maxDate: new Date(Date.now()),  // Maximal selectable date
  barTitleIfEmpty: 'Click to select a date'
};
```

For available `format` options check out [here](https://date-fns.org/docs/format).

In case you want to initialize with an empty value, just assign null to the model attribute you're storing the date and you can customize the message in the bar with the property `barTitleIfEmpty`.

## Run Included Demo

1. Clone this repository

```sh
git clone https://github.com/jkuri/ng2-datepicker.git
cd ng2-datepicker
```

2. Install packages

```sh
npm install
```

3. Run Demo

```sh
npm start
```

## Licence

MIT
