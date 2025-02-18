import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateAddConfirmationComponent } from './template-add-confirmation.component';

describe('TemplateAddConfirmationComponent', () => {
  let component: TemplateAddConfirmationComponent;
  let fixture: ComponentFixture<TemplateAddConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateAddConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateAddConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
