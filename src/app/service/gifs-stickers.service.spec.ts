import { TestBed } from '@angular/core/testing';

import { GifsStickersService } from './gifs-stickers.service';

describe('GifsStickersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GifsStickersService = TestBed.get(GifsStickersService);
    expect(service).toBeTruthy();
  });
});
