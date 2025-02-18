import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirtableIframelyComponent } from './airtable-iframely.component';

describe('AirtableIframelyComponent', () => {
  let component: AirtableIframelyComponent;
  let fixture: ComponentFixture<AirtableIframelyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirtableIframelyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirtableIframelyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
