import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountDownWidgetComponent } from './count-down-widget.component';

describe('CountDownWidgetComponent', () => {
  let component: CountDownWidgetComponent;
  let fixture: ComponentFixture<CountDownWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountDownWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountDownWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
