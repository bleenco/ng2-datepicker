# ng2-datepicker
Angular2 Datepicker Component

***ng2-datepicker*** is a datepicker component for Angular2.

## Demo

https://plnkr.co/edit/MgvFblLHi4N3tyLVCWYD?p=preview

## Installation:
Datepicker relies on [momentjs](http://momentjs.com/) so you must first install it :

```shell
npm install moment -save
```

```shell
npm install ng2-datepicker@2.0.0-dev5
```

## Usage

 1. Import the `DatePickerModule`.
 2. Choose the datepicker you want to use and insert it into your template e.g. `<datepicker-ionic></datepicker-ionic>` (for the moment ionic is the only datepicker available, planning into creating a minimal, bootstrap and material datepickers).
 3. Choose one of the 3 select directive `singleSelect`, `multipleSelect` or `rangeSelect`, you can get more information about select directive [here](#select-directive) but at this point you can see it just as a mandatory parameter for all datepicker.
 4. Bind the date returned by the date picker using template-driven (ngModel) or model-driven (react). /!\ ***ng2-datepicker*** uses moment so all date are Moment object and not javascript Date.
 5. Enjoy :)

#### examples :
Single date picker using `ngModel` :
```ts
import * as moment from 'moment';

@Component({
  template: `
    <datepicker-ionic singleSelect ([ngModel])="date"></datepicker-ionic>
    date is {{ date.format('D MM YYYY') }}
  ...
})
export class AppComponent {
  date: moment.Moment;
}
```

Range date picker using reactive forms:
```ts
@Component({
    template: `
       <form [formGroup]="dataForm">
        <datepicker-ionic formControlName="date" multiSelect="4"></datepicker-ionic>
      </form>
    `,
    ...
})
export class AppComponent implements OnInit {
    dataForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit() {
      this.dataForm = this.formBuilder.group({
        date: []
      });
   }
 }
```

## Locale
Locale can be set globally using moment :
```js
moment.locale('fr');
```

or locally just for a specific datepicker through property binding :
```html
<datepicker-ionic singleSelect locale="ru"><datepicker-ionic>
```

In both case locale is only used for display purpose, locale won't be apply to any `Moment` objects.

## Select Directive
Select directive are responsible for the behavior of date selection. There is 3 select directive available : `singleSelect`, `multiSelect` and `rangeSelect` respectively for single date selection, multiple date selection and range date selection.

Options can be passed through property bindings :

|name|Description|
|:---|----------|:----------|:----------|
|minDate| Set a minimum date boundary|
|maxDate| Set a maximum date boundary|

`singleSelect` will return a *Moment* object, `multiSelect` will return an *array of Moment* Object and `rangeSelect` will return an object with 2 property `start` and `end` both being a *Moment* object.

Beside form binding, it's also possible to listen for changes through event binding on the `onDateChange` event.
```ts
import * as moment from 'moment';

@Component({
  template: '<datepicker-ionic multiSelect (onDateChange)="valueChanged($event)"><datepicker-ionic>
})
export class AppComponent {
  valueChanged(value: moment.Moment[]) {
    console.log('Value has changed : ', value);
  }
}
```

You can set a number to `multiSelect` in order to define how much date can be selected.


## Customize a datepicker

You can customize any predefined datepicker,  by defining new `@Component` properties like styles or template. To do so just follow those steps :

  1. create a new component and make it extend the base component class
  2. use the base component static function `extendConfig()` to define new `@Component` configuration. You can override any property and all properties not overridden will be inherited by the base component. Only **selector is mandatory**. *For now you can just override styles, you can't add a style (it is on the roadmap)*.

Here is a template :

```ts
import { DatePickerIonicComponent } from 'ng2-datepicker';

@Component(DatePickerIonicComponent.extendConfig({
  selector: 'datepicker-custom',
  template: '...', //use a different template
  styles: ['...'] //use your own css styles
}, CustomDatePickerComponent))
export class CustomDatePickerComponent extends DatePickerIonicComponent {
  //optionally override some functions
}
```

## Create your own component

You can also create your own date picker component while taking advantage of already defined core functionalities. A datepicker component is composed of 2 elements *template component* and *select directive*. A template is responsible of UI stuff (display, interaction...) while a select directive is responsible of date selection. Ideally all template should be compatible with all select directive but a template can be tied to a specific select directive.

### Creating a template
This starts exactly like customizing a datepicker component except you will extend from `DatePickerTemplate`. Then like for any extended class you must call the super constructor. And to finish you must initialise the months to be display (on `ngOnInit()` not `constructor()` !).

A template might be compatible with all select directive, in this case we will use generic type : `DatePickerTemplate<any, BaseSelect<any>>`.
Or a template might be compatible with just a specific select directive, in this case we will use the directive type e.g: `DatePickerTemplate<moment.Moment[], MultiSelectDirective<moment.Moment[]>>`.

```ts
import { DatePickerTemplate, formProvider } from 'ng2-datepicker';

@Component(DatePickerTemplate.extendConfig({
  // all properties below are mandatory
  selector: 'datepicker-custom',
  template: '...',
  styles: ['...'],
}))
export class CustomDatePickerComponent extends DatePickerTemplate<any, BaseSelect<any>> implements OnInit {

  constructor(select: BaseSelect<any>) {
    super(select);
  }

  ngOnInit() {
    this.initMonths( moment() );
  }
}
```
#### DatePickerTemplate API

|Property|Type / Signature|Description|
|:--- |:--- |:--- |
|locale|@Input: string \| false|set the locale locally for this component|
|viewFormat|@Input: string|Format to use when displaying dates.
|weekDaysName|string[]|List of week day's name according to the locale. TODO: Currently returns short name, make it configurable.
|select|BaseSelect|The directive used for selection. [see public API below](#baseselect-api).
|value|Moment \| Moment[]| Return current active dates. This is short for `this.select.value`.
|applyLocale|function(Moment): Moment|Apply(in-place) the current locale to the date passed as argument.
|onTouchedCallback|function()|Callback to call once the component has been touched. For [form track change](https://angular.io/docs/ts/latest/guide/forms.html#!#track-change-state-and-validity-with-ngmodel-).|
|months|Month[]|List of month to display. Use it as a read-only property unless you know what you're doing. To manipule it use helpers functions.|
|month|Month|Helper function when you only display 1 month it returns `months[0]`.|
|initMonths|function(...date: Moment[])|Initialise the months list|
|setMonth|function(date: Moment, index = 0)|Change the date of the month at specified index (default 0 if not specified).|

#### CalendarDay properties
```ts
date: Moment;
state: DateState;
isToday:     boolean;
isCurrDisplayMonth: boolean;
```

#### DateState enum
```js
disabled
enabled
inRange   //inRange is also enabled
active    //active is also inRange and enabled
```
see [DayClassesPipe](#dayclasses) to transform a `CalendarDay` into css classes according to it's sate.

### Creating a select directive
Exactly as for template you need to extend the base class and use `extendConfig()`.
```ts
import { BaseSelect } from 'ng2-datepicker';

@Directive(BaseSelect.extendConfig({
  selector: '[customSelect]', //selector must be an attribute selector
}, CustomSelectDirective)
export class CustomSelectDirective extends BaseSelect<some_type> {
  ....
}
```

#### BaseSelect API

`BaseSelect<T>` is the base class of select directives. Since all template should accept any select directive a template is not aware of the final parameterized type.

|Property|Type / Signature|Description|
|:--- |:--- |:--- |
|value|T|date(s) selected|
|minDate|@Input: Moment|minimum date boundary|
|maxDate|@Input: Moment|maximum date boundary|
|onDateChange|@Ouput: eventEmitter&lt;T&gt;|Observable emitting value on change|
|setValue| function(T)|Set a value if it pass all constraint (min,max, limit). Doing `value= ...` will set the value directly.|
|selectDate|function(Moment): boolean|Select a date and return true if succeed|
|unselectDate|function(Moment): boolean|Unselected a date and return true if date was previously selected|
|isDateSelected|function(Moment): boolean|return true if a date is part of the selection|
|isDateValid|function(Moment): boolean|return true if date is between boundaries (min & max)|
|getDateState|function(Moment): DateState|return states of a date. Meant for internal use of `DatePickerTemplate`.|

## Pipes

### MomentFormat
Use to convert Moment date into string.

Signature:
```js
momentFormat( date: Moment | Moment[], format = 'LL', locale?)
```

Example
```js
{{ date | momentFormat: 'M/D/Y':'en' }}
```

### DayClasses

Transform a `CalendarDay` into a object consumable by `ngClass` with boolean values defining if class should be added or removed. Classes are :
```js
enabled   //date is on the boundary range (min & max)
selected  //date is selected or between 2 selected date
active    //date is selected (TODO weird naming :/)

today     //date is today
currDisplayMonth //date is part of the current displayed month
```

Example
```html
<span *ngFor="let day of days"
  [ngClass]="day | dayClasses">
</span>
```

## DatePickerIonic

Options can be passed to `<datepicker-ionic>` component via property bindings.

|Property|Type|Required|Default|Description|
|:--- |:--- |:--- |:--- |:--- |
|`class`|string|No|`''`|CSS class name(s) to apply to datepicker's container|
|`expanded`|boolean|No|`false`|If set to `true`, calendar always displays the selected date|
|`opened`|boolean|No|`false`|Set to `true` to open the calendar by default|
|`viewFormat`|string|No|`D MMMM YYYY`|Date format to display in the view.|
[`displayDate`|Moment|No|today|The date to display on the calendar. *Only month and year are relevant*|

## Licence

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.

