# ng2-datepicker
Angular2 Datepicker Component

***ng2-datepicker*** is a datepicker component for Angular2.

## Demo

[http://jankuri.com/components/angular2-datepicker](http://jankuri.com/components/angular2-datepicker)

## Installation: 

This component is compatible with `angular-cli` and it's recommended way to use it in conjunction with it.
Note that you **must** use `angular-cli` current master as `npm` package is outdated.

### Installation procedure:
````shell
git clone https://github.com/angular/angular-cli.git
cd angular-cli 
npm install
npm link
````
````shell
ng new your-project-name
cd your-project-name
npm link angular-cli
ng install ng2-datepicker
````

## Use Example:

```ts
import {Component} from 'angular2/core';
import {FORM_DIRECTIVES} from 'angular2/common';
import {DatePicker} from 'ng2-datepicker';

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

## Author

[Jan Kuri](http://www.jankuri.com)

## Licence

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.

