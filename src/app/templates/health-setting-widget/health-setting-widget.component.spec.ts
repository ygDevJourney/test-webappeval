import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthSettingWidgetComponent } from './health-setting-widget.component';

describe('HealthSettingWidgetComponent', () => {
  let component: HealthSettingWidgetComponent;
  let fixture: ComponentFixture<HealthSettingWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthSettingWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthSettingWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
