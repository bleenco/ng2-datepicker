import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

@Pipe({
  name: 'momentFormat'
})
export class MomentFormatPipe implements PipeTransform {

   transform(date: moment.Moment, format = 'D MMMM YYYY'): string {
    if (!date)
      return '';

    return date.format(format);
  }
}
