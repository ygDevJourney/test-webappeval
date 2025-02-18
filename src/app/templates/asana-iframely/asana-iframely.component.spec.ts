import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsanaIframelyComponent } from './asana-iframely.component';

describe('AsanaIframelyComponent', () => {
  let component: AsanaIframelyComponent;
  let fixture: ComponentFixture<AsanaIframelyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsanaIframelyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsanaIframelyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
