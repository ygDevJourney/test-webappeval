import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MirrorOrientationSettingComponent } from './mirror-orientation-setting.component';

describe('MirrorOrientationSettingComponent', () => {
  let component: MirrorOrientationSettingComponent;
  let fixture: ComponentFixture<MirrorOrientationSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MirrorOrientationSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MirrorOrientationSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
