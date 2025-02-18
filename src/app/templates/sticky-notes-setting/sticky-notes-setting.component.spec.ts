import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StickyNotesSettingComponent } from './sticky-notes-setting.component';

describe('StickyNotesSettingComponent', () => {
  let component: StickyNotesSettingComponent;
  let fixture: ComponentFixture<StickyNotesSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StickyNotesSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StickyNotesSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
