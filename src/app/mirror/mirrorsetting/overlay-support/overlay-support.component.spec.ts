import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlaySupportComponent } from './overlay-support.component';

describe('OverlaySupportComponent', () => {
  let component: OverlaySupportComponent;
  let fixture: ComponentFixture<OverlaySupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverlaySupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverlaySupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
