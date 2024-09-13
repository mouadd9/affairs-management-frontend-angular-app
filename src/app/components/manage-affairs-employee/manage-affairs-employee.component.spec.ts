import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAffairsEmployeeComponent } from './manage-affairs-employee.component';

describe('ManageAffairsEmployeeComponent', () => {
  let component: ManageAffairsEmployeeComponent;
  let fixture: ComponentFixture<ManageAffairsEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageAffairsEmployeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAffairsEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
