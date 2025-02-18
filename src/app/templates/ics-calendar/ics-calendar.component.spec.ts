import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcsCalendarComponent } from './ics-calendar.component';

describe('IcsCalendarComponent', () => {
  let component: IcsCalendarComponent;
  let fixture: ComponentFixture<IcsCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcsCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcsCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
