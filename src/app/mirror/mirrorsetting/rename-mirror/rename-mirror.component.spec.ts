import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameMirrorComponent } from './rename-mirror.component';

describe('RenameMirrorComponent', () => {
  let component: RenameMirrorComponent;
  let fixture: ComponentFixture<RenameMirrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenameMirrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenameMirrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
