import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetCategoryComponent } from './widget-category.component';

describe('WidgetCategoryComponent', () => {
  let component: WidgetCategoryComponent;
  let fixture: ComponentFixture<WidgetCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
