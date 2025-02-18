import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbedWebsiteComponent } from './embed-website.component';

describe('EmbedWebsiteComponent', () => {
  let component: EmbedWebsiteComponent;
  let fixture: ComponentFixture<EmbedWebsiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmbedWebsiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbedWebsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
