import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteSubscriptionComponent } from './confirm-delete-subscription.component';

describe('ConfirmDeleteWidgetComponent', () => {
  let component: ConfirmDeleteSubscriptionComponent;
  let fixture: ComponentFixture<ConfirmDeleteSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteSubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
