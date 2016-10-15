import { Pipe, PipeTransform } from '@angular/core';

import { CalendarDay, DayState } from '../calendarday';

@Pipe({
  name: 'dayClasses'
})
export class DayClassesPipe implements PipeTransform {

   transform(day: CalendarDay): { [name: string]: boolean} {
    let classes = {
        enabled: false,
        selected: false,
        active: false,

        today: day.isToday,
        currDisplayMonth: day.isCurrDisplayMonth
    };

    if (day.state > DayState.disabled)
      classes[ DayState[day.state] ] = true;

    return classes;
  }
}
