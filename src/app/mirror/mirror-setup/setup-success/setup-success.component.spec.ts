import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupSuccessComponent } from './setup-success.component';

describe('SetupSuccessComponent', () => {
  let component: SetupSuccessComponent;
  let fixture: ComponentFixture<SetupSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
