import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupDeviceComponent } from './setup-device.component';

describe('SetupDeviceComponent', () => {
  let component: SetupDeviceComponent;
  let fixture: ComponentFixture<SetupDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
