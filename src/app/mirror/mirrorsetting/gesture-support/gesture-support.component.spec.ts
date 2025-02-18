import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestureSupportComponent } from './gesture-support.component';

describe('GestureSupportComponent', () => {
  let component: GestureSupportComponent;
  let fixture: ComponentFixture<GestureSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestureSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestureSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
