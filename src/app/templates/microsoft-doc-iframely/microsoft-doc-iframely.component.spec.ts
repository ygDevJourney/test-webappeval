import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicrosoftDocIframelyComponent } from './microsoft-doc-iframely.component';

describe('MicrosoftDocIframelyComponent', () => {
  let component: MicrosoftDocIframelyComponent;
  let fixture: ComponentFixture<MicrosoftDocIframelyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicrosoftDocIframelyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicrosoftDocIframelyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
