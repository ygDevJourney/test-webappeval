import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageS3BucketComponent } from './manage-s3-bucket.component';

describe('ManageS3BucketComponent', () => {
  let component: ManageS3BucketComponent;
  let fixture: ComponentFixture<ManageS3BucketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageS3BucketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageS3BucketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
