import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAffairsComponent } from './manage-affairs.component';

describe('ManageAffairsComponent', () => {
  let component: ManageAffairsComponent;
  let fixture: ComponentFixture<ManageAffairsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageAffairsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAffairsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
