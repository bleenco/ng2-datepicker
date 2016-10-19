import { Directive, forwardRef } from '@angular/core';
import * as moment from 'moment';

import { BaseSelect } from './base.select';
import { MultiSelectDirective } from './mulit.select';

@Directive({
  selector: '[rangeSelect]',
  providers: [{
    provide: BaseSelect, useExisting: forwardRef(() => RangeSelectDirective)
  }]
})
export class RangeSelectDirective extends MultiSelectDirective {

  protected formatValue(dates: moment.Moment[]) {
    let newValue = super.formatValue(dates);

    if (newValue.length > 2)
        newValue.splice(0, newValue.length - 2);

    return newValue;
  }
}
