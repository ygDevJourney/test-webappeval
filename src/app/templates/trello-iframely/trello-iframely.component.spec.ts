import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrelloIframelyComponent } from './trello-iframely.component';

describe('TrelloIframelyComponent', () => {
  let component: TrelloIframelyComponent;
  let fixture: ComponentFixture<TrelloIframelyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrelloIframelyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrelloIframelyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
