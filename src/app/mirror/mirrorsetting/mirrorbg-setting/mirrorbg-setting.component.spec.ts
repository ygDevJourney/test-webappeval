import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MirrorbgSettingComponent } from './mirrorbg-setting.component';


describe('MirrorbgSettingComponent', () => {
  let component: MirrorbgSettingComponent;
  let fixture: ComponentFixture<MirrorbgSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MirrorbgSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MirrorbgSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
