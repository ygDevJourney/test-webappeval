import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GifStickersComponent } from './gif-stickers.component';

describe('GifStickersComponent', () => {
  let component: GifStickersComponent;
  let fixture: ComponentFixture<GifStickersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GifStickersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GifStickersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
