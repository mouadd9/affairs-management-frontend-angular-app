import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAgenciesComponentComponent } from './manage-agencies-component.component';

describe('ManageAgenciesComponentComponent', () => {
  let component: ManageAgenciesComponentComponent;
  let fixture: ComponentFixture<ManageAgenciesComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageAgenciesComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAgenciesComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
