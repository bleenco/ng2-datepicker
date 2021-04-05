import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ng2DatepickerComponent } from './ng2-datepicker.component';

describe('Ng2DatepickerComponent', () => {
  let component: Ng2DatepickerComponent;
  let fixture: ComponentFixture<Ng2DatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ng2DatepickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ng2DatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
