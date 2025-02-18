import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmFactoryResetComponent } from './confirm-factory-reset.component';

describe('ConfirmFactoryResetComponent', () => {
  let component: ConfirmFactoryResetComponent;
  let fixture: ComponentFixture<ConfirmFactoryResetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmFactoryResetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmFactoryResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
