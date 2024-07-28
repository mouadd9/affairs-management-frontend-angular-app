import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAffairsComponentComponent } from './manage-affairs-component.component';

describe('ManageAffairsComponentComponent', () => {
  let component: ManageAffairsComponentComponent;
  let fixture: ComponentFixture<ManageAffairsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageAffairsComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAffairsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
