import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmUnpinWidgetComponent } from './confirm-unpin-widget.component';

describe('ConfirmUnpinWidgetComponent', () => {
  let component: ConfirmUnpinWidgetComponent;
  let fixture: ComponentFixture<ConfirmUnpinWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmUnpinWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmUnpinWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
