import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsSettingComponent } from './news-setting.component';

describe('NewsSettingComponent', () => {
  let component: NewsSettingComponent;
  let fixture: ComponentFixture<NewsSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
