import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoresWidgetFormatComponent } from './chores-widget-format.component';

describe('ChoresWidgetFormatComponent', () => {
  let component: ChoresWidgetFormatComponent;
  let fixture: ComponentFixture<ChoresWidgetFormatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoresWidgetFormatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoresWidgetFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
