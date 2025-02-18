import { TestBed } from '@angular/core/testing';

import { CommonFunction } from './common-function.service';

describe('DataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommonFunction = TestBed.get(CommonFunction);
    expect(service).toBeTruthy();
  });
});
