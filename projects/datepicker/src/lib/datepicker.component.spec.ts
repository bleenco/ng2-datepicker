import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, waitForAsync } from '@angular/core/testing';
import { addMonths, isSameMonth, subMonths } from 'date-fns';
import { DatepickerComponent } from './datepicker.component';

describe('DatepickerComponent', () => {
  let component: DatepickerComponent;
  let fixture: ComponentFixture<DatepickerComponent>;
  let input: HTMLInputElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DatepickerComponent],
        providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new MouseEvent('click'));
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should open calendar on input click and close it back when clicking again', () => {
    input.dispatchEvent(new MouseEvent('click'));
    expect(component.isOpened).toBeFalse();
    input.dispatchEvent(new MouseEvent('click'));
    expect(component.isOpened).toBeTrue();
    expect(fixture.nativeElement.querySelector('.calendar-container')).toBeTruthy();
    input.dispatchEvent(new MouseEvent('click'));
    expect(fixture.nativeElement.querySelector('.calendar-container')).toBeFalsy();
    expect(component.isOpened).toBeFalse();
  });

  it('should always open calendar with days view', () => {
    expect(component.view).toEqual('days');
    expect(fixture.nativeElement.querySelector('.main-calendar-container.is-days')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.main-calendar-container.is-years')).toBeFalsy();

    input.dispatchEvent(new MouseEvent('click'));
    input.dispatchEvent(new MouseEvent('click'));
    expect(component.view).toEqual('days');
    expect(fixture.nativeElement.querySelector('.main-calendar-container.is-days')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.main-calendar-container.is-years')).toBeFalsy();

    const toggle = fixture.nativeElement.querySelector('.month-year-text > span') as HTMLSpanElement;
    toggle.dispatchEvent(new MouseEvent('click'));
    expect(component.view).toEqual('years');
    expect(fixture.nativeElement.querySelector('.main-calendar-container.is-days')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('.main-calendar-container.is-years')).toBeTruthy();

    input.dispatchEvent(new MouseEvent('click'));
    input.dispatchEvent(new MouseEvent('click'));
    expect(component.view).toEqual('days');
    expect(fixture.nativeElement.querySelector('.main-calendar-container.is-days')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.main-calendar-container.is-years')).toBeFalsy();
  });

  it('should go to previous month on left carot click', () => {
    const prev = fixture.nativeElement.querySelector('.controls.prev-month > svg') as SVGElement;

    expect(isSameMonth(component.date, new Date())).toBeTrue();
    prev.dispatchEvent(new MouseEvent('click'));
    expect(isSameMonth(component.date, new Date())).toBeFalse();
    expect(isSameMonth(component.date, subMonths(new Date(), 1))).toBeTrue();

    const n = randInt(100);
    for (let i = 0; i < n - 1; i++) {
      prev.dispatchEvent(new MouseEvent('click'));
    }

    expect(isSameMonth(component.date, subMonths(new Date(), n))).toBeTrue();
  });

  it('should go to next month on right carot click', () => {
    const next = fixture.nativeElement.querySelector('.controls.next-month > svg') as SVGElement;

    expect(isSameMonth(component.date, new Date())).toBeTrue();
    next.dispatchEvent(new MouseEvent('click'));
    expect(isSameMonth(component.date, new Date())).toBeFalse();
    expect(isSameMonth(component.date, addMonths(new Date(), 1))).toBeTrue();

    const n = randInt(100);
    for (let i = 0; i < n - 1; i++) {
      next.dispatchEvent(new MouseEvent('click'));
    }

    expect(isSameMonth(component.date, addMonths(new Date(), n))).toBeTrue();
  });
});

const randInt = (max: number = 10): number => {
  return Math.floor(Math.random() * max);
};
