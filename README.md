# ng2-datepicker
Angular2 Datepicker Component

***ng2-datepicker*** is a datepicker component for Angular2.

## Demo

[http://demo.jankuri.com/ng2-datepicker](http://demo.jankuri.com/ng2-datepicker)

## Installation: 


````shell
npm install ng2-datepicker
````

## Use Example:

```ts
import {Component} from 'angular2/core';
import {FORM_DIRECTIVES} from 'angular2/common';
import {DatePicker} from 'ng2-datepicker/ng2-datepicker';

class Test {
  date: string;
}

@Component({
  template: `
    <datepicker [(ngModel)]="test.date"></datepicker>
    <datepicker [(ngModel)]="test1.date" view-format="DD.MM.YYYY" model-format="YYY-MM-DD" init-date="2017-05-12"></datepicker>
  `,
  directives: [DatePicker, FORM_DIRECTIVES]
})

class App {
  test: Test;
  test1: Test;
  
  constructor() {
    this.test = Test();
    this.test1 = Test();
  }
}
```

## Licence

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.

