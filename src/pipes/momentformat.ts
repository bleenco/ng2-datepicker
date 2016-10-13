import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

@Pipe({
  name: 'momentFormat'
})
export class MomentFormatPipe implements PipeTransform {

   transform(date: (moment.Moment | moment.Moment[]), format = 'D MMMM YYYY'): string {
    //this short version cause trouble to typescript
    //let d = (date && date instanceof moment.Moment[]) ? date[0] : date

    let d: moment.Moment;
    if (date && date instanceof Array)
      d = date[0];
     else
      d = <moment.Moment>date;

    if (!d)
      return '';

    return d.format(format);
  }
}
