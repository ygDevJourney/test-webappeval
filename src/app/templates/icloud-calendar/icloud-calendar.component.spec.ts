import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcloudCalendarComponent } from './icloud-calendar.component';

describe('IcloudCalendarComponent', () => {
  let component: IcloudCalendarComponent;
  let fixture: ComponentFixture<IcloudCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcloudCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcloudCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
