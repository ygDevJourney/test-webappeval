import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPinWidgetComponent } from './confirm-pin-widget.component';

describe('ConfirmPinWidgetComponent', () => {
  let component: ConfirmPinWidgetComponent;
  let fixture: ComponentFixture<ConfirmPinWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmPinWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPinWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
