import { Moment } from 'moment';

export enum DateState {
  disabled,
  enabled,
  inRange,   //inRange is also enabled
  selected   //active is also selected and enabled
}

export interface CalendarDay {
  date: Moment;

  state: DateState;

  isToday:     boolean;
  isCurrDisplayMonth: boolean;
}
