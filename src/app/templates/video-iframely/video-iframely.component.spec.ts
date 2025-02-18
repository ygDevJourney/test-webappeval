import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoIframelyComponent } from './video-iframely.component';

describe('VideoIframelyComponent', () => {
  let component: VideoIframelyComponent;
  let fixture: ComponentFixture<VideoIframelyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoIframelyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoIframelyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
