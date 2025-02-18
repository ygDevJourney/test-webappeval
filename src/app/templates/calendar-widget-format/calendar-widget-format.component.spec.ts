import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarWidgetFormatComponent } from './calendar-widget-format.component';

describe('CalendarWidgetFormatComponent', () => {
  let component: CalendarWidgetFormatComponent;
  let fixture: ComponentFixture<CalendarWidgetFormatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarWidgetFormatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarWidgetFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
