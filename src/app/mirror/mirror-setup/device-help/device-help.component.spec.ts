import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceHelpComponent } from './device-help.component';

describe('DeviceHelpComponent', () => {
  let component: DeviceHelpComponent;
  let fixture: ComponentFixture<DeviceHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
