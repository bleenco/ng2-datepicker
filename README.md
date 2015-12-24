# ng2-datepicker
Angular2 Datepicker Component

***ng2-datepicker*** is a reusable component for Angular2.

## Demo

[http://jankuri.com/components/angular2-datepicker](http://jankuri.com/components/angular2-datepicker)

## Installation: 

```bash
npm i ng2-datepicker
```

If you are using SystemJS you can map to ng2-datepicker in your configuration.

```html
<!-- index.html -->
<script>
  SystemJS.config({
    map: {
      "ng2-slimscroll": "node_modules/ng2-slimscroll/ng2-slimscroll.js",
      "moment": "node_modules/moment/moment.js"
    }
  });
</script>
```

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
    <datepicker [(ngModel)]="test1.date" view-value="DD.MM.YYYY" model-value="DD.MM.YYYY" init-date="12.5.2017"></datepicker>
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

