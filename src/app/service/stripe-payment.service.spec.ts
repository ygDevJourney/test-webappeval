import { TestBed } from '@angular/core/testing';

import { StripePaymentService } from './stripe-payment.service';

describe('StripePaymentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StripePaymentService = TestBed.get(StripePaymentService);
    expect(service).toBeTruthy();
  });
});
