import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAgenciesComponent } from './manage-agencies.component';

describe('ManageAgenciesComponent', () => {
  let component: ManageAgenciesComponent;
  let fixture: ComponentFixture<ManageAgenciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageAgenciesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAgenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
