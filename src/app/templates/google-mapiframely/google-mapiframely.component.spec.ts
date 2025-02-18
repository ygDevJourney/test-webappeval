import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleMapiframelyComponent } from './google-mapiframely.component';

describe('GoogleMapiframelyComponent', () => {
  let component: GoogleMapiframelyComponent;
  let fixture: ComponentFixture<GoogleMapiframelyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleMapiframelyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleMapiframelyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
