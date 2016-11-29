import { Pipe } from '@angular/core';
import moment from 'moment';

@Pipe({
	name: 'eqMoment'
})
export class EqualMomentPipe {
	transform(value: moment.Moment, compare: moment.Moment, unit = 'd'): boolean {
		if(!value || !compare)
			return !value && !compare;

		//TODO bad types, weird
		return value.isSame(compare, <any>unit);
	}

}
