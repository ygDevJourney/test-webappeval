import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MirrorsettingComponent } from './mirrorsetting.component';

describe('MirrorsettingComponent', () => {
  let component: MirrorsettingComponent;
  let fixture: ComponentFixture<MirrorsettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MirrorsettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MirrorsettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
