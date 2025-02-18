import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDeviceCodeComponent } from './update-device-code.component';

describe('UpdateDeviceCodeComponent', () => {
  let component: UpdateDeviceCodeComponent;
  let fixture: ComponentFixture<UpdateDeviceCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateDeviceCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateDeviceCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
