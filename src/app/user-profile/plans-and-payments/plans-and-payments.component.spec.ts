import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlansAndPaymentsComponent } from './plans-and-payments.component';

describe('PlansAndPaymentsComponent', () => {
  let component: PlansAndPaymentsComponent;
  let fixture: ComponentFixture<PlansAndPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlansAndPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlansAndPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
