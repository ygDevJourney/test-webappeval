import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitMeasureComponent } from './unit-measure.component';

describe('ChangePasswordComponent', () => {
  let component: UnitMeasureComponent;
  let fixture: ComponentFixture<UnitMeasureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitMeasureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitMeasureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
