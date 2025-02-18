import { TestBed } from '@angular/core/testing';

import { IframilyService } from './iframily.service';

describe('IframilyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IframilyService = TestBed.get(IframilyService);
    expect(service).toBeTruthy();
  });
});
