import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateUpdateOptionComponent } from './template-update-option.component';

describe('TemplateUpdateOptionComponent', () => {
  let component: TemplateUpdateOptionComponent;
  let fixture: ComponentFixture<TemplateUpdateOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateUpdateOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateUpdateOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
