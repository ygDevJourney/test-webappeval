import { TestBed } from '@angular/core/testing';

import { ApiCallLogService } from './api-call-log.service';

describe('ApiCallLogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiCallLogService = TestBed.get(ApiCallLogService);
    expect(service).toBeTruthy();
  });
});
