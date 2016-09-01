# ng2-datepicker
Angular2 Datepicker Component

***ng2-datepicker*** is a datepicker component for Angular2.

## Demo

[http://ng2-datepicker.jankuri.com](http://ng2-datepicker.jankuri.com)

## Installation: 


````shell
npm install ng2-datepicker
````

## Use Example:

```ts
import {Component} from 'angular2/core';
import {DatePicker} from 'ng2-datepicker/ng2-datepicker';

class Test {
  date: string;
}

@Component({
  template: `
    <date-picker [(ngModel)]="test.date"></date-picker>
    <date-picker [(ngModel)]="test1.date" view-format="DD.MM.YYYY" model-format="YYY-MM-DD" init-date="2017-05-12"></date-picker>
  `
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

