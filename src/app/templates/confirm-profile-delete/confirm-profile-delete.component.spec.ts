import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmProfileDeleteComponent } from './confirm-profile-delete.component';

describe('ConfirmProfileDeleteComponent', () => {
  let component: ConfirmProfileDeleteComponent;
  let fixture: ComponentFixture<ConfirmProfileDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmProfileDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmProfileDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
