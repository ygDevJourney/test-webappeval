import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetBgSettingComponent } from './widget-bg-setting.component';

describe('WidgetBgSettingComponent', () => {
  let component: WidgetBgSettingComponent;
  let fixture: ComponentFixture<WidgetBgSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetBgSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetBgSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
