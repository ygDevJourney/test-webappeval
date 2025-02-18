import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmViewDisplayComponent } from './confirm-view-display.component';

describe('ConfirmViewDisplayComponent', () => {
  let component: ConfirmViewDisplayComponent;
  let fixture: ComponentFixture<ConfirmViewDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmViewDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmViewDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
