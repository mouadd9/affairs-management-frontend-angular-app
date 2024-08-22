import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyEmployeeTemplateComponent } from './agency-employee-template.component';

describe('AgencyEmployeeTemplateComponent', () => {
  let component: AgencyEmployeeTemplateComponent;
  let fixture: ComponentFixture<AgencyEmployeeTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgencyEmployeeTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgencyEmployeeTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
