import { Moment } from 'moment';

export enum DateState {
  disabled,
  enabled,
  selected, //selected is also enabled
  active    //active is also selected and enabled
}

export interface CalendarDay {
  date: Moment;

  state: DayState;

  isToday:     boolean;
  isCurrDisplayMonth: boolean;
}
