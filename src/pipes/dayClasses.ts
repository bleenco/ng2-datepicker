import { Pipe, PipeTransform } from '@angular/core';

import { CalendarDay, DateState } from '../models';

@Pipe({
  name: 'dayClasses'
})
export class DayClassesPipe implements PipeTransform {

   transform(day: CalendarDay): { [name: string]: boolean} {
    let classes: { [name: string]: boolean } = {
        enabled: false,
        inRange: false,
        selected: false,

        today: day.isToday,
        currDisplayMonth: day.isCurrDisplayMonth
    };

    if (day.state > DateState.disabled)
      classes[ DateState[day.state] ] = true;

    return classes;
  }
}