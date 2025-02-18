import { TestBed } from '@angular/core/testing';

import { MirrorService } from './mirror.service';

describe('MirrorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MirrorService = TestBed.get(MirrorService);
    expect(service).toBeTruthy();
  });
});
