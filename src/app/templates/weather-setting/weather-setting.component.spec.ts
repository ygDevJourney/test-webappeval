import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherSettingComponent } from './weather-setting.component';

describe('WidgetCategoryComponent', () => {
  let component: WeatherSettingComponent;
  let fixture: ComponentFixture<WeatherSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeatherSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
