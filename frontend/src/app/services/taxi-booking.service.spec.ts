import { TestBed } from '@angular/core/testing';

import { TaxiBookingService } from './taxi-booking.service';

describe('TaxiBookingService', () => {
  let service: TaxiBookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaxiBookingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
