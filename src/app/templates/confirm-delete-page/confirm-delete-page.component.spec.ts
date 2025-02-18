import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeletePageComponent } from './confirm-delete-page.component';

describe('ConfirmDeletePageComponent', () => {
  let component: ConfirmDeletePageComponent;
  let fixture: ComponentFixture<ConfirmDeletePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDeletePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeletePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
