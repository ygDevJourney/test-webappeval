import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleDocIframelyComponent } from './google-doc-iframely.component';

describe('GoogleDocIframelyComponent', () => {
  let component: GoogleDocIframelyComponent;
  let fixture: ComponentFixture<GoogleDocIframelyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleDocIframelyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleDocIframelyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
