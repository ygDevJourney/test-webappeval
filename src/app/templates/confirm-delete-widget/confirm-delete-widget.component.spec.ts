import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteWidgetComponent } from './confirm-delete-widget.component';

describe('ConfirmDeleteWidgetComponent', () => {
  let component: ConfirmDeleteWidgetComponent;
  let fixture: ComponentFixture<ConfirmDeleteWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
