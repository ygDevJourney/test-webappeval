import { TestBed } from '@angular/core/testing';

import { ImageWidgetService } from './image-widget.service';

describe('ImageWidgetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImageWidgetService = TestBed.get(ImageWidgetService);
    expect(service).toBeTruthy();
  });
});
