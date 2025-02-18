import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetlayerComponent } from './widgetlayer.component';

describe('WidgetlayerComponent', () => {
  let component: WidgetlayerComponent;
  let fixture: ComponentFixture<WidgetlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
