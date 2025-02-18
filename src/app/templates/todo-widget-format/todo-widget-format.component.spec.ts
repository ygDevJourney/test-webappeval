import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoWidgetFormatComponent } from './todo-widget-format.component';

describe('TodoWidgetFormatComponent', () => {
  let component: TodoWidgetFormatComponent;
  let fixture: ComponentFixture<TodoWidgetFormatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoWidgetFormatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoWidgetFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
