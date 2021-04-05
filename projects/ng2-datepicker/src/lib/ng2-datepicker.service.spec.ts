import { TestBed } from '@angular/core/testing';

import { Ng2DatepickerService } from './ng2-datepicker.service';

describe('Ng2DatepickerService', () => {
  let service: Ng2DatepickerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ng2DatepickerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
