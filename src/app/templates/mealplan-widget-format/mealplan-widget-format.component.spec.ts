import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MealplanWidgetFormatComponent } from './mealplan-widget-format.component';

describe('MealplanWidgetFormatComponent', () => {
  let component: MealplanWidgetFormatComponent;
  let fixture: ComponentFixture<MealplanWidgetFormatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MealplanWidgetFormatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MealplanWidgetFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
